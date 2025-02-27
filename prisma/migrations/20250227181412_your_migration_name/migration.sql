-- DropIndex
DROP INDEX "ananymous_payedAdress_key";

-- AlterTable
ALTER TABLE "ananymous" ALTER COLUMN "payedAdress" DROP NOT NULL;
