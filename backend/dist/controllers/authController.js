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
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const authDto_1 = require("../dtos/authDto");
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const validatedData = authDto_1.RegisterDtoSchema.parse(req.body);
                const currentUserRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
                if (!currentUserRole) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const result = yield authService_1.AuthService.register(validatedData, currentUserRole);
                res.status(201).json(result);
            }
            catch (error) {
                if (error.name === 'ZodError') {
                    res.status(400).json({ error: error.errors });
                    return;
                }
                res.status(400).json({ error: error.message });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = authDto_1.LoginDtoSchema.parse(req.body);
                const result = yield authService_1.AuthService.login(validatedData);
                res.json(result);
            }
            catch (error) {
                if (error.name === 'ZodError') {
                    res.status(400).json({ error: error.errors });
                    return;
                }
                res.status(401).json({ error: error.message });
            }
        });
    }
}
exports.AuthController = AuthController;
