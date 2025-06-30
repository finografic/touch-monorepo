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
	`name_es_es` text NOT NULL,
	`name_en_gb` text,
	`name_ca_es` text,
	`translations` text DEFAULT '{"en-GB":""}' NOT NULL,
	`thermal_conductivity` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `container_types_name_unique` ON `container_types` (`name`);--> statement-breakpoint
CREATE TABLE `cooling_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `drink_subtypes` (
	`id` text PRIMARY KEY NOT NULL,
	`drink_type_id` text NOT NULL,
	`name` text NOT NULL,
	`name_es_es` text NOT NULL,
	`name_en_gb` text,
	`name_ca_es` text,
	`translations` text DEFAULT '{"en-GB":""}' NOT NULL,
	`default_temp_consume` integer NOT NULL,
	`default_temp_freeze` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`drink_type_id`) REFERENCES `drink_types`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drink_subtypes_name_unique` ON `drink_subtypes` (`name`);--> statement-breakpoint
CREATE TABLE `drink_types` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_es_es` text NOT NULL,
	`name_en_gb` text,
	`name_ca_es` text,
	`translations` text DEFAULT '{"en-GB":""}' NOT NULL,
	`has_subtypes` integer DEFAULT false NOT NULL,
	`default_temp_consume` integer NOT NULL,
	`default_temp_freeze` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `drink_types_name_unique` ON `drink_types` (`name`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`drink_type_id` text NOT NULL,
	`drink_subtype_id` text,
	`volume_id` text NOT NULL,
	`container_type_id` text NOT NULL,
	`temperature_profile_id` text NOT NULL,
	`default_temp_consume` integer NOT NULL,
	`default_temp_freeze` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`drink_type_id`) REFERENCES `drink_types`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`drink_subtype_id`) REFERENCES `drink_subtypes`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`volume_id`) REFERENCES `volumes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`container_type_id`) REFERENCES `container_types`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`temperature_profile_id`) REFERENCES `temperature_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `supported_languages` (
	`id` text PRIMARY KEY NOT NULL,
	`iso_code` text NOT NULL,
	`native_name` text NOT NULL,
	`display_name` text NOT NULL,
	`flag_code` text,
	`is_active` integer DEFAULT true NOT NULL,
	`is_default` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `supported_languages_iso_code_unique` ON `supported_languages` (`iso_code`);--> statement-breakpoint
CREATE TABLE `temperature_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`cooling_profile_id` text NOT NULL,
	`temperature` real NOT NULL,
	`time_a` real NOT NULL,
	`time_b` real NOT NULL,
	`time_c` real NOT NULL,
	FOREIGN KEY (`cooling_profile_id`) REFERENCES `cooling_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `translatable_entities` (
	`id` text PRIMARY KEY NOT NULL,
	`table_name` text NOT NULL,
	`entity_name` text NOT NULL,
	`description` text,
	`is_active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `translatable_entities_table_name_unique` ON `translatable_entities` (`table_name`);--> statement-breakpoint
CREATE TABLE `volumes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_es_es` text NOT NULL,
	`name_en_gb` text,
	`name_ca_es` text,
	`translations` text DEFAULT '{"en-GB":""}' NOT NULL,
	`value_in_ml` integer NOT NULL,
	`sort_order` integer NOT NULL,
	`cooling_factor` real DEFAULT 1 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `volumes_name_unique` ON `volumes` (`name`);