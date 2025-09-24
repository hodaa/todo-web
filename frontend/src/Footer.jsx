
export default function Footer({
    notCompletedTasksCount,
    completedTasksCount,
    fetchTasks,
    filterTasks,
    deleteCompletedTask,
    currentFilter
}) {
    return (
        <footer className="footer" aria-label="Footer">
            <span className="todo-count" aria-live="polite">
                <strong>{notCompletedTasksCount}</strong> item{notCompletedTasksCount !== 1 && 's'} left
            </span>
            <ul className="filters" role="navigation" aria-label="Task filters">
                <li>
                    <a
                        className={currentFilter === "all" ? "selected" : ""}
                        onClick={() => fetchTasks()}
                        href="#/"
                        aria-current={currentFilter === "all" ? "page" : undefined}
                    >
                        All
                    </a>
                </li>
                <li>
                    <a
                        className={currentFilter === "active" ? "selected" : ""}
                        href="#"
                        onClick={() => filterTasks(false)}
                        aria-current={currentFilter === "active" ? "page" : undefined}
                    >
                        Active
                    </a>
                </li>
                <li>
                    <a
                        className={currentFilter === "completed" ? "selected" : ""}
                        href="#"
                        onClick={() => filterTasks(true)}
                        aria-current={currentFilter === "completed" ? "page" : undefined}
                    >
                        Completed
                    </a>
                </li>
            </ul>
            {completedTasksCount > 0 && (
                <button className="clear-completed" onClick={() => deleteCompletedTask()} aria-label="Clear completed tasks">
                    Clear completed
                </button>
            )}
        </footer>
    );
}