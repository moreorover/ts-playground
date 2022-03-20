/*
  Warnings:

  - Added the required column `gid` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "gid" TEXT NOT NULL;
