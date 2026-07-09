import Dashboard from "../Pages/Dashboard.jsx"

function Table(){

    const arr= [{
    d1:"Mall Build",
    d2:"Chennai" ,
    d3: "Ongoing",
    d4:"70%"
   },
   {
    d1:"Villa A",
    d2:"Coimbatore",
    d3:"Completed",
    d4:"100%"
   },
   {
    d1:"School",
    d2:"Madurai",
    d3:"Pending",
    d4:"20%"
   },
   {
    d1: "Apartment",
    d2: "Trichy",
    d3:"Ongoing",
    d4:"45%" 
   }]
   
    return(
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
            { arr.map((x,index)=>(<tr key={index}>
            <td>{x.d1}</td>
            <td>{x.d2}</td>
            <td>{x.d3}</td>
            <td>{x.d4}</td>  
            </tr>)) }
            </tbody>
        </table>
          </div>
         </div>
    );
}
export default Table