CREATE TABLE `auth_account` (
	`id` text PRIMARY KEY NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `auth_session` (
	`id` text PRIMARY KEY NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_session_token_unique` ON `auth_session` (`token`);--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `auth_user_email_unique` ON `auth_user` (`email`);--> statement-breakpoint
CREATE TABLE `auth_verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `container_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`thermal_conductivity` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `drink_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`drink_type_id` text NOT NULL,
	`drink_subtype_id` text,
	`container_type_id` text NOT NULL,
	`volume_id` text NOT NULL,
	`default_consumption_temp` integer NOT NULL,
	`min_consumption_temp` integer NOT NULL,
	`max_consumption_temp` integer NOT NULL,
	`time_table_id_1` text NOT NULL,
	`time_table_id_2` text NOT NULL,
	`time_table_id_3` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`drink_type_id`) REFERENCES `drink_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`drink_subtype_id`) REFERENCES `drink_subtypes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`container_type_id`) REFERENCES `container_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`volume_id`) REFERENCES `volumes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `drink_subtypes` (
	`id` text PRIMARY KEY NOT NULL,
	`drink_type_id` text NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`consumption_temp` integer NOT NULL,
	`freeze_temp` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`drink_type_id`) REFERENCES `drink_types`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `drink_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`has_subtypes` integer DEFAULT false NOT NULL,
	`default_consumption_temp` integer NOT NULL,
	`default_freeze_temp` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `elements` (
	`id` text PRIMARY KEY NOT NULL,
	`element_number` integer NOT NULL,
	`display_name` text NOT NULL,
	`element_type` integer NOT NULL,
	`position` text NOT NULL,
	`voltage` integer NOT NULL,
	`probe_id` text,
	`last_probe_reading` integer,
	`last_probe_reading_at` integer,
	`is_in_use` integer DEFAULT false NOT NULL,
	`current_order_id` text,
	`remaining_seconds` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `elements_element_number_unique` ON `elements` (`element_number`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`cat_id` text NOT NULL,
	`user_id` text NOT NULL,
	`json_meta` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `running_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`element_id` text NOT NULL,
	`drink_config_id` text NOT NULL,
	`start_temp` integer NOT NULL,
	`target_temp` integer NOT NULL,
	`last_temp` integer,
	`started_at` integer NOT NULL,
	`estimated_minutes` integer NOT NULL,
	`actual_minutes` integer,
	`completed_at` integer,
	`status` text DEFAULT 'pending' NOT NULL,
	`error_message` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`element_id`) REFERENCES `elements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`drink_config_id`) REFERENCES `drink_configs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `temperature_table_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`table_id` text NOT NULL,
	`temperature` real NOT NULL,
	`time_minutes` real NOT NULL,
	`sort_order` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`table_id`) REFERENCES `temperature_tables`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `temperature_tables` (
	`id` text PRIMARY KEY NOT NULL,
	`table_number` text NOT NULL,
	`description` text,
	`element_type` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `temperature_tables_table_number_unique` ON `temperature_tables` (`table_number`);--> statement-breakpoint
CREATE TABLE `volumes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`value_in_ml` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`cooling_factor` real DEFAULT 1 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
