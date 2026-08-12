import { useState, useMemo } from 'react';
import MachineModel from '../models/machineModel';

export const useMachinesController = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const allMachines = useMemo(() => MachineModel.getAll(), []);
    const alerts = useMemo(() => MachineModel.getAlerts(), []);

    const filteredMachines = useMemo(() => {
        return MachineModel.filterByTerm(allMachines, searchTerm);
    }, [allMachines, searchTerm]);

    const getConditionVariant = (condition) => {
        const c = condition.toLowerCase();
        if (c.includes("running") || c.includes("good") || c.includes("excellent")) {
            return "success";
        }
        if (c.includes("maintenance") || c.includes("service")) {
            return "warning";
        }
        return "error";
    };

    const handleAddMachine = () => {
        alert("Add Machine modal trigger");
    };

    return {
        searchTerm,
        setSearchTerm,
        allMachines,
        filteredMachines,
        alerts,
        getConditionVariant,
        handleAddMachine
    };
};

export default useMachinesController;
