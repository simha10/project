-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('RESIDENTIAL', 'NON_RESIDENTIAL', 'MIXED');

-- CreateEnum
CREATE TYPE "RoadType" AS ENUM ('METALLED', 'UNMETALLED', 'KACHA', 'OTHER');

-- CreateEnum
CREATE TYPE "ConstructionType" AS ENUM ('RCC', 'LOAD_BEARING', 'MIXED', 'OTHER');

-- CreateEnum
CREATE TYPE "NRPropCategory" AS ENUM ('COMMERCIAL', 'INDUSTRIAL', 'INSTITUTIONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "NRSubCategory" AS ENUM ('SHOP', 'OFFICE', 'WAREHOUSE', 'FACTORY', 'SCHOOL', 'HOSPITAL', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "assignedWards" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ULB" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ULB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ulbId" TEXT NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ward" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mohalla" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,

    CONSTRAINT "Mohalla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyResponseType" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "PropertyResponseType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadTypeMapping" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "RoadTypeMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConstructionTypeMapping" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ConstructionTypeMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NRPropCategoryMapping" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "NRPropCategoryMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NRPropSubCategoryMapping" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "NRPropSubCategoryMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "surveyorId" TEXT NOT NULL,
    "ulbId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "mohallaId" TEXT NOT NULL,
    "dateOfEntry" TIMESTAMP(3) NOT NULL,
    "gisId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "subGisId" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyDetails" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "responseTypeId" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "electricityNo" TEXT NOT NULL,
    "wardSewerageNo" TEXT NOT NULL,
    "respondentName" TEXT NOT NULL,
    "isRented" BOOLEAN NOT NULL DEFAULT false,
    "rentAmount" DOUBLE PRECISION,
    "tenantName" TEXT,
    "tenantMobile" TEXT,
    "tenantAadhaar" TEXT,

    CONSTRAINT "PropertyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnerDetails" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "fatherHusbandName" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,
    "aadhaarNo" TEXT NOT NULL,
    "email" TEXT,
    "alternateMobile" TEXT,
    "isNRI" BOOLEAN NOT NULL DEFAULT false,
    "nriAddress" TEXT,

    CONSTRAINT "OwnerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationDetails" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "assessmentYear" TEXT NOT NULL,
    "roadTypeId" TEXT NOT NULL,
    "constructionYear" TEXT NOT NULL,
    "constructionTypeId" TEXT NOT NULL,
    "landmark" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "newWardNo" TEXT NOT NULL,
    "plotArea" DOUBLE PRECISION NOT NULL,
    "builtUpArea" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LocationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherDetails" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "rainHarvesting" BOOLEAN NOT NULL,
    "waterSupply" TEXT NOT NULL,
    "sewerageLine" TEXT NOT NULL,
    "parkingType" TEXT NOT NULL,
    "parkingArea" DOUBLE PRECISION,
    "isCommercial" BOOLEAN NOT NULL DEFAULT false,
    "commercialArea" DOUBLE PRECISION,

    CONSTRAINT "OtherDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FloorDetails" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "floorNo" INTEGER NOT NULL,
    "floorType" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "usage" TEXT NOT NULL,
    "isRented" BOOLEAN NOT NULL DEFAULT false,
    "rentAmount" DOUBLE PRECISION,

    CONSTRAINT "FloorDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAssessment" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "annualRent" DOUBLE PRECISION NOT NULL,
    "marketValue" DOUBLE PRECISION NOT NULL,
    "assessedValue" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "PropertyAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QCRecord" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "qcOfficerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "remarks" TEXT,
    "qcDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QCRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyAttachment" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ULB_name_key" ON "ULB"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyResponseType_code_key" ON "PropertyResponseType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RoadTypeMapping_code_key" ON "RoadTypeMapping"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ConstructionTypeMapping_code_key" ON "ConstructionTypeMapping"("code");

-- CreateIndex
CREATE UNIQUE INDEX "NRPropCategoryMapping_code_key" ON "NRPropCategoryMapping"("code");

-- CreateIndex
CREATE UNIQUE INDEX "NRPropSubCategoryMapping_code_key" ON "NRPropSubCategoryMapping"("code");

-- CreateIndex
CREATE INDEX "Survey_surveyorId_idx" ON "Survey"("surveyorId");

-- CreateIndex
CREATE INDEX "Survey_ulbId_idx" ON "Survey"("ulbId");

-- CreateIndex
CREATE INDEX "Survey_zoneId_idx" ON "Survey"("zoneId");

-- CreateIndex
CREATE INDEX "Survey_wardId_idx" ON "Survey"("wardId");

-- CreateIndex
CREATE INDEX "Survey_mohallaId_idx" ON "Survey"("mohallaId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyDetails_surveyId_key" ON "PropertyDetails"("surveyId");

-- CreateIndex
CREATE UNIQUE INDEX "OwnerDetails_surveyId_key" ON "OwnerDetails"("surveyId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationDetails_surveyId_key" ON "LocationDetails"("surveyId");

-- CreateIndex
CREATE UNIQUE INDEX "OtherDetails_surveyId_key" ON "OtherDetails"("surveyId");

-- CreateIndex
CREATE INDEX "FloorDetails_surveyId_idx" ON "FloorDetails"("surveyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyAssessment_surveyId_key" ON "PropertyAssessment"("surveyId");

-- CreateIndex
CREATE UNIQUE INDEX "QCRecord_surveyId_key" ON "QCRecord"("surveyId");

-- CreateIndex
CREATE INDEX "QCRecord_qcOfficerId_idx" ON "QCRecord"("qcOfficerId");

-- CreateIndex
CREATE INDEX "PropertyAttachment_surveyId_idx" ON "PropertyAttachment"("surveyId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_ulbId_fkey" FOREIGN KEY ("ulbId") REFERENCES "ULB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mohalla" ADD CONSTRAINT "Mohalla_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NRPropSubCategoryMapping" ADD CONSTRAINT "NRPropSubCategoryMapping_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "NRPropCategoryMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_surveyorId_fkey" FOREIGN KEY ("surveyorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_ulbId_fkey" FOREIGN KEY ("ulbId") REFERENCES "ULB"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_mohallaId_fkey" FOREIGN KEY ("mohallaId") REFERENCES "Mohalla"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetails" ADD CONSTRAINT "PropertyDetails_responseTypeId_fkey" FOREIGN KEY ("responseTypeId") REFERENCES "PropertyResponseType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnerDetails" ADD CONSTRAINT "OwnerDetails_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_roadTypeId_fkey" FOREIGN KEY ("roadTypeId") REFERENCES "RoadTypeMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationDetails" ADD CONSTRAINT "LocationDetails_constructionTypeId_fkey" FOREIGN KEY ("constructionTypeId") REFERENCES "ConstructionTypeMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherDetails" ADD CONSTRAINT "OtherDetails_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FloorDetails" ADD CONSTRAINT "FloorDetails_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAssessment" ADD CONSTRAINT "PropertyAssessment_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAssessment" ADD CONSTRAINT "PropertyAssessment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "NRPropCategoryMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAssessment" ADD CONSTRAINT "PropertyAssessment_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "NRPropSubCategoryMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCRecord" ADD CONSTRAINT "QCRecord_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCRecord" ADD CONSTRAINT "QCRecord_qcOfficerId_fkey" FOREIGN KEY ("qcOfficerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyAttachment" ADD CONSTRAINT "PropertyAttachment_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
