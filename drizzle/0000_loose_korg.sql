CREATE TABLE `block` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`program_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sequence` integer,
	`duration_weeks` integer,
	FOREIGN KEY (`program_id`) REFERENCES `program`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `block_day` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`block_id` integer NOT NULL,
	`name` text NOT NULL,
	`sequence` integer,
	FOREIGN KEY (`block_id`) REFERENCES `block`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `equipment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE TABLE `exercise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_name_unique` ON `exercise` (`name`);--> statement-breakpoint
CREATE TABLE `exercise_equipment` (
	`exercise_id` integer NOT NULL,
	`equipment_id` integer NOT NULL,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_equipment_exercise_id_equipment_id_unique` ON `exercise_equipment` (`exercise_id`,`equipment_id`);--> statement-breakpoint
CREATE TABLE `exercise_muscle` (
	`exercise_id` integer NOT NULL,
	`muscle_id` integer NOT NULL,
	`activation_type` text,
	`weighting` real,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`muscle_id`) REFERENCES `muscle`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_muscle_exercise_id_muscle_id_unique` ON `exercise_muscle` (`exercise_id`,`muscle_id`);--> statement-breakpoint
CREATE TABLE `muscle` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`muscle_group` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `muscle_name_unique` ON `muscle` (`name`);--> statement-breakpoint
CREATE TABLE `muscle_volume_threshold` (
	`muscle_id` integer PRIMARY KEY NOT NULL,
	`mv` integer,
	`mev` integer,
	`mav_min` integer,
	`mav_max` integer,
	`mrv` integer,
	FOREIGN KEY (`muscle_id`) REFERENCES `muscle`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `program` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`user_id` integer,
	`description` text,
	`start_date` text,
	`end_date` text,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `user_checkin` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`date` text,
	`weight` real,
	`waist` real,
	`chest` real,
	`hips` real,
	`steps` integer,
	`body_fat` real,
	`notes` text,
	FOREIGN KEY (`user_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`fitness_level` integer,
	`age` integer,
	`sex` text
);
--> statement-breakpoint
CREATE TABLE `workout` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`block_day_id` integer NOT NULL,
	`name` text,
	`notes` text,
	`sequence` integer,
	FOREIGN KEY (`block_day_id`) REFERENCES `block_day`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workout_exercise` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_id` integer NOT NULL,
	`exercise_id` integer NOT NULL,
	`sets` integer,
	`reps` text,
	`weight` real,
	`rest_seconds` integer,
	`notes` text,
	`sequence` integer,
	`group_name` text,
	FOREIGN KEY (`workout_id`) REFERENCES `workout`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercise`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `workout_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workout_exercise_id` integer NOT NULL,
	`performed_sets` integer,
	`performed_reps` text,
	`performed_weight` real,
	`date` text,
	`notes` text,
	FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercise`(`id`) ON UPDATE no action ON DELETE cascade
);
