import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';

@Resolver('User')
export class UserResolver {
    constructor(private userService: UserService) {}

    @Query(() => [User])
    async users() {
        return this.userService.getUsers();
    }

    @Mutation(() => User)
    async createUser(
        @Args('email') email: string,
        @Args('username') username: string,
        @Args('password') password: string,
        @Args('phoneNumber') phoneNumber: string
    ) {
        return this.userService.createUser({ email, username, password, phoneNumber });
    }
}
