
export default function Footer({
    notCompletedTasksCount,
    completedTasksCount,
    fetchTasks,
    filterTasks,
    deleteCompletedTask,
    currentFilter
}) {
    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{notCompletedTasksCount}</strong> item left
            </span>
            <ul className="filters">
                <li>
                    <a
                        className={currentFilter === "all" ? "selected" : ""}
                        onClick={() => fetchTasks()}
                        href="#/"
                    >
                        All
                    </a>
                </li>
                <li>
                    <a
                        className={currentFilter === "active" ? "selected" : ""}
                        href="#"
                        onClick={() => filterTasks(false)}
                    >
                        Active
                    </a>
                </li>
                <li>
                    <a
                        className={currentFilter === "completed" ? "selected" : ""}
                        href="#"
                        onClick={() => filterTasks(true)}
                    >
                        Completed
                    </a>
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