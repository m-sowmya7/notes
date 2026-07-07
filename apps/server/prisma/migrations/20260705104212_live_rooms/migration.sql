-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "PageShare" DROP CONSTRAINT "PageShare_pageId_fkey";

-- DropForeignKey
ALTER TABLE "PageShare" DROP CONSTRAINT "PageShare_userId_fkey";

-- DropForeignKey
ALTER TABLE "ShareLink" DROP CONSTRAINT "ShareLink_pageId_fkey";

-- CreateTable
CREATE TABLE "LiveRoom" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "inviteToken" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "LiveRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveRoom_inviteToken_key" ON "LiveRoom"("inviteToken");

-- CreateIndex
CREATE INDEX "LiveRoom_pageId_idx" ON "LiveRoom"("pageId");
