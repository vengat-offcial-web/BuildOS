import obj3 from '../Data/materials'
import DashboardCard from '../components/DashboardCard';
import '../Css/materials.css'
function Materials(){
    return(
    <div className='materials'>
        <div className='materials-header'>
            <h2>Materials</h2>
            <p>Manage all construction materials efficiently</p>
        </div>
         <div className='material-top'>
            <input type="text" placeholder="Search..."/>
            <button>Add Material</button>
         </div>
         <div className='material-cards'>
            <DashboardCard title="Total Materials" value="45"/>
            <DashboardCard title="Low Stock" value="8"/>
            <DashboardCard title="Out of Stock" value="3"/>
            <DashboardCard title="Suppliers" value="12"/>
        </div>
        <div className='material-table-box'>
            <table>
                <thead>
                    <tr>
                    <th>Material</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Unit</th>
                    <th>Supplier</th>
                    <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {obj3.map((x,index)=>(
                        <tr>
                               <td>{x.Material}</td>
                               <td>{x.Category}</td>
                               <td>{x.Stock}</td>
                               <td>{x.Unit}</td>
                               <td>{x.Supplier}</td>
                               <td>
                                <span className={`status ${x.Status.toLowerCase().replace(" ","-")}`}>
                                    {x.Status}
                                </span>
                               </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
    </div>
    
    );
}
export default Materials;