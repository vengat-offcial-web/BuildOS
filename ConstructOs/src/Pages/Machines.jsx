// import obj4 from '../Data/machines'
import '../Css/machines.css'
import DashboardCard from '../components/DashboardCard';
import  obj4 from "../data/machines"
import alert from "../data/machineAlert"
function Machines(){
    const arr = alert.map((x,index)=><p key={index}>
        {x.Alert1}
        {x.Alert2}
        {x.Alert3}
    </p>)
    return(
    <div className='machines'>
        <div className='machines-header'>
            <h2>Machines</h2>
            <p>Monitor and manage all construction equipment.</p>
        </div>
        <div className='machine-top'>
           <input type="text" placeholder='Search...' />
           <button>+ Add Machine</button>
       </div>
       <div className='machine-cards'>
         <DashboardCard title="Running" value = "12"/>
         <DashboardCard title="Maintenance" value = "4"/>
         <DashboardCard title="Fuel Due" value ="2"/>
         <DashboardCard title="Total Machines"  value= "18"/>
       </div>
       <div className='alert-box'>
          <h2>Today's Machine Alerts</h2>
          {arr}
       </div>
       <div className='machine-table-box'>
       <table>
        <thead>
          <tr>
            <th>Machine Name</th>
            <th>Type</th>
            <th>Site</th>
            <th>Operator</th>
            <th>Condition</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
            {obj4.map((x,index)=><tr key={index}>
                <td>{x.MachineName}</td>
                <td>{x.Type}</td>
                <td>{x.Site}</td>
                <td>{x.Operator}</td>
                <td><span className={`condition ${x.Condition.toLowerCase().replace(" ","-")}`}>
                    {x.Condition}
                    </span></td>
                <td>{x.Action}</td>
            </tr>
            )}
        </tbody>
       </table>
       </div>
    </div>
    );
}
export default Machines;