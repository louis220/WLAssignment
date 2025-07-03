CREATE TABLE `board` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(30) NOT NULL,
  `content` VARCHAR(1000) NOT NULL,
  `writer` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(1000) NOT NULL,
  `writer` VARCHAR(20) NOT NULL,
  `boardId` INT NOT NULL,
  `parentId` INT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `IDX_comment_boardId` (`boardId`),
  INDEX `IDX_comment_parentId` (`parentId`),
  CONSTRAINT `FK_comment_board`
    FOREIGN KEY (`boardId`)
    REFERENCES `board` (`id`)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
  CONSTRAINT `FK_comment_parent`
    FOREIGN KEY (`parentId`)
    REFERENCES `comment` (`id`)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;


  CREATE TABLE `notification` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `writer` VARCHAR(100) NULL,
  `keyword` VARCHAR(100) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;