import { Module } from '@nestjs/common';
import { AnthropicAiService } from './anthropic.service';

@Module({
  providers: [AnthropicAiService],
  exports: [AnthropicAiService],
})
export class AnthropicModule {}
