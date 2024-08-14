import { Router } from "express";
import { TodoSchema } from "../types";
import { prismaClient } from "../db";
import { z } from "zod";
import { authMiddleware } from "../middleware";
import { isGeneratorObject } from "util/types";

const router = Router();
// Zod schema for todo validationc

// Create a new todo
router.post("/"  , authMiddleware , async (req, res) =>{
  // @ts-ignore
  const id : string = req.id;
  console.log(id)
  const body = req.body;
  const parsedData = TodoSchema.safeParse(body);
  
  if (!parsedData.success) {
      return res.status(411).json({
          message: "Incorrect inputs"
      });
  }   
  const todo = await prismaClient.todo.create({
    data:{
      userId: Number(id),
      title: parsedData.data.title,
      description: parsedData.data.description,
      status:parsedData.data.status
    }
  })
  res.json(todo)
})


// Read all todos with optional status filter
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const statusSchema = z
      .enum(["pending", "inprogress", "completed"])
      .optional();
    const validatedStatus = statusSchema.parse(status);
    //@ts-ignore
    const userId = req.id;

    const todos = await prismaClient.todo.findMany({
      where: {
        userId: userId,
        ...(validatedStatus ? { status: validatedStatus } : {}),
      },
    });

    res.json(todos);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Update a todo
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = TodoSchema.parse(req.body);

    const todo = await prismaClient.todo.update({
      where: { id: id },
      data: { title, description, status },
    });

    res.json(todo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Delete a todo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await prismaClient.todo.delete({
      where: { id: id },
    });

    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
  
    res.status(500).json({
      error :" Inernal server error"
    })
  }
});
export const todoRouter = router;
