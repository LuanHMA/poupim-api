/*
  Warnings:

  - You are about to drop the column `user_id` on the `categories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_user_id_fkey`;

-- DropIndex
DROP INDEX `categories_user_id_idx` ON `categories`;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `user_id`;
