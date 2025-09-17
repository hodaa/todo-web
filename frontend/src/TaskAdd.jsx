import React, {useState} from 'react';
import { BASE_URL } from "./api.jsx";


export default function TaskAdd({addTask}) {
     const [taskTitle, setTaskTitle] = useState('');

return (
  <header className="header">
      <h1>todos</h1>
      <input className="new-todo" placeholder="What needs to be done?" 
      onChange={(e) => setTaskTitle(e.target.value)} 
      onKeyDown= { addTask(e.target.value)}
      value={taskTitle}
      autoFocus />
  </header>
);
}
