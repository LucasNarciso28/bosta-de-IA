// server.js
import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config(); // Carrega as variáveis do .env

const app = express();
const port = process.env.PORT || 3001;

// --- Configuração de Segurança e Middlewares ---
// CORS: Permite requisições do seu frontend React (ajuste a origin se necessário)
// Mude de:
// app.use(cors({ origin: 'http://localhost:3000' }));
// Para:
app.use(cors()); // Permite de qualquer origem (mais simples para testar localmente) // Permite que o servidor entenda JSON no corpo das requisições

// --- Inicialização do Google AI ---
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("ERRO FATAL: GOOGLE_API_KEY não encontrada no .env");
  process.exit(1); // Para o servidor se a chave não existe
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Ou outro modelo

// --- Endpoint da API ---
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body; // Pega o prompt enviado pelo React

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    console.log(`Backend recebeu prompt: "${prompt}"`);

    // Chama a API do Google
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(`Backend enviando resposta: "${text.substring(0, 50)}..."`);
    res.json({ generatedText: text }); // Envia a resposta de volta para o React

  } catch (error) {
    console.error("Erro no backend ao chamar Google AI:", error);
    res.status(500).json({ error: 'Falha ao gerar conteúdo' });
  }
});

// --- Iniciar o servidor ---
app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});