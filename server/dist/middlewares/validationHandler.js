"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIdParam = void 0;
const checkIdParam = (req, res, next) => {
    const id = req.params.id;
    if (!id || !/^\d+$/.test(id)) {
        return res.status(400).json({
            error: "Bad Request: L'ID fourni doit être un nombre entier valide."
        });
    }
    next();
};
exports.checkIdParam = checkIdParam;
//# sourceMappingURL=validationHandler.js.map