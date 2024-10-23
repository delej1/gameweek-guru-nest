import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './users.model';

@Resolver('User')
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query(() => [User])
    async users() {
        return this.usersService.getUsers();
    }

    @Mutation(() => User)
    async createUser(
        @Args('email') email: string,
        @Args('username') username: string,
        @Args('password') password: string,
    ) {
        return this.usersService.createUser({ email, username, password });
    }
}
