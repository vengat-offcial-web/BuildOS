import DashboardCard from "./DashboardCard.jsx";

function Dashboardcards(){
   
    const array = [{
        title : "Total Projects",
        value : "12"
    },
    {
        title : "Workers",
        value : "150"
    },
    {
        title : "Materials",
        value : "45"
    },
    {
        title : "Pending Tasks",
        value : "15"
    }]
    const s = array.map((x,index)=>(<DashboardCard 
        key = {index} 
        title = {x.title}
        value = {x.value} />))
    return(
    <div className="dashboard-cards">
        {s}
    </div>
);
}
export default Dashboardcards;