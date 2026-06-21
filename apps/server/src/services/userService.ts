import { UserRepository } from '../repositories/userRepository';

const userRepo = new UserRepository();

export const UserService = {
    async findOrCreateUser(userId: string) {
        return userRepo.findOrCreate(userId);
    },
};