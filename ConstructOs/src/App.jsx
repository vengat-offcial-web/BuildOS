
import './App.css'
import Dashboardcards from './components/DashboardCards';
import Dashboard from './Pages/Dashboard';
import Nav from './components/Navbar';
import Side from './components/Sidebar';
import Table from './components/Table';
import Projects from './Pages/Projects';


function App() {
  return (
<div className='App-Container'>
    <Side/>
    
  <main>
   {/* <Nav/>
    <Dashboard/> 
    <Dashboardcards/>
    <Table/> */}
    <Projects/>
  </main>
</div>
  );
}

export default App;
