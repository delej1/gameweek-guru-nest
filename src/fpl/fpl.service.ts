type FplEvent = {
  id: number;
  is_current: boolean;
};

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs'; 

@Injectable()
export class FplDataService {
  constructor(private readonly httpService: HttpService) {}

  async fetchBootstrapData(): Promise<any> {
    const response = this.httpService.get(process.env.FPL_BOOTSTRAP_URL);
    return lastValueFrom(response).then(res => res.data);
  }

  async fetchFixtures(): Promise<any> {
    const response = this.httpService.get(process.env.FPL_FIXTURE_URL);
    return lastValueFrom(response).then(res => res.data);
  }

  async getCurrentGameWeek(): Promise<number> {
    const fplData = await this.fetchBootstrapData();
    const currentEvent = fplData.events.find((event: FplEvent) => event.is_current);
    return currentEvent ? currentEvent.id : null;
  }
}
