import { useState, useMemo } from 'react';
import TaskModel from '../models/taskModel';

export const useTasksController = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const projectProgress = useMemo(() => TaskModel.getProjectProgress(), []);
    const allTableTasks = useMemo(() => TaskModel.getAllTableTasks(), []);

    const filteredTasks = useMemo(() => {
        return TaskModel.filterTableByTerm(allTableTasks, searchTerm);
    }, [allTableTasks, searchTerm]);

    const getPriorityVariant = (priority) => {
        const p = priority.toLowerCase();
        if (p === "high") return "error";
        if (p === "medium") return "warning";
        return "success";
    };

    const getTaskStatusVariant = (status) => {
        const s = status.toLowerCase();
        if (s.includes("completed") || s.includes("done")) return "success";
        if (s.includes("progress") || s.includes("working")) return "info";
        return "neutral";
    };

    const handleAddTask = () => {
        alert("Add Task modal trigger");
    };

    return {
        searchTerm,
        setSearchTerm,
        projectProgress,
        allTableTasks,
        filteredTasks,
        getPriorityVariant,
        getTaskStatusVariant,
        handleAddTask
    };
};

export default useTasksController;
