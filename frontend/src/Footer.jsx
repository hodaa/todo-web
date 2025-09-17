import { BASE_URL } from "./api.jsx";

export default function Footer({notCompletedTasksCount, completedTasksCount , fetchTasks , filterTasks , deleteCompletedTask }) {
    

    return (
    <footer className="footer">
        <span className="todo-count">
            <strong>{notCompletedTasksCount}</strong> item left
        </span>
        <ul className="filters">
            <li>
                <a className="selected"  onClick={() => fetchTasks()} href="#/">All</a>
            </li>
            <li>
                <a href="#" onClick={() => filterTasks(false)}>Active</a>
            </li>
            <li>
                <a href="#" onClick={() => filterTasks(true)}>Completed</a>
            </li>
        </ul>
        {completedTasksCount > 0 && (
        <button className="clear-completed" onClick={() => deleteCompletedTask()}>
            Clear completed
        </button>
        )}
    </footer>
    );
}