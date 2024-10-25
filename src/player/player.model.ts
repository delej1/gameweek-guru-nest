import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Team } from '../team/team.model';

@ObjectType()
export class Player {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  fpl_id: number;

  @Field()
  name: string;

  @Field(() => Int)
  code: number;

  @Field(() => Team)
  team: Team;

  @Field(() => Int)
  position: number;

  @Field(() => Int)
  totalPoints: number;

  @Field(() => Float)
  form: number;

  @Field(() => Int)
  minutes: number;

  @Field(() => Int)
  goalsScored: number;

  @Field(() => Int)
  assists: number;

  @Field(() => Int)
  cleanSheets: number;

  @Field(() => Float)
  expectedGoals: number;

  @Field(() => Float)
  expectedAssists: number;

  @Field(() => Float)
  influence: number;

  @Field(() => Float)
  creativity: number;

  @Field(() => Float)
  threat: number;

  @Field(() => Float)
  ictIndex: number;

  @Field(() => String)
  status: string;

  @Field(() => Int)
  chanceOfPlayingNextRound: number;
}