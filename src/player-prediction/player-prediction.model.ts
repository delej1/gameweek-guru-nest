import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Player } from '../player/player.model';
import { Fixture } from '../fixture/fixture.model';

@ObjectType()
export class PlayerPrediction {
  @Field(() => Int)
  id: number;

  @Field(() => Player)
  player: Player;

  @Field(() => Fixture)
  fixture: Fixture;

  @Field(() => Float)
  predictedPoints: number;

  @Field(() => Float)
  predictedGoals: number;

  @Field(() => Float)
  predictedAssists: number;

  @Field(() => Float)
  predictionConfidence: number;

  @Field(() => String)
  aiReasoning: string;

  @Field()
  createdAt: Date;
}