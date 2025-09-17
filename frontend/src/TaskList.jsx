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
        <input id="toggle-all" className='toggle-all' type="checkbox" onChange = {(e) => completeAllTasks(e.target.checked)}/>
        <label>Mark all as complete hello</label>
        <ul className= "todo-list" id = "task-list">
        {tasks.map(task => (
            <li key={task.id} className={task.is_completed ? "completed" : ""}>
                <div className="view">
                    <input className= "toggle" type="checkbox" onChange={(e)=>completeTask(task.id, e.target.checked)}
                    checked = {task.is_completed}/>
                    <label>{task.title }</label>
                    <button className="destroy" onClick={() => deleteTask(task.id)}></button>
                </div>
                <input className="edit"/>
            </li>
          ))}
        </ul>
        <div className="pagination">
        {prev && <a onClick={() => fetchTasks(prev)}>Previous</a>}
        {next && <a onClick={() => fetchTasks(next)}>Next</a>}
      </div>
  </main>
  );

}
