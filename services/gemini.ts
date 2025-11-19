import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { StoreListingData, Language } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAppAnalysis = async (concept: string, lang: Language): Promise<string> => {
  const ai = getClient();
  const model = 'gemini-2.5-flash'; 
  
  const languagePrompt = lang === 'tr' ? 'Respond in Turkish.' : 'Respond in English.';

  const prompt = `
    Act as a Senior Product Manager for Mobile Apps.
    Analyze the following app concept for the Google Play Store:
    "${concept}"
    
    ${languagePrompt}
    Provide a response in Markdown covering:
    1. Market Viability (High/Medium/Low)
    2. Potential Competitors
    3. Recommended Monetization Strategy
    4. Top 3 Features to MVP (Minimum Viable Product)
    
    Keep it concise and professional.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateStoreListing = async (appName: string, concept: string, targetLanguage: string): Promise<StoreListingData> => {
  const ai = getClient();
  const model = 'gemini-2.5-flash';

  const prompt = `
    Act as an ASO (App Store Optimization) expert.
    Create a Google Play Store listing for an app named "${appName}" based on this concept: "${concept}".
    The target language for the content is: ${targetLanguage}.
    
    Return ONLY a valid JSON object with the following schema (no markdown code blocks):
    {
      "title": "App Title (max 30 chars)",
      "shortDescription": "Short description (max 80 chars)",
      "fullDescription": "Full description (formatted with simple HTML tags like <br> or <b>)",
      "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as StoreListingData;
  } catch (error) {
    console.error("Gemini Store Listing Error:", error);
    throw error;
  }
};

export const generatePrivacyPolicy = async (appName: string, type: string, lang: Language): Promise<string> => {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    
    const languagePrompt = lang === 'tr' ? 'Write the policy in Turkish.' : 'Write the policy in English.';

    const prompt = `
      Write a generic Privacy Policy template for a Google Play Store app named "${appName}".
      The app type is: ${type}.
      ${languagePrompt}
      Include sections for: Data Collection, Third-party services (AdMob, Firebase), User Rights, and Contact Information.
      Format as Markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text || "";
    } catch (e) {
        console.error(e);
        throw e;
    }
}