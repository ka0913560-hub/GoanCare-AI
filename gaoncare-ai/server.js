const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const net = require('net');

const app = express();
const PREFERRED_PORT = Number(process.env.PORT) || 3000;
let SELECTED_PORT = PREFERRED_PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Provider selection via env: openai | gemini | huggingface (default: gemini)
const PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const HF_API_KEY = process.env.HF_API_KEY || '';

// Default model choices (override via env if needed)
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const HF_MODEL = process.env.HF_MODEL || 'mistralai/Mixtral-8x7B-Instruct-v0.1';

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});
console.log(`🔌 AI provider active: ${PROVIDER.toUpperCase()}`);
if (PROVIDER === 'gemini') {
  console.log(`🤖 Using Gemini model: ${GEMINI_MODEL}`);
  console.log('🧠 Endpoint active: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash');
}

// Diagnostic: test Gemini connectivity
app.get('/api/test-gemini', async (req, res) => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const body = {
      contents: [{ role: 'user', parts: [{ text: 'Reply exactly: Hello Gemini! 👋' }] }]
    };
    const response = await axios.post(url, body);
    const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text found.';
    res.json({
      success: true,
      provider: 'gemini',
      answer: String(text).trim(),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    const details = err?.response?.data || err?.message;
    console.error('Test Gemini failed:', details);
    res.status(500).json({
      success: false,
      provider: 'gemini',
      error: 'Gemini API v1 request failed',
      details,
      timestamp: new Date().toISOString()
    });
  }
});

// Base info for frontend debugging
app.get('/api/base', (req, res) => {
  res.json({
    success: true,
    provider: PROVIDER,
    port: SELECTED_PORT,
    base: `http://localhost:${SELECTED_PORT}`,
    timestamp: new Date().toISOString()
  });
});

// AI Health Advice Route
app.post('/ai/health-advice', async (req, res) => {
  try {
    const { question, history } = req.body;

    // Validate input
    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ error: 'Question field is required and must be a non-empty string' });
    }

    // Detect intent and build tailored prompt
    const intent = detectIntent(question);
    const systemPrompt = buildSystemPrompt(intent);
    const userPrompt = buildUserPrompt(intent, question);

    // Compose messages including short prior history if provided
    const messages = composeMessages(systemPrompt, history, userPrompt);

    // Call selected provider
    const answer = await generateWithProvider({ provider: PROVIDER, messages });

    res.json({
      answer,
      intent,
      success: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in /ai/health-advice:', error);
    
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Internal Server Error';
    
    res.status(statusCode).json({ 
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString()
    });
  }
});

// Alias route: /askHealth -> same behavior for mobile client compatibility
app.post('/askHealth', async (req, res) => {
  try {
    const { question, history } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ error: 'Question field is required and must be a non-empty string' });
    }

    const intent = detectIntent(question);
    const systemPrompt = buildSystemPrompt(intent);
    const userPrompt = buildUserPrompt(intent, question);
    const messages = composeMessages(systemPrompt, history, userPrompt);
    let answer;
    try {
      answer = await generateWithProvider({ provider: PROVIDER, messages });
    } catch (err) {
      if (err && err.geminiDetails) {
        const details = typeof err.geminiDetails === 'string' ? err.geminiDetails : JSON.stringify(err.geminiDetails);
        console.error('Gemini error:', details);
        return res.status(500).json({
          success: false,
          provider: 'gemini',
          error: 'Gemini API v1 request failed',
          details,
          timestamp: new Date().toISOString()
        });
      }
      throw err;
    }

    res.json({
      answer,
      intent,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /askHealth:', error);
    res.status(error.statusCode || 500).json({
      error: error.message || 'Internal Server Error',
      success: false,
      timestamp: new Date().toISOString()
    });
  }
});

