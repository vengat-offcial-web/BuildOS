import obj2 from "../data/workers";
import DashboardCard from "../components/DashboardCard";
import '../Css/workers.css'
import { useState } from "react";
function Workers(){
       const [name,setName] = useState("");
       const filtered = obj2.filter((n)=>(n.Name.toLowerCase().includes(name.toLowerCase())))
       const display = filtered.map((x,index)=>(<tr key={index}>
        <td>{x.Name}</td>
        <td>{x.Role}</td>
        <td>{x.Site}</td>
        <td>{x.Phone}</td>
        <td><span className={`status ${x.Status.toLowerCase()}`}>
                {x.Status}
            </span></td>
        <td>{x.Action}</td>
        </tr>))
    return(
      <div className="workers">
        <div className="workers-headers">
             <h2>Workers</h2>
             <p>Manage all construction workers efficiently.</p>
        </div>
         <div className="worker-top">
          
            <input type="text" placeholder="Search..." onChange={(e)=>setName(e.target.value)}/>
            <button>Add Worker</button>
        </div>
        <div className="worker-cards">
            <DashboardCard title="Total Workers" value="15"/>
            <DashboardCard title="Active Workers" value="10"/>
            <DashboardCard title="On Leave" value="3"/>
            <DashboardCard title="Inactive" value="2"/>
        </div>
       
        <div className="worker-table-box">
            <table>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Site</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                  {display}
                </tbody>
            </table>
        </div>
    </div>
    );
}
export default Workers;