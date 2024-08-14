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
exports.todoRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const db_1 = require("../db");
const zod_1 = require("zod");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// Zod schema for todo validationc
// Create a new todo
router.post("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const id = req.id;
    console.log(id);
    const body = req.body;
    const parsedData = types_1.TodoSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }
    const todo = yield db_1.prismaClient.todo.create({
        data: {
            userId: Number(id),
            title: parsedData.data.title,
            description: parsedData.data.description,
            status: parsedData.data.status
        }
    });
    res.json(todo);
}));
// Read all todos with optional status filter
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        const statusSchema = zod_1.z
            .enum(["pending", "inprogress", "completed"])
            .optional();
        const validatedStatus = statusSchema.parse(status);
        //@ts-ignore
        const userId = req.id;
        const todos = yield db_1.prismaClient.todo.findMany({
            where: Object.assign({ userId: userId }, (validatedStatus ? { status: validatedStatus } : {})),
        });
        res.json(todos);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}));
// Update a todo
router.put("/:id", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, status } = types_1.TodoSchema.parse(req.body);
        const todo = yield db_1.prismaClient.todo.update({
            where: { id: id },
            data: { title, description, status },
        });
        res.json(todo);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}));
// Delete a todo
router.delete("/:id", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield db_1.prismaClient.todo.delete({
            where: { id: id },
        });
        res.json({ message: "Todo deleted successfully" });
    }
    catch (error) {
        res.status(500).json({
            error: " Inernal server error"
        });
    }
}));
exports.todoRouter = router;
