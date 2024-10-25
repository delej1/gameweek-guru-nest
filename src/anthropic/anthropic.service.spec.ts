import { Test, TestingModule } from '@nestjs/testing';
import { AnthropicAiService } from './anthropic.service';

describe('AiService', () => {
  let service: AnthropicAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnthropicAiService],
    }).compile();

    service = module.get<AnthropicAiService>(AnthropicAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
