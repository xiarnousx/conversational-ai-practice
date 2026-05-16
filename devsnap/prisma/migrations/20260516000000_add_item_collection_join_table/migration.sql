-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT IF EXISTS "Item_collectionId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "Item_collectionId_idx";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN IF EXISTS "collectionId";

-- CreateTable
CREATE TABLE "ItemCollection" (
    "itemId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "ItemCollection_pkey" PRIMARY KEY ("itemId","collectionId")
);

-- AddForeignKey
ALTER TABLE "ItemCollection" ADD CONSTRAINT "ItemCollection_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCollection" ADD CONSTRAINT "ItemCollection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
