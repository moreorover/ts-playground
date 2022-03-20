/*
  Warnings:

  - Added the required column `title` to the `Topic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "title" TEXT NOT NULL;
