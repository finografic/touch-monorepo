ALTER TABLE `drink_subtypes` ADD `default_temp_freeze` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `drink_types` ADD `default_temp_freeze` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `default_temp_freeze` integer NOT NULL;