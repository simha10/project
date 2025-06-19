"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyController = void 0;
const surveyService_1 = require("../services/surveyService");
const surveyDto_1 = require("../dtos/surveyDto");
const library_1 = require("@prisma/client/runtime/library");
const zod_1 = require("zod");
class SurveyController {
    static syncSurvey(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Validate request body
                const validatedData = surveyDto_1.SurveySyncDtoSchema.parse(req.body);
                // Get surveyor ID from authenticated user
                const surveyorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!surveyorId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                // Create survey with all nested relations
                const survey = yield surveyService_1.SurveyService.syncSurvey(validatedData, surveyorId);
                res.status(201).json(survey);
            }
            catch (error) {
                if (error instanceof library_1.PrismaClientKnownRequestError) {
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
                }
                else if (error instanceof zod_1.ZodError) {
                    // Handle validation errors
                    res.status(400).json({ error: error.errors });
                }
                else {
                    // Handle other errors
                    res.status(500).json({ error: 'Internal server error' });
                }
            }
        });
    }
}
exports.SurveyController = SurveyController;
