import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getJNewResponse(prompt: string, theme: string = "matrix", context: string = "") {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `Sistema: Você é J-New, um assistente de IA avançado para a MasterCode. Você é uma fusão de Jarvis (Iron Man) e o Arquiteto da Matrix. Você é sofisticado, eficiente e levemente enigmático, mas extremamente útil. Você auxilia alunos com cursos, valores, prazos, certificados e mentorias.
          
          Responda sempre em Português.
          Se o tema atual for 'matrix', use termos como 'nodos', 'fluxo de dados', 'simulação', 'redpill', 'anomalia'.
          Se o tema for 'ironman', use termos como 'protocolos', 'sistemas', 'interface', 'senhor', 'nanotecnologia', 'armadura'.
          Tema atual: ${theme}
          
          Contexto: ${context}
          
          Usuário: ${prompt}` }]
        }
      ],
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || "Erro ao processar sinal.";
  } catch (error) {
    console.error("Erro J-New:", error);
    return "Conexão com a Fonte interrompida. Por favor, tente novamente, Neo.";
  }
}

export async function getJNewAudioResponse(text: string, theme: string = "matrix") {
  const model = "gemini-2.5-flash-preview-tts";
  const voiceName = theme === 'matrix' ? 'Fenrir' : 'Zephyr';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/wav;base64,${base64Audio}`;
    }
    return null;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}
