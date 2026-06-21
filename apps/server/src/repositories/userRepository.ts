import { prisma } from '../../prisma/client';

export class UserRepository {
    async findOrCreate(userId: string) {
        let user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if(!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                },
            });
        }

        return user;
    }
}