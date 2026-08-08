
import './App.css'
import Dashboardcards from './components/DashboardCards';
// import Dashboard from './pages/Dashboard';
import Nav from './components/Navbar';
import Side from './components/Sidebar';
import Table from './components/Table';
import Projects from './pages/Projects';
import Workers from './pages/Workers';
import Materials from './pages/Materials';
// import Machines from './pages/Machines';
import Tasks from './pages/Tasks';
import Report from './pages/Reports';
import Settings from './pages/Settings';
import { Dashboard, Machines } from "./pages/index";



function App() {
  return (
    <div className='App-Container'>
      <Side />

      <main>
        <Nav />
        <Dashboard />
        <Dashboardcards />
        <Table />
        {/* <Projects/> */}
        {/* <Workers/> */}
        {/* <Materials/> */}
        {/* <Machines/> */}
        {/* <Tasks/> */}
        {/* <Report/> */}
        {/* <Settings/> */}

      </main>
    </div>
  );
}

export default App;