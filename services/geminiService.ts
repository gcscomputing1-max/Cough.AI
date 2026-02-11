
import { GoogleGenAI, Type } from "@google/genai";
import { CoughAnalysisResult } from "../types";

export const analyzeCoughAudio = async (audioBase64: string): Promise<CoughAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    // Refined contents structure to use the standard object format for parts
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'audio/pcm;rate=16000',
            data: audioBase64,
          },
        },
        {
          text: "Analyze this cough sound. Identify the likely type (e.g., Dry, Wet, Whooping, Croup, or Normal Breath), provide a confidence score between 0 and 1, a brief description, 3 key health recommendations, and a severity level ('Low', 'Medium', or 'High'). Format the output strictly as JSON.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          description: { type: Type.STRING },
          severity: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["type", "confidence", "description", "severity", "recommendations"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return {
    ...result,
    timestamp: new Date().toISOString()
  };
};

/**
 * Finds nearby medical help using Google Search grounding.
 * This resolves the "googleMaps parameter not supported" error by using the broadly
 * supported search tool which provides location-accurate web results and map links.
 */
export const findNearbyMedicalHelp = async (lat: number, lng: number): Promise<{ text: string, groundingChunks: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find the 3-5 nearest hospitals, emergency rooms, or respiratory clinics near coordinates: lat=${lat}, lng=${lng}. Provide their names and website or map links for navigation.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text || "No recommendations found.",
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const simulateCoughAnalysis = async (): Promise<CoughAnalysisResult> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const types = ['Dry Cough', 'Wet Cough', 'Whooping Cough', 'Normal Breath'];
  const type = types[Math.floor(Math.random() * types.length)];
  const severity: 'Low' | 'Medium' | 'High' = type === 'Normal Breath' ? 'Low' : (Math.random() > 0.5 ? 'Medium' : 'High');

  return {
    type,
    confidence: 0.75 + Math.random() * 0.2,
    severity,
    description: `Acoustic signature suggests a ${type.toLowerCase()}. The neural network identified specific frequency patterns consistent with this respiratory state.`,
    recommendations: [
      "Maintain optimal hydration levels.",
      "Monitor resting heart rate and oxygen levels.",
      "Consult a professional if symptoms worsen."
    ],
    timestamp: new Date().toISOString()
  };
};
