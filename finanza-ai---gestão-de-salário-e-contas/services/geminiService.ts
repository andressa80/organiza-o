
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, ForecastResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIFinancialForecast = async (transactions: Transaction[]): Promise<ForecastResponse | null> => {
  try {
    const transactionSummary = transactions.map(t => ({
      desc: t.description,
      val: t.amount,
      cat: t.category,
      type: t.type,
      date: t.date
    }));

    const prompt = `Você é um consultor financeiro especialista em orçamento doméstico. 
    Analise o salário e as contas (Aluguel, Água, Luz, Mercado, etc.) deste usuário.
    Gere uma previsão para os próximos 6 meses baseada na inflação e histórico.
    Dê dicas práticas de como reduzir as contas básicas e se o salário atual é suficiente para manter o estilo de vida.
    Transações atuais: ${JSON.stringify(transactionSummary)}`;

    // Fix: Using gemini-3-pro-preview for complex reasoning and structured output
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  predictedExpense: { type: Type.NUMBER },
                  recommendation: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, description: "Low, Medium or High" }
                },
                required: ["month", "predictedExpense", "recommendation", "riskLevel"]
              }
            },
            generalAdvice: { type: Type.STRING }
          },
          required: ["forecast", "generalAdvice"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("Erro ao obter previsão da IA:", error);
    return null;
  }
};
