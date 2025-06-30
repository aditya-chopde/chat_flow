import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI as string);

const generateAIMessage = async (message_prompt: string) => {
  try {
    const prompt: string = `
        You are a person typing a message in a chat box. Do not explain, introduce, or summarize. Just give the message as it should appear if sent directly in a chat.

        Task: ${message_prompt}

        Do not use phrases like "Here's a draft" or "Sure, how about this". Only respond with the message content.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    throw new Error(error);
  }
};

export { generateAIMessage };
