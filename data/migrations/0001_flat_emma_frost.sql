ALTER TABLE `orders` ADD `default_temp_consume` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `default_temp_freeze` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `temp_consume`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `temp_freeze`;