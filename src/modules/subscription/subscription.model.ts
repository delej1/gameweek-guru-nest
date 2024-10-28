import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../user/user.model';

@ObjectType()
export class Subscription {
  @Field(() => Int)
  id: number;

  @Field(() => User)
  user: User;

  @Field()
  planName: string;

  @Field()
  status: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}