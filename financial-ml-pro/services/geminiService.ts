
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, FinancialInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getFinancialInsights(transactions: Transaction[], currentMonth: string): Promise<FinancialInsight> {
  const model = 'gemini-3-flash-preview';
  
  const dataSummary = transactions.map(t => ({
    desc: t.description,
    val: t.amount,
    type: t.type,
    cat: t.category,
    date: t.date
  }));

  const prompt = `
    Analise as seguintes transações financeiras de Andressa para o mês ${currentMonth}:
    ${JSON.stringify(dataSummary)}

    Forneça um insight financeiro profissional em Português do Brasil no formato JSON.
    Avalie o equilíbrio entre receitas e despesas.
    Identifique a categoria com maior gasto.
    Dê 3 dicas práticas baseadas nos dados.
    Preveja a tendência para o próximo mês.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tips: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            prediction: { type: Type.STRING },
            status: { 
              type: Type.STRING,
              description: "Status based on financial health: 'good', 'warning', or 'critical'"
            }
          },
          required: ["summary", "tips", "prediction", "status"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as FinancialInsight;
  } catch (error) {
    console.error("Erro ao obter insights do Gemini:", error);
    // Fallback manual logic if API fails
    return {
      summary: "Não foi possível conectar ao motor de IA no momento. Analise seus dados manualmente.",
      tips: ["Verifique suas maiores despesas", "Tente economizar 10% do salário", "Mantenha seus registros atualizados"],
      prediction: "Tendência estável baseada no histórico recente.",
      status: "warning"
    };
  }
}
