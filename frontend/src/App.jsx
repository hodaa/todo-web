import React, { useState, useEffect } from 'react';
import TaskList from './TaskList.jsx';
import TaskAdd from './TaskAdd.jsx';
import Footer from './Footer';
import { BASE_URL } from './api.jsx';

export default function App() {

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [notCompletedTasksCount, setNotCompletedTasksCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("all");

  const fetchTasks = (url = BASE_URL + "/tasks") => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setTasks(data.results);
        setNext(data.next);
        setPrev(data.previous);
        setCurrentFilter("all");
      })
      .catch(err => {
        console.error("Error fetching tasks:", err);
      });
  };

  const fetchNotCompletedCount = () => {
    fetch(BASE_URL + "/tasks/count?is_completed=False")
      .then(res => res.json())
      .then(data => setNotCompletedTasksCount(data.count))
      .catch(err => {
        console.error("Error fetching not-completed count:", err);
      });
  };

  const fetchCompletedCount = () => {
    fetch(BASE_URL + "/tasks/count?is_completed=True")
      .then(res => res.json())
      .then(data => setCompletedTasksCount(data.count))
      .catch(err => {
        console.error("Error fetching completed count:", err);
      });
  };

  const deleteTask = async(taskId) => { 

    const response = await fetch(BASE_URL + '/tasks/'+taskId, {
      method: 'DELETE',
    });
    console.log(response); 
    setTasks(tasks.filter(task => task.id !== taskId)); 
    fetchCompletedCount(), fetchNotCompletedCount()
  }

  const completeTask = async(taskId, isCompleted) => { 

    const response = await fetch(BASE_URL + '/tasks/'+taskId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({is_completed: isCompleted}),
    });
    if (response.ok) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, is_completed: isCompleted } : task
        )
      );
      fetchCompletedCount(), fetchNotCompletedCount()
    }
  }

  const addTask = async (e) => {
    const taskTitle = e.target.value;
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

       setTasks((prevTasks) => [...prevTasks, data]);
       fetchNotCompletedCount();
       setTaskTitle ('')

     } catch (err) {
       console.error(err);
     }
   };
 }

  const completeAllTasks = async(isCompleted) => { 
    const response = await fetch(BASE_URL + '/tasks/complete-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({is_completed: isCompleted}),
    });
    if (response.ok) {
      setTasks((prevTasks) =>
        prevTasks.map(task => ({ ...task, is_completed: isCompleted } )
      ));
      fetchCompletedCount(), fetchNotCompletedCount()
    }
  }

  const deleteCompletedTask = async () => {
    const response = await fetch(BASE_URL + '/tasks/completed', {
      method: 'DELETE',
    });
    if (response.ok) {
      setTasks(tasks.filter(task => !task.is_completed));
    }
  };
  

  const filterTasks = (is_completed) => {
    const url = `${BASE_URL}/tasks?is_completed=${is_completed}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const results = Array.isArray(data) ? data : data.results;
        setTasks(results || []);
        setNext((data && data.next) || null);
        setPrev((data && data.previous) || null);
        setCurrentFilter(is_completed ? "completed" : "active");
      })
      .catch(err => {
        console.error("Error fetching tasks:", err);
      });
  };

  
  useEffect(() => {
    fetchTasks();
    fetchNotCompletedCount();
    fetchCompletedCount();

  }, []);

  return (
    <div>
      <section className="todoapp">
        <TaskAdd  addTask={addTask} taskTitle={taskTitle}  setTaskTitle = {setTaskTitle}/>
        {tasks.length > 0 && (
          <todo-app>
            <TaskList
              tasks={tasks}
              completeAllTasks ={completeAllTasks}
              completeTask = {completeTask}
              fetchTasks={fetchTasks}
              deleteTask = {deleteTask}
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

          </todo-app>
        )}
      </section>
    </div>
  );
}