"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveySyncDtoSchema = void 0;
const zod_1 = require("zod");
// Nested DTOs
const PropertyDetailsSchema = zod_1.z.object({
    responseTypeId: zod_1.z.string().uuid(),
    houseNumber: zod_1.z.string(),
    electricityNo: zod_1.z.string(),
    wardSewerageNo: zod_1.z.string(),
    respondentName: zod_1.z.string(),
    isRented: zod_1.z.boolean().default(false),
    rentAmount: zod_1.z.number().optional(),
    tenantName: zod_1.z.string().optional(),
    tenantMobile: zod_1.z.string().optional(),
    tenantAadhaar: zod_1.z.string().optional(),
});
const OwnerDetailsSchema = zod_1.z.object({
    ownerName: zod_1.z.string(),
    fatherHusbandName: zod_1.z.string(),
    mobileNo: zod_1.z.string(),
    aadhaarNo: zod_1.z.string(),
    email: zod_1.z.string().email().optional(),
    alternateMobile: zod_1.z.string().optional(),
    isNRI: zod_1.z.boolean().default(false),
    nriAddress: zod_1.z.string().optional(),
});
const LocationDetailsSchema = zod_1.z.object({
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    assessmentYear: zod_1.z.string(),
    roadTypeId: zod_1.z.string().uuid(),
    constructionYear: zod_1.z.string(),
    constructionTypeId: zod_1.z.string().uuid(),
    landmark: zod_1.z.string(),
    address: zod_1.z.string(),
    newWardNo: zod_1.z.string(),
    plotArea: zod_1.z.number(),
    builtUpArea: zod_1.z.number(),
});
const OtherDetailsSchema = zod_1.z.object({
    rainHarvesting: zod_1.z.boolean(),
    waterSupply: zod_1.z.string(),
    sewerageLine: zod_1.z.string(),
    parkingType: zod_1.z.string(),
    parkingArea: zod_1.z.number().optional(),
    isCommercial: zod_1.z.boolean().default(false),
    commercialArea: zod_1.z.number().optional(),
});
const FloorDetailsSchema = zod_1.z.object({
    floorNo: zod_1.z.number(),
    floorType: zod_1.z.string(),
    details: zod_1.z.string(),
    area: zod_1.z.number(),
    usage: zod_1.z.string(),
    isRented: zod_1.z.boolean().default(false),
    rentAmount: zod_1.z.number().optional(),
});
const PropertyAssessmentSchema = zod_1.z.object({
    categoryId: zod_1.z.string().uuid(),
    subCategoryId: zod_1.z.string().uuid(),
    annualRent: zod_1.z.number(),
    marketValue: zod_1.z.number(),
    assessedValue: zod_1.z.number(),
    taxAmount: zod_1.z.number(),
    remarks: zod_1.z.string().optional(),
});
const PropertyAttachmentSchema = zod_1.z.object({
    type: zod_1.z.enum(['PHOTO', 'DOCUMENT']),
    url: zod_1.z.string().url(),
    description: zod_1.z.string().optional(),
});
// Main Survey DTO
exports.SurveySyncDtoSchema = zod_1.z.object({
    ulbId: zod_1.z.string().uuid(),
    zoneId: zod_1.z.string().uuid(),
    wardId: zod_1.z.string().uuid(),
    mohallaId: zod_1.z.string().uuid(),
    dateOfEntry: zod_1.z.string().datetime(),
    gisId: zod_1.z.string(),
    mapId: zod_1.z.string(),
    subGisId: zod_1.z.string(),
    propertyType: zod_1.z.string(),
    property: PropertyDetailsSchema,
    owner: OwnerDetailsSchema,
    location: LocationDetailsSchema,
    other: OtherDetailsSchema,
    floors: zod_1.z.array(FloorDetailsSchema),
    assessment: PropertyAssessmentSchema,
    attachments: zod_1.z.array(PropertyAttachmentSchema),
});
