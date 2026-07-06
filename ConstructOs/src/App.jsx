
import './App.css'
import Dashboardcards from './components/DashboardCards';
import Dashboard from './Pages/Dashboard';
import Nav from './components/Navbar'
import Side from './components/Sidebar'
function App() {
  return (
<div className='App-Container'>
    <Side/>
    
  <main>
    <Nav/>
    <Dashboard/>
    <Dashboardcards/>
  </main>
</div>
  );
}

export default App;
