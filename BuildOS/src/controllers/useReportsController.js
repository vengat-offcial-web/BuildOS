import { useState, useMemo } from 'react';
import { useData } from '../context/useData';
import ReportModel from '../models/reportModel';

export const useReportsController = () => {
    const { projects = [], workers = [], materials = [], tasks = [] } = useData() || {};
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter projects list to ONLY include Completed projects
    const completedProjects = useMemo(() => {
        return ReportModel.getCompletedProjects(projects);
    }, [projects]);

    // Filter completed projects based on search query
    const filteredCompletedProjects = useMemo(() => {
        return ReportModel.filterCompletedProjects(completedProjects, searchTerm);
    }, [completedProjects, searchTerm]);

    // Open detailed completed project report modal
    const openReportModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    // Close detailed report modal
    const closeReportModal = () => {
        setSelectedProject(null);
        setIsModalOpen(false);
    };

    // Computed detailed report details for the currently selected completed project
    const selectedReportDetails = useMemo(() => {
        if (!selectedProject) return null;

        const completionDays = ReportModel.calculateCompletionDays(selectedProject);
        const engineer = ReportModel.getProjectEngineer(selectedProject);
        const teamMembers = ReportModel.getWorkedTeamMembers(selectedProject, workers);
        const materialsSpent = ReportModel.getMaterialsSpent(selectedProject, materials);
        const completedTasks = ReportModel.getCompletedTasks(selectedProject, tasks);

        return {
            project: selectedProject,
            completionDays,
            engineer,
            teamMembers,
            materialsSpent,
            completedTasks
        };
    }, [selectedProject, workers, materials, tasks]);

    return {
        searchTerm,
        setSearchTerm,
        completedProjects,
        filteredCompletedProjects,
        selectedProject,
        isModalOpen,
        openReportModal,
        closeReportModal,
        selectedReportDetails
    };
};

export default useReportsController;
