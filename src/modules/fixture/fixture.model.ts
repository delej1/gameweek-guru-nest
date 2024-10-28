import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Team } from '../modules/team/team.model';

@ObjectType()
export class Fixture {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  fpl_id: number;

  @Field(() => Int)
  gameweek: number;

  @Field(() => Team)
  homeTeam: Team;

  @Field(() => Team)
  awayTeam: Team;

  @Field()
  date: Date;

  @Field(() => Int)
  difficultyHome: number;

  @Field(() => Int)
  difficultyAway: number;

  @Field(() => Boolean)
  finished: boolean;
}