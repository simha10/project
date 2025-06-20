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
exports.SurveyService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class SurveyService {
    static syncSurvey(data, surveyorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Create the main survey record with all nested relations
                const survey = yield tx.surveyDetails.create({
                    data: {
                        ulbId: data.ulbId,
                        zoneId: data.zoneId,
                        wardId: data.wardId,
                        mohallaId: data.mohallaId,
                        surveyTypeId: data.surveyTypeId,
                        entryDate: new Date(data.dateOfEntry),
                        gisId: data.gisId,
                        mapId: Number(data.mapId),
                        subGisId: data.subGisId,
                        // Create nested relations
                        propertyDetails: {
                            create: data.property
                        },
                        ownerDetails: {
                            create: data.owner
                        },
                        locationDetails: {
                            create: data.location
                        },
                        otherDetails: {
                            create: data.other
                        },
                        residentialPropertyAssessments: {
                            createMany: {
                                data: data.floors
                            }
                        },
                        propertyAttachments: {
                            createMany: {
                                data: data.attachments
                            }
                        }
                    },
                    include: {
                        residentialPropertyAssessments: true,
                        propertyAttachments: true
                    }
                });
                return survey;
            }));
        });
    }
}
exports.SurveyService = SurveyService;
