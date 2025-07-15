-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "gramosPorUnidad" DOUBLE PRECISION,
ADD COLUMN     "unidad" TEXT NOT NULL DEFAULT 'g';
