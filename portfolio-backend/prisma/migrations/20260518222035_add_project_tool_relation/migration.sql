/*
  Warnings:

  - You are about to drop the column `languages` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "languages",
ALTER COLUMN "link" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_ProjectToTool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectToTool_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectToTool_B_index" ON "_ProjectToTool"("B");

-- AddForeignKey
ALTER TABLE "_ProjectToTool" ADD CONSTRAINT "_ProjectToTool_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTool" ADD CONSTRAINT "_ProjectToTool_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
