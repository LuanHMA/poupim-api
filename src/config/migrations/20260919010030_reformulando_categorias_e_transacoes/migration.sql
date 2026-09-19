/*
  Warnings:

  - You are about to drop the column `type` on the `categories` table. All the data in the column will be lost.
  - Added the required column `month` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observation` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categories` DROP COLUMN `type`,
    ADD COLUMN `color` VARCHAR(7) NOT NULL DEFAULT '#6366F1',
    ADD COLUMN `icon` VARCHAR(64) NOT NULL DEFAULT 'tag';

-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `fixed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ignore` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `month` INTEGER NOT NULL,
    ADD COLUMN `observation` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('PAID', 'PENDING', 'RECEIVED') NOT NULL,
    ADD COLUMN `year` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `transactions_month_year_idx` ON `transactions`(`month`, `year`);
