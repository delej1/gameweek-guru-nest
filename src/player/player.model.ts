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
  ictIndex: number;

  @Field()
  status: string;

  @Field(() => Int)
  chanceOfPlayingNextRound: number;
}