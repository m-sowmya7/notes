-- CreateEnum
CREATE TYPE "PageType" AS ENUM ('MARKDOWN', 'LIST', 'KANBAN');

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "PageType" NOT NULL DEFAULT 'MARKDOWN',
    "starred" BOOLEAN NOT NULL DEFAULT false,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);
