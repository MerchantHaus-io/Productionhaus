import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { PageSEO } from "@/components/PageSEO";

type Todo = {
  id: number | string;
  title: string | null;
};

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const getTodos = async () => {
      const { data, error } = await supabase.from("todos").select("id, title");

      if (error) {
        console.error("Error fetching todos:", error.message);
        return;
      }

      setTodos(data ?? []);
    };

    void getTodos();
  }, []);

  return (
    <div>
      <PageSEO title="Todos" description="Internal task list" noindex />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title ?? "Untitled todo"}</li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
