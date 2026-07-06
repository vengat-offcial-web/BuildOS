import '../Css/dashboardcard.css'
function DashboardCard({
    title = "Dummy",
    value = "00"
}){
    return(
        <div className="d-card">
        <h2>{title}</h2>
        <h2>{value}</h2>
        </div>
    );
}
export default DashboardCard;