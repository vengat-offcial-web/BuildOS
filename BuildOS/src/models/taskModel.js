import initialTasks from '../data/Task';
import taskTable from '../data/TaskTable';

export class TaskModel {
    static getProjectProgress() {
        return initialTasks;
    }

    static getAllTableTasks() {
        return taskTable;
    }

    static filterTableByTerm(tasks, term = "") {
        if (!term.trim()) return tasks;
        const lowerTerm = term.toLowerCase();
        return tasks.filter(item =>
            item.task.toLowerCase().includes(lowerTerm) ||
            item.project.toLowerCase().includes(lowerTerm) ||
            item.assigned.toLowerCase().includes(lowerTerm)
        );
    }
}

export default TaskModel;
