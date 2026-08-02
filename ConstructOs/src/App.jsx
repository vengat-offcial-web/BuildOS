
import './App.css'
import Dashboardcards from './components/DashboardCards';
import Dashboard from './Pages/Dashboard';
import Nav from './components/Navbar';
import Side from './components/Sidebar';
import Table from './components/Table';
import Projects from './Pages/Projects';
import Workers from './Pages/Workers';
import Materials from './Pages/Materials';
import Machines from './Pages/Machines';
import Tasks from './Pages/Tasks';
import Report from './Pages/Reports';
import Settings from './Pages/Settings';



function App() {
  return (
<div className='App-Container'>
    <Side/>
    
  <main>
    {/* <Nav/>
    <Dashboard/> 
    <Dashboardcards/>
    <Table/>  */}
    {/* <Projects/> */}
    {/* <Workers/> */}
    {/* <Materials/> */}
    {/* <Machines/> */}
    {/* <Tasks/> */}
     {/* <Report/> */}
     <Settings/>
     
   </main>
</div>
  );
}

export default App;
