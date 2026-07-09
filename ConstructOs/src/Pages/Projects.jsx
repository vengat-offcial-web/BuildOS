import obj from"../Data/projects"
import '../Css/project.css'
function Projects(){
    
    return(
            <div className="projects">
                <h2>Projects</h2>
                <p>Track project progress and manage daily activities.</p>
            <div className="project-top">
                <input type="search" name="search" id="" placeholder="Search..." />
                <button>Add Project</button>
            </div>
            <div className="table-box">
            <table>
                <thead><tr>
                    <th>Project Name</th>
                    <th>Site</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Action</th>
                </tr></thead>
                <tbody>{obj.map((x,index)=>(<tr key={index}>
                    <td>{x.ProjectName}</td>
                    <td>{x.Site}</td>
                    <td>
                    <span className={`status ${x.Status.toLowerCase()}`}>
                        {x.Status}
                     </span>
                    </td>
                    <td>
                    <div className="progress-bar">
                        <div
                        className="progress-fill"
                        style={{ width: `${x.Progress}%` }}>
                        </div>
                     </div>
                    <span>{x.Progress}%</span></td>
                    <td>{x.Action}</td>
                    </tr>
                   ))}
              </tbody>
            </table>
            </div>
        </div>
    ); 
}
export default Projects;