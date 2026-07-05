import "./Css/sidebar.css"
function Side(){
    return(
    <aside>
        <div className="logo">Logo Section
           <h2>ConstructionOS</h2>
        </div>
        <nav className="menu">
            <ul>
                <li>Dashbord</li> 
                <li>Projects</li>
                <li>Workers</li>
                <li>Materials</li>
                <li>Machines</li>
                <li>Tasks</li>
                <li>Reports</li>
                <li>Settings</li>
            </ul>
        </nav>
    </aside>
);
}

export default Side