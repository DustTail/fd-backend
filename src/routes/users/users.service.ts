import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { I18nService } from 'nestjs-i18n';
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
        private readonly i18n: I18nService
    ) { }

    async verifyUserEmail(userId: string): Promise<void> {
        const user = await this.userModel.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(this.i18n.t('users.USER_NOT_FOUND'));
        }

        await user.update({ isVerified: true });
    }

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
