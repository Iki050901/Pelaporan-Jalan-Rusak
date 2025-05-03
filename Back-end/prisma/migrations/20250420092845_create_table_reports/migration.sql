-- CreateTable
CREATE TABLE `reports` (
    `id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `desc` TINYTEXT NOT NULL,
    `lat` DECIMAL(9, 6) NOT NULL,
    `long` DECIMAL(9, 6) NOT NULL,
    `is_district_validate` BOOLEAN NOT NULL,
    `is_pupr_validate` BOOLEAN NOT NULL,
    `video_url` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `validation_stat_id` INTEGER NOT NULL,
    `damage_level_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_validation_stat_id_fkey` FOREIGN KEY (`validation_stat_id`) REFERENCES `validation_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_damage_level_id_fkey` FOREIGN KEY (`damage_level_id`) REFERENCES `damage_level`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
