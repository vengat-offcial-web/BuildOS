import { useState, useMemo } from 'react';
import ProjectModel from '../models/projectModel';

export const useProjectsController = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const allProjects = useMemo(() => ProjectModel.getAll(), []);

    const filteredProjects = useMemo(() => {
        return ProjectModel.filterByTerm(allProjects, searchTerm);
    }, [allProjects, searchTerm]);

    const getStatusVariant = (status) => {
        const s = status.toLowerCase();
        if (s.includes("track") || s.includes("completed") || s.includes("on track")) {
            return "success";
        }
        if (s.includes("delayed") || s.includes("risk")) {
            return "warning";
        }
        return "info";
    };

    const handleAddProject = () => {
        alert("Add Project modal trigger");
    };

    return {
        searchTerm,
        setSearchTerm,
        allProjects,
        filteredProjects,
        getStatusVariant,
        handleAddProject
    };
};

export default useProjectsController;
