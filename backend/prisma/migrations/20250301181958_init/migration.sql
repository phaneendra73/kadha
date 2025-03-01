/*
  Warnings:

  - You are about to drop the `blogContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tagsOnBlogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userProfiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "blogContent" DROP CONSTRAINT "blogContent_blogId_fkey";

-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_authorId_fkey";

-- DropForeignKey
ALTER TABLE "tagsOnBlogs" DROP CONSTRAINT "tagsOnBlogs_blogId_fkey";

-- DropForeignKey
ALTER TABLE "tagsOnBlogs" DROP CONSTRAINT "tagsOnBlogs_tagId_fkey";

-- DropTable
DROP TABLE "blogContent";

-- DropTable
DROP TABLE "tagsOnBlogs";

-- DropTable
DROP TABLE "userProfiles";

-- CreateTable
CREATE TABLE "userprofiles" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileUrl" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userprofiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogmd" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "blogId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogmd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tagsonblogs" (
    "blogId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "tagsonblogs_pkey" PRIMARY KEY ("blogId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "userprofiles_email_key" ON "userprofiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "blogmd_blogId_key" ON "blogmd"("blogId");

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "userprofiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogmd" ADD CONSTRAINT "blogmd_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagsonblogs" ADD CONSTRAINT "tagsonblogs_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagsonblogs" ADD CONSTRAINT "tagsonblogs_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
