/*
  Warnings:

  - Added the required column `refresh_token_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `refresh_token_id` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` VARCHAR(255) NOT NULL,
    `refresh_token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL,
    `expired_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_refresh_token_id_fkey` FOREIGN KEY (`refresh_token_id`) REFERENCES `refresh_token`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
