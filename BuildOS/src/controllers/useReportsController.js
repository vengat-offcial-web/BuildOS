import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/useData';
import ReportModel from '../models/reportModel';

export const useReportsController = () => {
    const { projects = [], workers = [], materials = [], tasks = [] } = useData() || {};
    const [searchTerm, setSearchTerm] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    // Filter projects list to ONLY include Completed projects
    const completedProjects = useMemo(() => {
        return ReportModel.getCompletedProjects(projects);
    }, [projects]);

    // Filter completed projects based on search query
    const filteredCompletedProjects = useMemo(() => {
        return ReportModel.filterCompletedProjects(completedProjects, searchTerm);
    }, [completedProjects, searchTerm]);

    // Resolve active selected completed project strictly from URL searchParams (e.g. ?projectId=4)
    const activeProjectId = searchParams.get('projectId');

    const selectedProject = useMemo(() => {
        if (!activeProjectId) return null;
        return completedProjects.find(p => String(p.id) === String(activeProjectId)) || null;
    }, [completedProjects, activeProjectId]);

    // Open detailed completed project report view by updating URL searchParams (pushes to browser history)
    const openReportModal = (project) => {
        if (project && project.id) {
            setSearchParams({ projectId: String(project.id) });
        }
    };

    // Close detailed report view by clearing URL searchParams
    const closeReportModal = () => {
        setSearchParams({});
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
        openReportModal,
        closeReportModal,
        selectedReportDetails
    };
};

export default useReportsController;
