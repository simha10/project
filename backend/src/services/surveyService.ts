import { PrismaClient, Prisma } from '@prisma/client';
import { SurveySyncDto } from '../dtos/surveyDto';

const prisma = new PrismaClient();

export class SurveyService {
  static async syncSurvey(data: SurveySyncDto, surveyorId: string) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create the main survey record with all nested relations
      const survey = await tx.survey.create({
        data: {
          surveyorId,
          ulbId: data.ulbId,
          zoneId: data.zoneId,
          wardId: data.wardId,
          mohallaId: data.mohallaId,
          dateOfEntry: new Date(data.dateOfEntry as string),
          gisId: data.gisId,
          mapId: data.mapId,
          subGisId: data.subGisId,
          propertyType: data.propertyType,
          status: 'PENDING',
          
          // Create nested relations
          property: {
            create: data.property
          },
          owner: {
            create: data.owner
          },
          location: {
            create: data.location
          },
          other: {
            create: data.other
          },
          assessment: {
            create: data.assessment
          },
          floors: {
            createMany: {
              data: data.floors
            }
          },
          attachments: {
            createMany: {
              data: data.attachments
            }
          }
        },
        include: {
          property: true,
          owner: true,
          location: true,
          other: true,
          assessment: true,
          floors: true,
          attachments: true
        }
      });

      return survey;
    });
  }
} 