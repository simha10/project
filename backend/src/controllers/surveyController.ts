import { Request, Response } from 'express';
import { SurveyService } from '../services/surveyService';
import { SurveySyncDtoSchema } from '../dtos/surveyDto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';

export class SurveyController {
  static async syncSurvey(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = SurveySyncDtoSchema.parse(req.body);
      
      // Get surveyor ID from authenticated user
      const surveyorId = req.user?.id;
      if (!surveyorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Create survey with all nested relations
      const survey = await SurveyService.syncSurvey(validatedData, surveyorId);
      
      res.status(201).json(survey);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Handle Prisma errors
        switch (error.code) {
          case 'P2002':
            res.status(400).json({ error: 'A unique constraint would be violated' });
            break;
          case 'P2003':
            res.status(400).json({ error: 'Foreign key constraint failed' });
            break;
          default:
            res.status(500).json({ error: 'Database error occurred' });
        }
      } else if (error instanceof ZodError) {
        // Handle validation errors
        res.status(400).json({ error: error.errors });
      } else {
        // Handle other errors
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
} 