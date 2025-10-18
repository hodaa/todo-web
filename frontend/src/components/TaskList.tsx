import type { Task } from '../types/task';

type Props = {
  tasks: Task[];
  completeAllTasks: (isCompleted: boolean) => Promise<void>;
  completeTask: (taskId: number, isCompleted: boolean) =>  Promise<void>;
  fetchTasks: (url?: string) =>  Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
  next: string | null;
  prev: string | null;
};

export default function TaskList({
  tasks,
  completeAllTasks,
  completeTask ,
  fetchTasks,
  deleteTask ,
  next,
  prev
}: Props) {
  
  return (
    
    <main className="main">
      <input
        id="toggle-all"
        className='toggle-all'
        type="checkbox"
        aria-label="Mark all tasks as complete"
        onChange={(e) => completeAllTasks(e.currentTarget.checked)}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list" id="task-list" role="list">
        {tasks.map((task: Task) => (
          <li key={task.id} className={task.is_completed ? "completed" : ""} role="listitem">
            <div className="view">
              <input
                className="toggle"
                type="checkbox"
                aria-label={task.is_completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
                onChange={(e) => completeTask(task.id, e.currentTarget.checked)}
                checked={task.is_completed}
              />
              <label>{task.title}</label>
              <button
                className="destroy"
                aria-label={`Delete ${task.title}`}
                onClick={() => deleteTask(task.id)}
              ></button>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {prev && <button onClick={() => fetchTasks(prev)} aria-label="Previous page">Previous</button>}
        {next && <button onClick={() => fetchTasks(next)} aria-label="Next page">Next</button>}
      </div>
    </main>
  );

}
