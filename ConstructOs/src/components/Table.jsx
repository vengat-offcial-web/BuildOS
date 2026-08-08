import Dashboard from "../pages/Dashboard.jsx"
import "../Css/table.css"
function Table() {

  const projects = [
    {
      project: "Mall Build",
      site: "Chennai",
      status: "Ongoing",
      progress: "80%"
    },
    {
      project: "Hospital",
      site: "Madurai",
      status: "Completed",
      progress: "100%"
    },
    {
      project: "Bridge",
      site: "Coimbatore",
      status: "Ongoing",
      progress: "65%"
    },
    {
      project: "Apartment",
      site: "Trichy",
      status: "Pending",
      progress: "35%"
    },
    {
      project: "School",
      site: "Salem",
      status: "Completed",
      progress: "100%"
    },
    {
      project: "IT Park",
      site: "Chennai",
      status: "Ongoing",
      progress: "72%"
    },
    {
      project: "Shopping Complex",
      site: "Erode",
      status: "Pending",
      progress: "28%"
    },
    {
      project: "Factory",
      site: "Hosur",
      status: "Ongoing",
      progress: "55%"
    },
    {
      project: "Office Tower",
      site: "Bangalore",
      status: "Completed",
      progress: "100%"
    },
    {
      project: "Metro Station",
      site: "Chennai",
      status: "Ongoing",
      progress: "61%"
    }
  ];

  return (
    <div className="table-container">

      <h2 className="table-title">Recent Projects</h2>

      <div className="table-box">
        <table>

          <thead><tr>
            <th>Project Name</th>
            <th>Site</th>
            <th>Status</th>
            <th>Progress</th>
          </tr></thead>

          <tbody>
            {projects.map((x, index) => (
              <tr key={index}>
                <td>{x.project}</td>
                <td>{x.site}</td>

                <td>
                  <span className={`status ${x.status.toLowerCase()}`}>
                    {x.status}
                  </span>
                </td>

                <td>{x.progress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Table;