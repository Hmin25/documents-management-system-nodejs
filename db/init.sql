CREATE TABLE items (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,

  name VARCHAR(255) NOT NULL,

  type ENUM('folder', 'file') NOT NULL,

  parent_id BIGINT NULL,

  created_by VARCHAR(255) NOT NULL,

  file_size BIGINT DEFAULT NULL,

  file_content LONGTEXT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (parent_id) REFERENCES items(id)
);