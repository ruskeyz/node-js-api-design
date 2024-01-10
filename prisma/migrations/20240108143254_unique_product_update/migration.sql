/*
  Warnings:

  - A unique constraint covering the columns `[id,productId]` on the table `Update` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Update_id_productId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Update_id_productId_key" ON "Update"("id", "productId");
