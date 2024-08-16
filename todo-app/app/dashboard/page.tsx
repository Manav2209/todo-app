"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Appbar2 } from "@/components/Appbar2";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import EditTodo from "@/components/EditTodo";
import CreateTodo from "@/components/createTodo";
import { TodoSection } from "@/components/TodoSection";

interface Todo {
  id: string;
  title: string;
  description: string;
  userId?: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

function useTodos() {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token); 

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('api/todo', {
          headers: {
            Authorization: token,
          },
        });
        console.log("Response data:", response.data); 
        setTodos(response.data || []);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setTodos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    console.log("Todos state:", todos); 
  }, [todos]);

  const addTodo = (todo: Todo) => {
    setTodos((prevTodos) => [todo, ...prevTodos]);
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const deleteTodo = (todoId: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
  };

  return { loading, todos, addTodo, updateTodo, deleteTodo };
}

export default function TodoPage() {
  const { loading, todos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      await axios.delete(`api/todo/${todoId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      deleteTodo(todoId);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const sortedTodos = todos.reduce(
    (acc: { pending: Todo[]; inprogress: Todo[]; completed: Todo[] }, todo) => {

      //@ts-ignore
      acc[todo.status.toLowerCase()].push(todo);
      return acc;
    },
    { pending: [], inprogress: [], completed: [] }
  );

  return (
    <div>
      <Appbar2/>
      <div className="flex justify-center pt-8">
        <div className="max-w-screen-lg w-full">
          <div className="flex justify-between pr-8 mb-6">
            <div className="text-2xl font-bold">My Todos</div>
            <PrimaryButton
              onClick={() => setIsCreateModalOpen(true)}
              size="small"
            >
              + Create
            </PrimaryButton>
          </div>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="flex flex-col gap-6">
              <TodoSection
                title="Pending"
                todos={sortedTodos.pending}
                onTodoClick={handleTodoClick}
                onDeleteTodo={handleDeleteTodo}
              />
              <TodoSection
                title="In Progress"
                todos={sortedTodos.inprogress}
                onTodoClick={handleTodoClick}
                onDeleteTodo={handleDeleteTodo}
              />
              <TodoSection
                title="Completed"
                todos={sortedTodos.completed}
                onTodoClick={handleTodoClick}
                onDeleteTodo={handleDeleteTodo}
              />
            </div>
          )}
        </div>
      </div>
      <CreateTodo
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTodoCreated={addTodo}
      />
      <EditTodo
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        todo={selectedTodo}
        onTodoUpdated={updateTodo}
      />
    </div>
  );
}
