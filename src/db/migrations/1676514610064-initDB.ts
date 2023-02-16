import {MigrationInterface, QueryRunner} from "typeorm";

export class initDB1676514610064 implements MigrationInterface {
    name = 'initDB1676514610064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "paymentType" "public"."payment_paymenttype_enum" NOT NULL, "status" "public"."payment_status_enum" NOT NULL, "completedAt" TIMESTAMP, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "amenities" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "rate" integer, CONSTRAINT "PK_c0777308847b3556086f2fb233e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_amenities" ("roomId" integer NOT NULL, "amenitiesId" integer NOT NULL, CONSTRAINT "PK_2f92e96edf4353d757441813532" PRIMARY KEY ("roomId", "amenitiesId"))`);
        await queryRunner.query(`CREATE TABLE "discount" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "percentage" numeric, "dueDate" TIMESTAMP, CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_discount" ("roomId" integer NOT NULL, "discountId" integer NOT NULL, "percentage" numeric NOT NULL, CONSTRAINT "PK_85a8bd3f0a71d2e2f4c9e378380" PRIMARY KEY ("roomId", "discountId"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "roomType" "public"."room_roomtype_enum" NOT NULL, "roomName" text NOT NULL, "isAvailable" boolean, "roomSize" numeric, "price" numeric NOT NULL, "agentId" integer, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "agent" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "propertyName" text NOT NULL, "rating" integer, "description" text, "addressLine" text NOT NULL, "cityId" integer, CONSTRAINT "PK_1000e989398c5d4ed585cf9a46f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "city" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cityName" text NOT NULL, "postCode" text NOT NULL, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userType" "public"."user_usertype_enum" NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "phone" character varying NOT NULL, "gender" character varying NOT NULL, "password" character varying NOT NULL, "agentId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_b61c694cacfab25533bd23d9ad" UNIQUE ("agentId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "checkIn" TIMESTAMP, "checkOut" TIMESTAMP, "note" text, "bookType" "public"."booking_booktype_enum" NOT NULL, "status" "public"."booking_status_enum" NOT NULL, "ref" text, "userId" integer, "paymentId" integer, CONSTRAINT "REL_14223cf3883f8f74019bf60ded" UNIQUE ("paymentId"), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "room_amenities" ADD CONSTRAINT "FK_19e2338246643324027e4f57d06" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_amenities" ADD CONSTRAINT "FK_e83aec9c062341966509760f7e1" FOREIGN KEY ("amenitiesId") REFERENCES "amenities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_discount" ADD CONSTRAINT "FK_0a8ffebadfd94b285abb1f24135" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_discount" ADD CONSTRAINT "FK_37da46d7d32c223ca149a1b3e8e" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_edf7adc83d80a84a7283f6aecba" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agent" ADD CONSTRAINT "FK_43e13f31e55325ccfd80fa0c463" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_b61c694cacfab25533bd23d9add" FOREIGN KEY ("agentId") REFERENCES "agent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_14223cf3883f8f74019bf60ded5" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_14223cf3883f8f74019bf60ded5"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b61c694cacfab25533bd23d9add"`);
        await queryRunner.query(`ALTER TABLE "agent" DROP CONSTRAINT "FK_43e13f31e55325ccfd80fa0c463"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_edf7adc83d80a84a7283f6aecba"`);
        await queryRunner.query(`ALTER TABLE "room_discount" DROP CONSTRAINT "FK_37da46d7d32c223ca149a1b3e8e"`);
        await queryRunner.query(`ALTER TABLE "room_discount" DROP CONSTRAINT "FK_0a8ffebadfd94b285abb1f24135"`);
        await queryRunner.query(`ALTER TABLE "room_amenities" DROP CONSTRAINT "FK_e83aec9c062341966509760f7e1"`);
        await queryRunner.query(`ALTER TABLE "room_amenities" DROP CONSTRAINT "FK_19e2338246643324027e4f57d06"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "city"`);
        await queryRunner.query(`DROP TABLE "agent"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "room_discount"`);
        await queryRunner.query(`DROP TABLE "discount"`);
        await queryRunner.query(`DROP TABLE "room_amenities"`);
        await queryRunner.query(`DROP TABLE "amenities"`);
        await queryRunner.query(`DROP TABLE "payment"`);
    }

}
