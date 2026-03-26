"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.createUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User_1.default.create({ name, email, password });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createUser = createUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User_1.default.destroy({ where: { id } });
        if (deleted === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map