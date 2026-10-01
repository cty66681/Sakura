-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "HouseListingStatus" AS ENUM ('available', 'paused', 'rented', 'expired', 'hidden');

-- CreateEnum
CREATE TYPE "HouseModerationStatus" AS ENUM ('draft', 'pending', 'approved', 'rejected', 'hidden');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "displayName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publishers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publishers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "houses" (
    "id" SERIAL NOT NULL,
    "publisherId" TEXT NOT NULL,
    "title" VARCHAR(80) NOT NULL,
    "rent" INTEGER NOT NULL,
    "managementFee" INTEGER NOT NULL DEFAULT 0,
    "depositMonths" DECIMAL(4,1) NOT NULL DEFAULT 0,
    "keyMoneyMonths" DECIMAL(4,1) NOT NULL DEFAULT 0,
    "layout" TEXT NOT NULL,
    "area" DECIMAL(8,2) NOT NULL,
    "prefecture" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "station" TEXT,
    "walkMinutes" INTEGER,
    "floor" TEXT,
    "builtYear" INTEGER,
    "direction" TEXT,
    "structure" TEXT,
    "availableFrom" DATE,
    "foreignerAllowed" BOOLEAN,
    "studentAllowed" BOOLEAN,
    "description" TEXT NOT NULL,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "listingStatus" "HouseListingStatus" NOT NULL DEFAULT 'available',
    "moderationStatus" "HouseModerationStatus" NOT NULL DEFAULT 'draft',
    "lastVerifiedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "contactName" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "houses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "house_images" (
    "id" TEXT NOT NULL,
    "houseId" INTEGER,
    "uploaderId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "house_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "publishers_userId_key" ON "publishers"("userId");

-- CreateIndex
CREATE INDEX "houses_publisherId_idx" ON "houses"("publisherId");

-- CreateIndex
CREATE INDEX "houses_moderationStatus_idx" ON "houses"("moderationStatus");

-- CreateIndex
CREATE INDEX "houses_listingStatus_idx" ON "houses"("listingStatus");

-- CreateIndex
CREATE INDEX "houses_prefecture_idx" ON "houses"("prefecture");

-- CreateIndex
CREATE INDEX "houses_city_idx" ON "houses"("city");

-- CreateIndex
CREATE INDEX "houses_publishedAt_idx" ON "houses"("publishedAt");

-- CreateIndex
CREATE INDEX "house_images_houseId_idx" ON "house_images"("houseId");

-- CreateIndex
CREATE INDEX "house_images_uploaderId_idx" ON "house_images"("uploaderId");

-- AddForeignKey
ALTER TABLE "publishers" ADD CONSTRAINT "publishers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "houses" ADD CONSTRAINT "houses_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "house_images" ADD CONSTRAINT "house_images_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "houses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "house_images" ADD CONSTRAINT "house_images_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
