import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const defaultDb = {
  campaigns: [],
  characters: [],
};

function loadDb() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
      return defaultDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading DB:', error);
    return defaultDb;
  }
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving DB:', error);
  }
}

// API Routes
app.get('/api/characters', (req, res) => {
  const db = loadDb();
  res.json(db.characters);
});

app.post('/api/characters', (req, res) => {
  const db = loadDb();
  const newChar = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
  db.characters.push(newChar);
  saveDb(db);
  res.json(newChar);
});

app.put('/api/characters/:id', (req, res) => {
  const db = loadDb();
  const index = db.characters.findIndex((c: any) => c.id === req.params.id);
  if (index !== -1) {
    db.characters[index] = { ...db.characters[index], ...req.body };
    saveDb(db);
    res.json(db.characters[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.get('/api/campaigns', (req, res) => {
  const db = loadDb();
  res.json(db.campaigns);
});

app.post('/api/campaigns', (req, res) => {
  const db = loadDb();
  const newCamp = {
    ...req.body,
    id: Date.now().toString(),
    code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    players: [],
    notes: [],
    messages: [],
    map: { gridEnabled: true, markers: [] },
    combat: { active: false, combatants: [], currentTurnIndex: 0, round: 1 },
    createdAt: new Date().toISOString(),
  };
  db.campaigns.push(newCamp);
  saveDb(db);
  res.json(newCamp);
});

app.post('/api/campaigns/join', (req, res) => {
  const db = loadDb();
  const { code, userId, userName, characterId } = req.body;
  const camp = db.campaigns.find((c: any) => c.code === code);
  if (camp) {
    if (!camp.players.find((p: any) => p.userId === userId)) {
      camp.players.push({ userId, userName, characterId });
      saveDb(db);
    }
    res.json(camp);
  } else {
    res.status(404).json({ error: 'Invalid code' });
  }
});

app.put('/api/campaigns/:id', (req, res) => {
  const db = loadDb();
  const index = db.campaigns.findIndex((c: any) => c.id === req.params.id);
  if (index !== -1) {
    db.campaigns[index] = { ...db.campaigns[index], ...req.body };
    saveDb(db);
    res.json(db.campaigns[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.post('/api/campaigns/:id/chat', (req, res) => {
  const db = loadDb();
  const index = db.campaigns.findIndex((c: any) => c.id === req.params.id);
  if (index !== -1) {
    db.campaigns[index].messages.push(req.body);
    saveDb(db);
    res.json(db.campaigns[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.post('/api/campaigns/:id/notes', (req, res) => {
  const db = loadDb();
  const index = db.campaigns.findIndex((c: any) => c.id === req.params.id);
  if (index !== -1) {
    db.campaigns[index].notes.push(req.body);
    saveDb(db);
    res.json(db.campaigns[index]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.post('/api/gemini/generate-character', async (req, res) => {
  try {
    const { system, archetype, attributes } = req.body;
    const prompt = `Você é um mestre de RPG. Gere um personagem no sistema ${system} focado no arquétipo: ${archetype} com ênfase em ${attributes}.
Retorne estritamente um JSON com:
{
  "name": "Nome",
  "race": "Raça",
  "class": "Classe",
  "alignment": "Alinhamento",
  "backstory": "História",
  "personality": "Personalidade",
  "appearance": "Aparência",
  "stats": { "hp": 10, "maxHp": 10, "ac": 12, "speed": "9m", "initiative": 2 },
  "attributes": { "For": 10, "Des": 12, "Con": 10, "Int": 14, "Sab": 10, "Car": 16 },
  "skills": [{ "name": "Diplomacia", "bonus": 5, "trained": true }],
  "inventory": [{ "name": "Adaga", "quantity": 1, "description": "Lâmina simples" }],
  "abilities": [{ "name": "Inspirar", "description": "Dá bônus aos aliados" }]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
