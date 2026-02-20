import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import TodoApp from "./components/TodoApp";
import { loadTodos, saveTodos } from "./utils/storage";

// PUBLIC_INTERFACE
function App() {
  /** Root application component. Hosts the modern-themed to-do app and handles persistence. */
  const [todos, setTodos] = useState(() => loadTodos());

  // Persist to localStorage whenever todos change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-cyan-50">
      <TodoApp todos={todos} setTodos={setTodos} stats={stats} />
    </div>
  );
}

export default App;
