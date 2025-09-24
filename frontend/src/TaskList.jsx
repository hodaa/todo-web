import React from 'react';


export default function TaskList({
  tasks,
  completeAllTasks,
  completeTask ,
  fetchTasks,
  deleteTask ,
  next,
  prev
 }) {
  
  return (
    
    <main className="main">
      <input
        id="toggle-all"
        className='toggle-all'
        type="checkbox"
        aria-label="Mark all tasks as complete"
        onChange={(e) => completeAllTasks(e.target.checked)}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list" id="task-list" role="list">
        {tasks.map(task => (
          <li key={task.id} className={task.is_completed ? "completed" : ""} role="listitem">
            <div className="view">
              <input
                className="toggle"
                type="checkbox"
                aria-label={task.is_completed ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
                onChange={(e) => completeTask(task.id, e.target.checked)}
                checked={task.is_completed}
              />
              <label>{task.title}</label>
              <button
                className="destroy"
                aria-label={`Delete ${task.title}`}
                onClick={() => deleteTask(task.id)}
              ></button>
            </div>
            <input className="edit" aria-label={`Edit ${task.title}`} />
          </li>
        ))}
      </ul>
      <div className="pagination">
        {prev && <a href="#prev" onClick={() => fetchTasks(prev)} aria-label="Previous page">Previous</a>}
        {next && <a href="#next" onClick={() => fetchTasks(next)} aria-label="Next page">Next</a>}
      </div>
    </main>
  );

}
