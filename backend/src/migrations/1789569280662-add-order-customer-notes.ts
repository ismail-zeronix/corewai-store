import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOrderCustomerNotes1789569280662 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" ADD "customFieldsCustomernotes" character varying(255)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customFieldsCustomernotes"`, undefined);
   }

}
