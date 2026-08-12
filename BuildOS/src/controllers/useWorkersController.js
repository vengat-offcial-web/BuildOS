import { useState, useMemo } from 'react';
import WorkerModel from '../models/workerModel';

export const useWorkersController = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const allWorkers = useMemo(() => WorkerModel.getAll(), []);

    const filteredWorkers = useMemo(() => {
        return WorkerModel.filterByTerm(allWorkers, searchTerm);
    }, [allWorkers, searchTerm]);

    const getStatusVariant = (status) => {
        const s = status.toLowerCase();
        if (s.includes("active") || s.includes("present")) {
            return "success";
        }
        if (s.includes("leave")) {
            return "warning";
        }
        return "error";
    };

    const handleAddWorker = () => {
        alert("Add Worker modal trigger");
    };

    return {
        searchTerm,
        setSearchTerm,
        allWorkers,
        filteredWorkers,
        getStatusVariant,
        handleAddWorker
    };
};

export default useWorkersController;
