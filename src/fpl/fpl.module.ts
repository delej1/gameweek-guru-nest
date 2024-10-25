import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FplDataService } from './fpl.service';

@Module({
  imports: [HttpModule],
  providers: [FplDataService],
  exports: [FplDataService],
})
export class FplModule {}
