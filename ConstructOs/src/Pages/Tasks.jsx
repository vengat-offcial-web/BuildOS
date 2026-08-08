import Task from "../data/Task";
import TaskTable from "../data/TaskTable";
import "../Css/task.css";

function Tasks() {

    const task = Task.map((x, index) => (
        <div key={index} className="project-progress">

            <div className="project-header">
                <span>{x.name}</span>
                <span>{x.progress}%</span>
            </div>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${x.progress}%` }}
                ></div>
            </div>

        </div>
    ));

    return (
        <div className="task-page">

            {/* Header */}
            <div className="task-header">
                <h2>Tasks</h2>
                <p>Manage daily construction activities.</p>
            </div>

            {/* Search */}
            <div className="task-actions">
                <input type="text" placeholder="Search..." />
                <button>+ Add Task</button>
            </div>

            {/* Today's Progress */}
            <div className="progress-section">
                <h3>Today's Progress</h3>
                <p>12 / 20 Tasks Completed (60%)</p>

                <div className="summary-progress">
                    <div
                        className="summary-progress-fill"
                        style={{ width: "60%" }}
                    ></div>
                </div>
            </div>

            {/* Project Progress */}
            <div className="task-list">
                {task}
            </div>

            {/* Table */}
            <div className="task-table-box">
                <table>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Task</th>
                            <th>Project</th>
                            <th>Assigned To</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Due Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {TaskTable.map((x, index) => (

                            <tr key={index}>

                                <td>{x.id}</td>
                                <td>{x.task}</td>
                                <td>{x.project}</td>
                                <td>{x.assigned}</td>

                                <td>
                                    <span className={`priority ${x.priority.toLowerCase()}`}>
                                        {x.priority}
                                    </span>
                                </td>

                                <td>
                                    <span className={`status ${x.status.toLowerCase().replace(" ", "-")}`}>
                                        {x.status}
                                    </span>
                                </td>

                                <td>{x.date}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            </div>

        </div>
    );
}

export default Tasks;