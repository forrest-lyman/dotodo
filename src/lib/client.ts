import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import {ZodType} from 'zod';
import {zodResponseFormat} from 'openai/helpers/zod';
dotenv.config();

export const openAiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const model = 'gpt-4o-2024-08-06';
export const temperature = 0.2;

export async function prompt (messages: any[] | string, format?: ZodType) {
  if (typeof messages === 'string') {
    messages = [{role: 'user', content: messages}];
  }
  const req = {
    model,
    messages,
    temperature
  } as any;

  if (format) {
    req.response_format = zodResponseFormat(format, "data");
  }

  const res = await openAiClient.beta.chat.completions.parse(req);

  const message = res.choices[0].message;

  return format ? message.parsed as any : message.content;
}
