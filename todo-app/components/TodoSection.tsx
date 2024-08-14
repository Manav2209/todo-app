"use client"


interface Todo {
    id: string;
    title: string;
    description: string;
    userId?: number;
    status: string;
    createdAt?: string;
    updatedAt?: string;
  }

export const TodoSection = ({
    title,
    todos,
    onTodoClick,
    onDeleteTodo,
  }: {
    title: string;
    todos: Todo[];
    onTodoClick: (todo: Todo) => void;
    onDeleteTodo: (todoId: string) => void;
  }) => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="w-full">
          {Array.isArray(todos) && todos.length > 0 ? (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onTodoClick(todo)}
                >
                  <h3 className="text-xl font-semibold mb-2">{todo.title}</h3>
                  <p className="text-gray-600 mb-2">{todo.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 rounded ${getStatusColor(
                        todo.status
                      )}`}
                    >
                      {todo.status}
                    </span>
                    <span>
                      {todo.updatedAt
                        ? `Updated: ${new Date(
                            todo.updatedAt
                          ).toLocaleDateString()}`
                        : `Created: ${new Date(
                            todo.createdAt!
                          ).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="ml-4 text-sm px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No todos available.</p>
          )}
        </div>
      </div>
    );
  }
  
  function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "inprogress":
        return "bg-blue-200 text-blue-800";
      case "completed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  }