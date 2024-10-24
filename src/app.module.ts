import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
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


@Module({
  imports: [
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
  ],
  providers: [PrismaService],
})

export class AppModule {}