import React, { useState, useEffect, Suspense, lazy } from 'react';
import TaskAdd from './TaskAdd';
import { BASE_URL } from './api';

const TaskList = lazy(() => import('./TaskList'));
const Footer = lazy(() => import('./Footer'));

export interface Task {
  id: number,
  title: string,
  is_completed: boolean
}

export default function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>('');
  const [notCompletedTasksCount, setNotCompletedTasksCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [prev, setPrev] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<"all" | "active" | "completed">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (url = BASE_URL + "/tasks"): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(url);
      const data = await res.json();
      setTasks(data.results);
      setNext(data.next);
      setPrev(data.previous);
      setCurrentFilter("all");
    } catch (err: unknown) {
      console.error("Error fetching tasks:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: number): Promise<void> => {

    try {
      await fetch(BASE_URL + '/tasks/' + taskId, {
        method: 'DELETE',
      });
      setTasks(tasks.filter((task: Task) => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };



  const completeTask = async (taskId: number, isCompleted: boolean): Promise<void> => {

    const response = await fetch(BASE_URL + '/tasks/' + taskId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_completed: isCompleted }),
    });
    if (response.ok) {
      setTasks((prevTasks: Task[]) =>
        prevTasks.map((task: Task) =>
          task.id === taskId ? { ...task, is_completed: isCompleted } : task
        )
      );
    }
  }

  const addTask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const taskTitle = e.currentTarget.value;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!taskTitle.trim()) return;
      try {

        const response = await fetch(BASE_URL + '/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: taskTitle }),
        });

        if (!response.ok) throw new Error('Failed to create task');

        const data = await response.json();

        setTasks((prevTasks: Task[]) => [...prevTasks, data]);
        setTaskTitle('')

      } catch (err) {
        console.error(err);
      }
    };
  }

  const completeAllTasks = async (isCompleted: boolean) => {
    const response = await fetch(BASE_URL + '/tasks/complete-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_completed: isCompleted }),
    });
    if (response.ok) {
      setTasks((prevTasks: Task[]) =>
        prevTasks.map(task => ({ ...task, is_completed: isCompleted })
        ));
    }
  }

  const deleteCompletedTask = async (): Promise<void> => {
    const response = await fetch(BASE_URL + '/tasks/completed', {
      method: 'DELETE',
    });
    if (response.ok) {
      setTasks(tasks.filter(task => !task.is_completed));
    }
  };


  const filterTasks = async (is_completed: boolean) => {
    try {
      const url = `${BASE_URL}/tasks?is_completed=${is_completed}`;
      const res = await fetch(url);
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results;
      setTasks(results || []);
      setNext((data && data.next) || null);
      setPrev((data && data.previous) || null);
      setCurrentFilter(is_completed ? "completed" : "active");
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };


useEffect(() => {
  const notCompleted = tasks.filter(t => !t.is_completed).length;
  const completed = tasks.length - notCompleted;
  setNotCompletedTasksCount(notCompleted);
  setCompletedTasksCount(completed);

}, [tasks]);

useEffect(() => {
  fetchTasks();
}, []);

  return (
    <div>
      <section className="todoapp">
        {loading && <div className="loader">Loading tasks hello...</div>}
        {error && <div className="error">{error}</div>}
        <TaskAdd addTask={addTask} taskTitle={taskTitle} setTaskTitle={setTaskTitle} />
        {tasks.length > 0 && (
          <div>
            <Suspense fallback={<div>Loading tasks...</div>}>
              <TaskList
                tasks={tasks}
                completeAllTasks={completeAllTasks}
                completeTask={completeTask}
                fetchTasks={fetchTasks}
                deleteTask={deleteTask}
                next={next}
                prev={prev}
              />
              <Footer
                notCompletedTasksCount={notCompletedTasksCount}
                completedTasksCount={completedTasksCount}
                fetchTasks={fetchTasks}
                filterTasks={filterTasks}
                deleteCompletedTask={deleteCompletedTask}
                currentFilter={currentFilter}
              />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}