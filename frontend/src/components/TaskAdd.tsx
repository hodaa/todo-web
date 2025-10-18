interface TaskAddProps {
  addTask: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  taskTitle: string;
  setTaskTitle: React.Dispatch<React.SetStateAction<string>>;
}

export default function TaskAdd({ addTask, taskTitle, setTaskTitle }: TaskAddProps) {
  return (
    <header className="header">
      <h1 id="todos-heading">todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        aria-label="Add a new task"
        aria-labelledby="todos-heading"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaskTitle(e.currentTarget.value)}
        onKeyDown={addTask}
        value={taskTitle}
        autoFocus
      />
    </header>
  );
}
