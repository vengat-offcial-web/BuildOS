import { useState, useMemo } from 'react';
import MaterialModel from '../models/materialModel';

export const useMaterialsController = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const allMaterials = useMemo(() => MaterialModel.getAll(), []);

    const filteredMaterials = useMemo(() => {
        return MaterialModel.filterByTerm(allMaterials, searchTerm);
    }, [allMaterials, searchTerm]);

    const getStatusVariant = (status) => {
        const s = status.toLowerCase();
        if (s.includes("available") || s.includes("in stock") || s.includes("good")) {
            return "success";
        }
        if (s.includes("low")) {
            return "warning";
        }
        return "error";
    };

    const handleAddMaterial = () => {
        alert("Add Material modal trigger");
    };

    return {
        searchTerm,
        setSearchTerm,
        allMaterials,
        filteredMaterials,
        getStatusVariant,
        handleAddMaterial
    };
};

export default useMaterialsController;
