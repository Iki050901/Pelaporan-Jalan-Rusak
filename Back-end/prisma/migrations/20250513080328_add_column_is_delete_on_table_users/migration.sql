/*
  Warnings:

  - Added the required column `is_delete` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_delete` BOOLEAN NOT NULL;
