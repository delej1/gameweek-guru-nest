import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Fixture } from '../fixture/fixture.model';

@ObjectType()
export class MatchPrediction {
  @Field(() => Int)
  id: number;

  @Field(() => Fixture)
  fixture: Fixture;

  @Field()
  predictedResult: string;

  @Field(() => Float)
  confidenceHomeWin: number;

  @Field(() => Float)
  confidenceAwayWin: number;

  @Field(() => Float)
  confidenceDraw: number;

  @Field(() => Float)
  predictedHomeGoals: number;

  @Field(() => Float)
  predictedAwayGoals: number;

  @Field()
  aiReasoning: string;

  @Field()
  createdAt: Date;
}