// -------- Intent detection & prompting --------
function detectIntent(question) {
  const q = question.toLowerCase();
  const rules = [
    { intent: 'symptoms',    match: /(symptom|signs|how do i know|indicators)/ },
    { intent: 'causes',      match: /(cause|why does|due to|reasons)/ },
    { intent: 'remedies',    match: /(remedy|home remedy|treat at home|manage at home|tips)/ },
    { intent: 'first_aid',   match: /(first aid|emergency|what to do immediately|immediate care)/ },
    { intent: 'side_effects',match: /(side effect|adverse|risk of|is it safe)/ },
    { intent: 'difference',  match: /(difference|vs\.|compare|comparison)/ },
    { intent: 'diet',        match: /(diet|foods|eat|meal|nutrition)/ },
    { intent: 'explanation', match: /(what is|explain|overview|definition|about)/ },
  ];
  const found = rules.find(r => r.match.test(q));
  // Heuristic refinements for frequent topics
  if (!found && /(fever|cold|cough|dengue|diabetes|hypertension|asthma)/.test(q)) {
    return 'explanation';
  }
  return found ? found.intent : 'explanation';
}

function buildSystemPrompt(intent) {
  return [
    'You are AI Health Assistant. Answer briefly (2-6 bullet points or 3 short lines).',
    'Use simple, medically accurate language. Avoid diagnostics or prescriptions.',
    'Add clear do/do-not guidance where relevant. Include red-flag/seek care notes when appropriate.',
    `Intent: ${intent}. Tailor structure to this intent.`,
    'If user asks multiple topics, address each clearly and concisely.',
    'Include a one-line disclaimer: "Not a substitute for professional medical advice."'
  ].join('\n');
}

function buildUserPrompt(intent, question) {
  const intentStyles = {
    symptoms: 'List common symptoms and typical duration; include red flags to seek care.',
    causes: 'List common causes and brief mechanisms; keep concise.',
    remedies: 'Provide safe home-care steps and when to escalate. Avoid drug dosing.',
    first_aid: 'Provide immediate steps in order, safety first, then when to go to ER.',
    side_effects: 'List common and serious side effects, interactions to avoid, red flags.',
    difference: 'Contrast simply with 2-4 bullet differences and when it matters.',
    diet: 'Give simple diet plan: do, limit, avoid; hydration; sample day outline.',
    explanation: 'Give a plain-language overview, key points, and when to seek care.'
  };
  const style = intentStyles[intent] || intentStyles.explanation;
  return `User question: ${question}\nAnswer style: ${style}`;
}

function composeMessages(systemPrompt, history, userPrompt) {
  const msgs = [];
  msgs.push({ role: 'system', content: systemPrompt });
  const safeHistory = Array.isArray(history) ? history.slice(-8) : [];
  for (const m of safeHistory) {
    if (!m || !m.role || !m.content) continue;
    const role = m.role === 'assistant' ? 'assistant' : 'user';
    msgs.push({ role, content: String(m.content) });
  }
  msgs.push({ role: 'user', content: userPrompt });
  return msgs;
}

// -------- Provider adapters --------
async function generateWithProvider({ provider, messages }) {
  switch (provider) {
    case 'openai':
      return await callOpenAI(messages);
    case 'gemini':
      // Combine user messages into a single prompt string for Gemini 2.0 Flash
      {
        const prompt = Array.isArray(messages)
          ? messages.filter(m => m.role === 'user').map(m => String(m.content || '').trim()).filter(Boolean).join('\n')
          : '';
        return await callGemini(prompt);
      }
    case 'huggingface':
      return await callHuggingFace(messages);
    default:
      return await callOpenAI(messages);
  }
}

async function callOpenAI(messages) {
  if (!OPENAI_API_KEY) {
    console.warn('[AI] OPENAI_API_KEY missing. Using local fallback answers.');
    return generateLocalAnswer(messages);
  }
  const resp = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    { model: OPENAI_MODEL, messages, temperature: 0.3, max_tokens: 300 },
    { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
  );
  return resp.data.choices?.[0]?.message?.content?.trim() || 'No answer';
}

async function callGemini(prompt) {
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    const headers = {
      "Content-Type": "application/json",
      "X-goog-api-key": process.env.GEMINI_API_KEY
    };
    const body = JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const response = await fetch(url, { method: "POST", headers, body });
    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini request failed:", data);
      const e = new Error(data.error?.message || "Gemini request failed");
      e.geminiDetails = data;
      throw e;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found.";
    return text.trim();
  } catch (err) {
    console.error("Error in callGemini:", err);
    throw err;
  }
}

