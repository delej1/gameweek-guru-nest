import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaService } from './prisma/prisma.service';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PlayerModule } from './player/player.module';
import { TeamModule } from './team/team.module';
import { FixtureModule } from './fixture/fixture.module';
import { PlayerPredictionModule } from './player-prediction/player-prediction.module';
import { MatchPredictionModule } from './match-prediction/match-prediction.module';
import { FplModule } from './fpl/fpl.module';
import { DataPopulationModule } from './data-population/data-population.module';
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