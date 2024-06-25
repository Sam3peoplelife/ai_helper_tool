import './App.css';
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SingUp from './pages/SingUp';
import Account from './pages/Account';


function App() {
  const isUserSigned = !!localStorage.getItem('token')

  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/login" element={ <Login/> }/>
        <Route path="/signup" element={ <SingUp/> }/>
        {isUserSigned && <Route path="/account" element={ <Account/> }/>}
      </Routes>
    </div>
  );
}

export default App;
