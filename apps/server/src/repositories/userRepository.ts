import { prisma } from "../prisma/client";

// UserRepository is for finding or creating a user in the database
export class UserRepository {
  async findOrCreate(userId: string) {
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { id: userId },
      });
    }
    return user;
  }
}
