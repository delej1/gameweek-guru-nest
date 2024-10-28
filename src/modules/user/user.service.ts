import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(data: Prisma.UsersCreateInput) {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(data.password, 10);

        return this.prisma.users.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }

    async getUsers() {
        return this.prisma.users.findMany();
    }
}
