import { GoogleGenAI, Type } from '@google/genai';
import type { PredictedFault } from '../types';

// This implementation now uses the Google Gemini API.
// The API key should be handled securely, ideally through a backend proxy.
// For this environment, it's assumed process.env.API_KEY is configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export const getFaultPrediction = async (symptoms: string, dtcs: string): Promise<PredictedFault[]> => {
    
    // The prompt is engineered to make the AI act as an expert automotive diagnostician.
    const prompt = `
        You are an expert automotive diagnostic AI. Your role is to analyze vehicle symptoms and 
        Diagnostic Trouble Codes (DTCs) to predict the most likely faults.

        Analyze the following information:
        - Symptoms: "${symptoms}"
        - DTCs: "${dtcs}"

        Based on this data, provide a list of the top 3 most likely faults. For each fault, include:
        1. A clear and concise name for the fault.
        2. A brief description of why this fault is likely.
        3. A confidence score between 0.0 and 1.0.
        4. A list of 3-4 recommended, actionable diagnostic steps a technician should take to confirm the fault.

        Return the response as a valid JSON array that adheres to the provided schema.
    `;

    // The response schema ensures the AI returns data in a structured, predictable format.
    const responseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                fault: { 
                    type: Type.STRING,
                    description: "The specific name of the predicted fault (e.g., 'Faulty Ignition Coil on Cylinder 3')."
                },
                description: { 
                    type: Type.STRING,
                    description: "A brief explanation of the fault and why it's suspected."
                },
                confidence: { 
                    type: Type.NUMBER,
                    description: "A confidence score from 0.0 to 1.0."
                },
                recommendedActions: { 
                    type: Type.ARRAY,
                    description: "A list of actionable steps for the technician.",
                    items: { type: Type.STRING }
                }
            },
            required: ["fault", "description", "confidence", "recommendedActions"]
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        // FIX: Added .trim() to handle potential whitespace in the response string before parsing.
        const jsonResponse = JSON.parse(response.text.trim());
        return jsonResponse as PredictedFault[];

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get fault prediction from AI. Please check the API key and network connection.");
    }
};
