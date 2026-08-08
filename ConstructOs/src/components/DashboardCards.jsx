import DashboardCard from "./DashboardCard.jsx";

function Dashboardcards(){
   
const dashboardCards = [
  {
    title: "Total Projects",
    value: "24"
  },
  {
    title: "Active Workers",
    value: "368"
  },
  {
    title: "Materials Available",
    value: "1,245"
  },
  {
    title: "Pending Tasks",
    value: "32"
  }
];
    const s = dashboardCards.map((x,index)=>(<DashboardCard 
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