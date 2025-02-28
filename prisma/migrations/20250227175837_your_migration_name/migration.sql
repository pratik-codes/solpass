/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `ananymous` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payedAdress]` on the table `ananymous` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ananymous_publicKey_key" ON "ananymous"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "ananymous_payedAdress_key" ON "ananymous"("payedAdress");
