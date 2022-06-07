import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { User } from 'src/models';

type UserData = {
    name: string
    email: string
    password: string
}

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
    ) { }

    async findUserByEmail(email: string, transaction?: Transaction): Promise<User | null> {
        return this.userModel.findOne({ where: { email }, transaction });
    }

    async createUser(userData: UserData, transaction?: Transaction): Promise<User> {
        return this.userModel.create(userData, { transaction });
    }

    async getUserById(userId: number): Promise<User> {
        return this.userModel.findByPk(userId);
    }
}
