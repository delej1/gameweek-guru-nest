import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class AnthropicAiService {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generatePrediction(prompt: string): Promise<string> {
    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });

      return response.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join(' ')
      .trim();
    } catch (error) {
      console.error('Error generating prediction:', error);
      throw error;
    }
  }
}
