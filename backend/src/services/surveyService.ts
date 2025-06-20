import { PrismaClient, Prisma } from '@prisma/client';
import { SurveySyncDto } from '../dtos/surveyDto';

const prisma = new PrismaClient();

export class SurveyService {
  static async syncSurvey(data: SurveySyncDto, surveyorId: string) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Map incoming data to the new DTO structure if needed
      const propertyDetails = {
        responseTypeId: data.property?.responseTypeId || data.propertyDetails?.responseTypeId,
        oldHouseNumber: data.property?.oldHouseNumber || data.propertyDetails?.oldHouseNumber,
        electricityConsumerName: data.property?.electricityNo || data.propertyDetails?.electricityConsumerName,
        waterSewerageConnectionNumber: data.property?.wardSewerageNo || data.propertyDetails?.waterSewerageConnectionNumber,
        respondentName: data.property?.respondentName || data.propertyDetails?.respondentName,
        respondentStatusId: data.property?.respondentStatusId || data.propertyDetails?.respondentStatusId,
      };
      const locationDetails = {
        propertyLatitude: data.location?.latitude || data.locationDetails?.propertyLatitude,
        propertyLongitude: data.location?.longitude || data.locationDetails?.propertyLongitude,
        assessmentYear: data.location?.assessmentYear || data.locationDetails?.assessmentYear,
        propertyTypeId: data.location?.propertyTypeId || data.locationDetails?.propertyTypeId,
        buildingName: data.location?.buildingName || data.locationDetails?.buildingName,
        roadTypeId: data.location?.roadTypeId || data.locationDetails?.roadTypeId,
        constructionYear: data.location?.constructionYear || data.locationDetails?.constructionYear,
        constructionTypeId: data.location?.constructionTypeId || data.locationDetails?.constructionTypeId,
        addressRoadName: data.location?.address || data.locationDetails?.addressRoadName,
        locality: data.location?.locality || data.locationDetails?.locality,
        pinCode: data.location?.pinCode || data.locationDetails?.pinCode,
        landmark: data.location?.landmark || data.locationDetails?.landmark,
        fourWayEast: data.location?.fourWayEast || data.locationDetails?.fourWayEast,
        fourWayWest: data.location?.fourWayWest || data.locationDetails?.fourWayWest,
        fourWayNorth: data.location?.fourWayNorth || data.locationDetails?.fourWayNorth,
        fourWaySouth: data.location?.fourWaySouth || data.locationDetails?.fourWaySouth,
        newWard: data.location?.newWardNo || data.locationDetails?.newWard,
      };
      const otherDetails = {
        waterSourceId: data.other?.waterSourceId || data.otherDetails?.waterSourceId,
        rainWaterHarvestingSystem: data.other?.rainHarvesting || data.otherDetails?.rainWaterHarvestingSystem,
        plantation: data.other?.plantation || data.otherDetails?.plantation,
        parking: data.other?.parkingType || data.otherDetails?.parking,
        pollution: data.other?.pollution || data.otherDetails?.pollution,
        pollutionMeasurementTaken: data.other?.pollutionMeasurementTaken || data.otherDetails?.pollutionMeasurementTaken,
        waterSupplyWithin200Meters: data.other?.waterSupply || data.otherDetails?.waterSupplyWithin200Meters,
        sewerageLineWithin100Meters: data.other?.sewerageLine || data.otherDetails?.sewerageLineWithin100Meters,
        disposalTypeId: data.other?.disposalTypeId || data.otherDetails?.disposalTypeId,
        totalPlotArea: data.other?.plotArea || data.otherDetails?.totalPlotArea,
        builtupAreaOfGroundFloor: data.other?.builtUpArea || data.otherDetails?.builtupAreaOfGroundFloor,
        remarks: data.other?.remarks || data.otherDetails?.remarks,
      };
      const residentialPropertyAssessments = (data.floors || data.residentialPropertyAssessments || []).map((floor: any) => ({
        floorNumber: floor.floorNo?.toString() || floor.floorNumber,
        occupancyStatusId: floor.occupancyStatusId,
        constructionNatureId: floor.constructionNatureId,
        coveredArea: floor.coveredArea,
        allRoomVerandaArea: floor.allRoomVerandaArea,
        allBalconyKitchenArea: floor.allBalconyKitchenArea,
        allGarageArea: floor.allGarageArea,
        carpetArea: floor.carpetArea,
      }));
      const propertyAttachments = (data.attachments || data.propertyAttachments || []).map((att: any) => ({
        image1Url: att.image1Url,
        image2Url: att.image2Url,
        image3Url: att.image3Url,
        image4Url: att.image4Url,
        image5Url: att.image5Url,
        image6Url: att.image6Url,
        image7Url: att.image7Url,
        image8Url: att.image8Url,
        image9Url: att.image9Url,
        image10Url: att.image10Url,
      }));
      const ownerDetails = data.ownerDetails || data.owner;
      // Now call Prisma
      const survey = await tx.surveyDetails.create({
        data: {
          ulbId: data.ulbId,
          zoneId: data.zoneId,
          wardId: data.wardId,
          mohallaId: data.mohallaId,
          surveyTypeId: data.surveyTypeId,
          entryDate: new Date(data.entryDate),
          parcelId: data.parcelId,
          mapId: data.mapId,
          gisId: data.gisId,
          subGisId: data.subGisId,
          propertyDetails: { create: propertyDetails },
          ownerDetails: { create: ownerDetails },
          locationDetails: { create: locationDetails },
          otherDetails: { create: otherDetails },
          residentialPropertyAssessments: { createMany: { data: residentialPropertyAssessments } },
          propertyAttachments: { createMany: { data: propertyAttachments } },
        },
        include: {
          residentialPropertyAssessments: true,
          propertyAttachments: true
        }
      });

      return survey;
    });
  }
} 