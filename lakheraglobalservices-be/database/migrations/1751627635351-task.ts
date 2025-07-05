import { MigrationInterface, QueryRunner } from "typeorm";

export class Task1751627635351 implements MigrationInterface {
  name = "Task1751627635351";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tUser" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "userName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_70198cc1f084e76f6e62d6a9151" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tTask" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-04T11:13:58.114Z"', "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-07-04T11:13:58.114Z"', "userId" uuid, CONSTRAINT "PK_9eafe59186937685126d6f90664" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tTask" ADD CONSTRAINT "FK_b688d211f6a0b28694f982e84b8" FOREIGN KEY ("userId") REFERENCES "tUser"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tTask" DROP CONSTRAINT "FK_b688d211f6a0b28694f982e84b8"`,
    );
    await queryRunner.query(`DROP TABLE "tTask"`);
    await queryRunner.query(`DROP TABLE "tUser"`);
  }
}
