import { Injectable } from '@angular/core';
import OpenAi from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import {environment} from '../../environments/environment';

export interface Message {
  role: string;
  content: string;
}

export const DEFAULT_CONFIG = {
  model: 'gpt-4o-mini',
  max_tokens: 4000,
  temperature: 0.1
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  openai!: OpenAi;

  constructor() {
    this.init(environment.openAi);
  }

  init(apiKey: string) {
    this.openai = new OpenAi({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }


  async prompt(content: string, config: any = {}): Promise<any> {
    return await this.chat([{
      role: 'user',
      content
    }])
  };

  async chat(messages: any[], config: any = {}): Promise<any> {
    const res = await this.openai.chat.completions.create({
      ...DEFAULT_CONFIG,
      ...config,
      messages
    });

    return res.choices[0].message.content;
  };

  async completion(messages: any[], format: any, config: any = {}) {
    const res = await this.openai.chat.completions.create({
      ...DEFAULT_CONFIG,
      ...config,
      messages,
      response_format: zodResponseFormat(format, 'event')
    });

    const {content} = res.choices[0].message;

    return content ? JSON.parse(content) : null;
  }

  async fn (content: string | string[], config: any = {}) {
    const {schema} = config;
    delete config.schema;
    if (Array.isArray(content)) {
      content = content.join(`\n`);
    }


    const res = await this.openai.chat.completions.create({
      ...DEFAULT_CONFIG,
      messages: [
        {role: 'user', content}
      ],
      tools: [
        {
          type: 'function',
          function: schema
        }
      ],
      tool_choice: {
        type: 'function',
        function: {
          name: schema.name
        }
      }
    });
    const toolCalls = res.choices[0]?.message?.tool_calls;
    if (! toolCalls) {
      throw new Error('No tools called');
    }
    const json = toolCalls[0]?.function?.arguments;
    const data = json ? JSON.parse(json) : {};
    return data.res;
  }

}



export const provideAi = (apiKey: string) => ({
  provide: AiService,
  useFactory: () => {
    console.warn('Initializing OpenAI with fixed key, do not use in production!')
    const service = new AiService();
    service.init(apiKey);
    return service;
  }
});
