import initialReports from '../data/report';

export class ReportModel {
    static getAll() {
        return initialReports;
    }

    static filterByTerm(reports, term = "") {
        if (!term.trim()) return reports;
        const lowerTerm = term.toLowerCase();
        return reports.filter(item =>
            item.Project.toLowerCase().includes(lowerTerm) ||
            item.Type.toLowerCase().includes(lowerTerm) ||
            item.GeneratedBy.toLowerCase().includes(lowerTerm) ||
            item.ReportID.toLowerCase().includes(lowerTerm)
        );
    }
}

export default ReportModel;
