import * as crypto from 'node:crypto';

export class PasswordHelper {

    static generateSalt(): string {
        return crypto
            .randomBytes(16)
            .toString('hex');
    }

    static hash(password: string): string {
        return crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
    }

    static compare(password: string, hashedPassword: string): boolean {
        return crypto
            .createHash('sha256')
            .update(password)
            .digest('hex') === hashedPassword;
    }

}
