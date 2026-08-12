import initialMaterials from '../data/materials';

export class MaterialModel {
    static getAll() {
        return initialMaterials;
    }

    static filterByTerm(materials, term = "") {
        if (!term.trim()) return materials;
        const lowerTerm = term.toLowerCase();
        return materials.filter(item =>
            item.Material.toLowerCase().includes(lowerTerm) ||
            item.Category.toLowerCase().includes(lowerTerm) ||
            item.Supplier.toLowerCase().includes(lowerTerm)
        );
    }
}

export default MaterialModel;
