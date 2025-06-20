import { z } from 'zod';

// PropertyDetails
export const PropertyDetailsSchema = z.object({
  responseTypeId: z.string().uuid(),
  oldHouseNumber: z.string().optional(),
  electricityConsumerName: z.string().optional(),
  waterSewerageConnectionNumber: z.string().optional(),
  respondentName: z.string(),
  respondentStatusId: z.string().uuid(),
});

// OwnerDetails
export const OwnerDetailsSchema = z.object({
  ownerName: z.string(),
  fatherHusbandName: z.string(),
  mobileNumber: z.string().optional(),
  aadharNumber: z.string().optional(),
});

// LocationDetails
export const LocationDetailsSchema = z.object({
  propertyLatitude: z.number(),
  propertyLongitude: z.number(),
  assessmentYear: z.string(),
  propertyTypeId: z.string().uuid(),
  buildingName: z.string().optional(),
  roadTypeId: z.string().uuid(),
  constructionYear: z.string(),
  constructionTypeId: z.string().uuid(),
  addressRoadName: z.string(),
  locality: z.string().optional(),
  pinCode: z.number(),
  landmark: z.string().optional(),
  fourWayEast: z.string().optional(),
  fourWayWest: z.string().optional(),
  fourWayNorth: z.string().optional(),
  fourWaySouth: z.string().optional(),
  newWard: z.string(),
});

// OtherDetails
export const OtherDetailsSchema = z.object({
  waterSourceId: z.string().uuid(),
  rainWaterHarvestingSystem: z.string().optional(),
  plantation: z.string().optional(),
  parking: z.string().optional(),
  pollution: z.string().optional(),
  pollutionMeasurementTaken: z.string().optional(),
  waterSupplyWithin200Meters: z.string().optional(),
  sewerageLineWithin100Meters: z.string().optional(),
  disposalTypeId: z.string().uuid(),
  totalPlotArea: z.number(),
  builtupAreaOfGroundFloor: z.number(),
  remarks: z.string().optional(),
});

// ResidentialPropertyAssessment
export const ResidentialPropertyAssessmentSchema = z.object({
  floorNumber: z.string(),
  occupancyStatusId: z.string().uuid(),
  constructionNatureId: z.string().uuid(),
  coveredArea: z.number(),
  allRoomVerandaArea: z.number(),
  allBalconyKitchenArea: z.number(),
  allGarageArea: z.number(),
  carpetArea: z.number(),
});

// PropertyAttachmentDetails
export const PropertyAttachmentDetailsSchema = z.object({
  image1Url: z.string().optional(),
  image2Url: z.string().optional(),
  image3Url: z.string().optional(),
  image4Url: z.string().optional(),
  image5Url: z.string().optional(),
  image6Url: z.string().optional(),
  image7Url: z.string().optional(),
  image8Url: z.string().optional(),
  image9Url: z.string().optional(),
  image10Url: z.string().optional(),
});

// Main Survey DTO
export const SurveySyncDtoSchema = z.object({
  ulbId: z.string().uuid(),
  zoneId: z.string().uuid(),
  wardId: z.string().uuid(),
  mohallaId: z.string().uuid(),
  surveyTypeId: z.string().uuid(),
  entryDate: z.string().datetime(),
  parcelId: z.number().optional(),
  mapId: z.number(),
  gisId: z.string(),
  subGisId: z.string().optional(),
  propertyDetails: PropertyDetailsSchema,
  ownerDetails: OwnerDetailsSchema,
  locationDetails: LocationDetailsSchema,
  otherDetails: OtherDetailsSchema,
  residentialPropertyAssessments: z.array(ResidentialPropertyAssessmentSchema),
  propertyAttachments: z.array(PropertyAttachmentDetailsSchema),
});

export type SurveySyncDto = z.infer<typeof SurveySyncDtoSchema>;

// Type inference
export type PropertyDetailsDto = z.infer<typeof PropertyDetailsSchema>;
export type OwnerDetailsDto = z.infer<typeof OwnerDetailsSchema>;
export type LocationDetailsDto = z.infer<typeof LocationDetailsSchema>;
export type OtherDetailsDto = z.infer<typeof OtherDetailsSchema>;
export type ResidentialPropertyAssessmentDto = z.infer<typeof ResidentialPropertyAssessmentSchema>;
export type PropertyAttachmentDto = z.infer<typeof PropertyAttachmentDetailsSchema>; 