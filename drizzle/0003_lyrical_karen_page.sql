RENAME TABLE `verificationToken` TO `verificationtoken`;--> statement-breakpoint
ALTER TABLE `account` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `authenticator` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `verificationtoken` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `verificationtoken` ADD PRIMARY KEY(`identifier`,`token`);--> statement-breakpoint
ALTER TABLE `account` DROP COLUMN `id`;--> statement-breakpoint
ALTER TABLE `authenticator` DROP COLUMN `id`;