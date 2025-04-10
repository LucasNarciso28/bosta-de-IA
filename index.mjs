import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/genai";
import * as readline from 'node:readline/promises'; // Importa a versão com Promises
import { stdin as input, stdout as output } from 'node:process'; // Importa input e output

const API_KEY = "AIzaSyDF2R0xJwhiFR5C16Dx0mw7egJMTPOvcBA"; // <-- COLOQUE SUA CHAVE AQUI (ou leia de process.env)

// Verificação básica da chave (adicione sua chave real para testar)
if (!API_KEY || API_KEY === "SUA_API_KEY_AQUI") {
    console.error("ERRO: Configure sua chave de API do Google AI na variável API_KEY.");
    console.error("Para segurança, é altamente recomendado usar variáveis de ambiente.");
    process.exit(1); // Termina o script se a chave não estiver configurada
}

// Configuração do cliente da API
const genAI = new GoogleGenerativeAI(API_KEY);

// Configurações do Modelo (pode ajustar conforme necessário)
const modelConfig = {
  model: "gemini-pro", // Modelo para chat/texto
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ],
  generationConfig: {
    maxOutputTokens: 200,
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
  },
};

// Histórico inicial do Chat (opcional)
const initialHistory = [
  { role: "user", parts: [{ text: "Olá, você pode me ajudar?" }] }, // Corrigido: parts é um array de objetos
  { role: "model", parts: [{ text: "Olá! Sou um chatbot e estou aqui para ajudar. Em que posso ser útil?" }] }, // Corrigido
];


// Função principal para interação no chat
async function runChatInteraction() {
  const rl = readline.createInterface({ input, output });
  console.log("Chat com Gemini iniciado. Digite 'sair' para terminar.");

  try {
    // Obtém o modelo generativo
    const model = genAI.getGenerativeModel(modelConfig);

    // Inicia o chat com o histórico inicial
    const chat = model.startChat({
      history: initialHistory,
      // generationConfig pode ser definido aqui também, se necessário para o chat especificamente
    });

    // Loop para conversar
    while (true) {
      const userMessage = await rl.question('Você: ');

      if (userMessage.toLowerCase() === 'sair') {
        console.log("Encerrando o chat...");
        break; // Sai do loop
      }

      try {
        // Envia a mensagem do usuário para o chat
        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        const text = response.text();
        console.log(`Gemini: ${text}`);
      } catch (error) {
         console.error("Erro ao enviar/receber mensagem do Gemini:", error);
         // Decide se quer continuar ou parar em caso de erro na API
         // break; // Descomente para parar em caso de erro
      }
    }

  } catch (error) {
      console.error("Erro ao inicializar o modelo ou chat:", error);
  } finally {
      rl.close(); // Garante que o readline será fechado
  }
}

// Inicia a interação do chat
runChatInteraction();