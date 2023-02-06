import { MigrationInterface, QueryRunner } from 'typeorm';

export class initializeEntities1643190503472 implements MigrationInterface {
  name = 'initializeEntities1643190503472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(60) NOT NULL, \`password\` varchar(60) NOT NULL, \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'INACTIVE', \`userType\` enum ('ADMIN', 'CLIENT') NOT NULL DEFAULT 'CLIENT', \`permissions\` varchar(255) NULL, \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
