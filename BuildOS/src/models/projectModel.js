import initialProjects from '../data/projects';

export class ProjectModel {
    static getAll() {
        return initialProjects;
    }

    static filterByTerm(projects, term = "") {
        if (!term.trim()) return projects;
        const lowerTerm = term.toLowerCase();
        return projects.filter(item =>
            item.ProjectName.toLowerCase().includes(lowerTerm) ||
            item.Site.toLowerCase().includes(lowerTerm)
        );
    }
}

export default ProjectModel;
