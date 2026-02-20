import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import TodoApp from "./components/TodoApp";
import { loadTodos, saveTodos } from "./utils/storage";

// PUBLIC_INTERFACE
function App() {
  /** Root application component. Hosts the retro-themed to-do app and handles persistence. */
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
    <div className="App">
      <TodoApp todos={todos} setTodos={setTodos} stats={stats} />
    </div>
  );
}

export default App;
