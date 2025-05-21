-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_refresh_token_id_fkey`;

-- DropIndex
DROP INDEX `users_refresh_token_id_fkey` ON `users`;

-- AlterTable
ALTER TABLE `users` MODIFY `refresh_token_id` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_refresh_token_id_fkey` FOREIGN KEY (`refresh_token_id`) REFERENCES `refresh_token`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