async function callHuggingFace(messages) {
  if (!HF_API_KEY) {
    console.warn('[AI] HF_API_KEY missing. Using local fallback answers.');
    return generateLocalAnswer(messages);
  }
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  const resp = await axios.post(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    { inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.3 } },
    { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
  );
  const data = Array.isArray(resp.data) ? resp.data[0] : resp.data;
  return data?.generated_text?.replace(prompt, '').trim() || 'No answer';
}

// Fallback local templated answer if provider key is missing
function generateLocalAnswer(messages) {
  const lastUser = messages.slice().reverse().find(m => m.role === 'user');
  const intentLine = messages[0]?.content || '';
  const intent = /Intent:\s*(\w+)/i.exec(intentLine)?.[1] || 'explanation';
  const q = lastUser?.content || '';
  const map = {
    symptoms: [
      'Common symptoms include fever, fatigue, and body aches.',
      'Duration is usually short (3–7 days).',
      'Seek care if high fever, confusion, or breathing trouble.'
    ],
    remedies: [
      'Rest, fluids, light meals; avoid dehydration.',
      'Use cool compress; avoid self-medicating antibiotics.',
      'Seek care if symptoms persist >3 days or worsen.'
    ],
    side_effects: [
      'Common: nausea, stomach upset, mild rash.',
      'Serious (rare): allergy, liver issues—stop and seek care if jaundice.',
      'Avoid mixing with alcohol or duplicate ingredients.'
    ],
    difference: [
      'Viral: gradual onset, body aches; antibiotics not useful.',
      'Bacterial: focal signs (e.g., pus), may need antibiotics.',
      'Testing/doctor review confirms diagnosis.'
    ],
    diet: [
      'Do: fluids, soups, fruits; small frequent meals.',
      'Limit: spicy/fried foods; avoid alcohol.',
      'Focus on protein and electrolytes for recovery.'
    ],
    first_aid: [
      'Ensure safety, check airway/breathing/circulation.',
      'Cool the body if fever; avoid ice water baths.',
      'Call emergency services for red flags.'
    ],
    causes: [
      'Often due to viral infections; sometimes bacterial or inflammatory.',
      'Dehydration and heat can contribute.',
      'Medical review if severe or recurrent.'
    ],
    explanation: [
      'A short-lived illness with fever and malaise is common.',
      'Supportive care helps most cases resolve.',
      'See a clinician for severe, persistent, or unusual symptoms.'
    ]
  };
  const bullets = map[intent] || map.explanation;
  return [
    bullets.map(b => `• ${b}`).join('\n'),
    '',
    'Not a substitute for professional medical advice.'
  ].join('\n');
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.statusCode || 500).json({ 
    error: err.message || 'Internal Server Error',
    success: false,
    timestamp: new Date().toISOString()
  });
});

// ---- Auto port detection & startup ----
async function findAvailablePort(startPort) {
  async function check(port) {
    return new Promise(resolve => {
      const tester = net.createServer()
        .once('error', err => {
          if (err.code === 'EADDRINUSE') {
            resolve(false);
          } else {
            resolve(false);
          }
        })
        .once('listening', () => {
          tester.close(() => resolve(true));
        })
        .listen(port, '0.0.0.0');
    });
  }

  let port = startPort;
  // try up to +100 range to avoid infinite loops
  for (let i = 0; i < 100; i += 1) {
    /* eslint-disable no-await-in-loop */
    const free = await check(port);
    /* eslint-enable no-await-in-loop */
    if (free) return port;
    port += 1;
  }
  throw new Error('No available port found in range.');
}

(async () => {
  try {
    const selectedPort = await findAvailablePort(PREFERRED_PORT);
    SELECTED_PORT = selectedPort;
    if (selectedPort !== PREFERRED_PORT) {
      console.warn(`⚡ Port ${PREFERRED_PORT} is in use, switching to next available...`);
    }
    app.listen(selectedPort, () => {
      console.log(`✅ Server running on http://localhost:${selectedPort}`);
      console.log(`📡 Health endpoint: http://localhost:${selectedPort}/api/health`);
      console.log(`💬 AI endpoint: http://localhost:${selectedPort}/askHealth`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
