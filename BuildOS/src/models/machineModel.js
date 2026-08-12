import initialMachines from '../data/machines';
import machineAlerts from '../data/machineAlert';

export class MachineModel {
    static getAll() {
        return initialMachines;
    }

    static getAlerts() {
        return machineAlerts;
    }

    static filterByTerm(machines, term = "") {
        if (!term.trim()) return machines;
        const lowerTerm = term.toLowerCase();
        return machines.filter(item =>
            item.MachineName.toLowerCase().includes(lowerTerm) ||
            item.Type.toLowerCase().includes(lowerTerm) ||
            item.Site.toLowerCase().includes(lowerTerm) ||
            item.Operator.toLowerCase().includes(lowerTerm)
        );
    }
}

export default MachineModel;
