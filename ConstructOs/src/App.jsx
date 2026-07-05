
import './App.css'
import Nav from './Navbar'
import Side from './Sidebar'

function App() {
  return (
<div className='App-Container'>
    <Side/>
    <Login/>
  <main>
    <Nav/>
  </main>
</div>
  )
}

export default App;
