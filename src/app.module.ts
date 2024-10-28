import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaService } from './prisma/prisma.service';
import { join } from 'path';
import { UserModule } from './modules/user/user.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PlayerModule } from './modules/player/player.module';
import { TeamModule } from './modules/team/team.module';
import { FixtureModule } from './modules/fixture/fixture.module';
import { PlayerPredictionModule } from './modules/player-prediction/player-prediction.module';
import { MatchPredictionModule } from './modules/match-prediction/match-prediction.module';
import { FplModule } from './modules/fpl/fpl.module';
import { DataPopulationModule } from './modules/data-population/data-population.module';
import { AnthropicModule } from './anthropic/anthropic.module';
import { PredictionCronService } from './cron/prediction-cron.service';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UserModule,
    SubscriptionModule,
    PlayerModule,
    TeamModule,
    FixtureModule,
    PlayerPredictionModule,
    MatchPredictionModule,
    FplModule,
    DataPopulationModule,
    AnthropicModule,
  ],
  providers: [
    PrismaService, 
    PredictionCronService,
  ],
})

export class AppModule {}