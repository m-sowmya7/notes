import { UserRepository } from '../repositories/userRepository';

const userRepo = new UserRepository();

// using userId to find or create a user in the database
export const UserService = {
    async findOrCreateUser(userId: string) {
        return userRepo.findOrCreate(userId);
    },
};