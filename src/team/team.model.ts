import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Player } from '../player/player.model';

@ObjectType()
export class Team {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  fpl_id: number;

  @Field()
  name: string;

  @Field(() => Float)
  strengthAttack: number;

  @Field(() => Float)
  strengthDefense: number;

  @Field(() => Float)
  strengthOverall: number;

  @Field(() => Int)
  code: number;

  @Field(() => [Player])
  players: Player[];
}