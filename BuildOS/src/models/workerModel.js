import initialWorkers from '../data/workers';

export class WorkerModel {
    static getAll() {
        return initialWorkers;
    }

    static filterByTerm(workers, term = "") {
        if (!term.trim()) return workers;
        const lowerTerm = term.toLowerCase();
        return workers.filter(item =>
            item.Name.toLowerCase().includes(lowerTerm) ||
            item.Role.toLowerCase().includes(lowerTerm) ||
            item.Site.toLowerCase().includes(lowerTerm)
        );
    }
}

export default WorkerModel;
