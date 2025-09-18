import React from 'react';

export default function TaskAdd({addTask, taskTitle, setTaskTitle}) {

return (
  <header className="header">
      <h1>todos</h1>
      <input className="new-todo" placeholder="What needs to be done?" 
      aria-label="Add a new task"
      onChange={(e) => setTaskTitle(e.target.value)} 
      onKeyDown= {(e)=> addTask(e)}
      value = {taskTitle}
      autoFocus />
  </header>
);
}
