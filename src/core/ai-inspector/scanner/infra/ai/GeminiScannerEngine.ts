import { IScannerEngine } from '../../application/ports/IScannerEngine';
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiScannerEngine implements IScannerEngine {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async analyzeCode(codeSnippet: string) {
    const prompt = `
      You are an expert Software Engineer and Architect.
      Analyze the following code snippet and provide a health score and actionable issues.
      Return EXCLUSIVELY a JSON object matching the requested schema. No markdown, no extra text.

      CODE:
      \`\`\`
      ${codeSnippet}
      \`\`\`
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: 'Total health score between 0 and 100' },
              security: { type: Type.INTEGER, description: 'Security score between 0 and 100' },
              performance: { type: Type.INTEGER, description: 'Performance score between 0 and 100' },
              architecture: { type: Type.INTEGER, description: 'Architecture score between 0 and 100' },
              maintainability: { type: Type.INTEGER, description: 'Maintainability score between 0 and 100' },
              summary: { type: Type.STRING, description: 'A short summary of the code quality' },
              rawIssues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING, enum: ['security', 'performance', 'architecture', 'maintainability'] },
                    severity: { type: Type.STRING, enum: ['info', 'low', 'medium', 'high', 'critical'] },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ['category', 'severity', 'title', 'description']
                }
              }
            },
            required: ['score', 'security', 'performance', 'architecture', 'maintainability', 'summary', 'rawIssues']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      return parsed;
    } catch (error) {
      console.error("[Gemini Engine Error]", error);
      throw new Error("Falha ao analisar o código com a IA.");
    }
  }
}
