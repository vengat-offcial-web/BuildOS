
import './App.css'

import Nav from './components/Navbar'
import Side from './components/Sidebar'

function App() {
  return (
<div className='App-Container'>
    <Side/>
  <main>
    <Nav/>
  </main>
</div>
  );
}

export default App;
