import { z } from 'zod';
import { PropertyType, RoadType, ConstructionType, NRPropCategory, NRSubCategory } from '@prisma/client';

// Nested DTOs
const PropertyDetailsSchema = z.object({
  responseTypeId: z.string().uuid(),
  houseNumber: z.string(),
  electricityNo: z.string(),
  wardSewerageNo: z.string(),
  respondentName: z.string(),
  isRented: z.boolean().default(false),
  rentAmount: z.number().optional(),
  tenantName: z.string().optional(),
  tenantMobile: z.string().optional(),
  tenantAadhaar: z.string().optional(),
});

const OwnerDetailsSchema = z.object({
  ownerName: z.string(),
  fatherHusbandName: z.string(),
  mobileNo: z.string(),
  aadhaarNo: z.string(),
  email: z.string().email().optional(),
  alternateMobile: z.string().optional(),
  isNRI: z.boolean().default(false),
  nriAddress: z.string().optional(),
});

const LocationDetailsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  assessmentYear: z.string(),
  roadTypeId: z.string().uuid(),
  constructionYear: z.string(),
  constructionTypeId: z.string().uuid(),
  landmark: z.string(),
  address: z.string(),
  newWardNo: z.string(),
  plotArea: z.number(),
  builtUpArea: z.number(),
});

const OtherDetailsSchema = z.object({
  rainHarvesting: z.boolean(),
  waterSupply: z.string(),
  sewerageLine: z.string(),
  parkingType: z.string(),
  parkingArea: z.number().optional(),
  isCommercial: z.boolean().default(false),
  commercialArea: z.number().optional(),
});

const FloorDetailsSchema = z.object({
  floorNo: z.number(),
  floorType: z.string(),
  details: z.string(),
  area: z.number(),
  usage: z.string(),
  isRented: z.boolean().default(false),
  rentAmount: z.number().optional(),
});

const PropertyAssessmentSchema = z.object({
  categoryId: z.string().uuid(),
  subCategoryId: z.string().uuid(),
  annualRent: z.number(),
  marketValue: z.number(),
  assessedValue: z.number(),
  taxAmount: z.number(),
  remarks: z.string().optional(),
});

const PropertyAttachmentSchema = z.object({
  type: z.enum(['PHOTO', 'DOCUMENT']),
  url: z.string().url(),
  description: z.string().optional(),
});

// Main Survey DTO
export const SurveySyncDtoSchema = z.object({
  ulbId: z.string().uuid(),
  zoneId: z.string().uuid(),
  wardId: z.string().uuid(),
  mohallaId: z.string().uuid(),
  dateOfEntry: z.string().datetime(),
  gisId: z.string(),
  mapId: z.string(),
  subGisId: z.string(),
  propertyType: z.nativeEnum(PropertyType),
  property: PropertyDetailsSchema,
  owner: OwnerDetailsSchema,
  location: LocationDetailsSchema,
  other: OtherDetailsSchema,
  floors: z.array(FloorDetailsSchema),
  assessment: PropertyAssessmentSchema,
  attachments: z.array(PropertyAttachmentSchema),
});

// Type inference
export type SurveySyncDto = z.infer<typeof SurveySyncDtoSchema>;
export type PropertyDetailsDto = z.infer<typeof PropertyDetailsSchema>;
export type OwnerDetailsDto = z.infer<typeof OwnerDetailsSchema>;
export type LocationDetailsDto = z.infer<typeof LocationDetailsSchema>;
export type OtherDetailsDto = z.infer<typeof OtherDetailsSchema>;
export type FloorDetailsDto = z.infer<typeof FloorDetailsSchema>;
export type PropertyAssessmentDto = z.infer<typeof PropertyAssessmentSchema>;
export type PropertyAttachmentDto = z.infer<typeof PropertyAttachmentSchema>; 