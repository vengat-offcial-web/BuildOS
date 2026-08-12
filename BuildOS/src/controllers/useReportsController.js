import { useState, useMemo } from 'react';
import ReportModel from '../models/reportModel';

export const useReportsController = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const allReports = useMemo(() => ReportModel.getAll(), []);

    const filteredReports = useMemo(() => {
        return ReportModel.filterByTerm(allReports, searchTerm);
    }, [allReports, searchTerm]);

    const getStatusVariant = (status) => {
        const s = status.toLowerCase();
        if (s.includes("completed") || s.includes("approved")) return "success";
        if (s.includes("pending") || s.includes("review")) return "warning";
        return "info";
    };

    const handleGenerateReport = () => {
        alert("Generate Report modal trigger");
    };

    return {
        searchTerm,
        setSearchTerm,
        allReports,
        filteredReports,
        getStatusVariant,
        handleGenerateReport
    };
};

export default useReportsController;
