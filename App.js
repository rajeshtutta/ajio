
import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'

import Signup from './Components/Signup';
import Home from './Components/Home';
import Login from './Components/Login';
import Women from './Components/Women';
import Men from './Components/Men';
import About from './Components/About';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Signup/>}></Route>
      <Route path="/Login" element={<Login/>}></Route>
        <Route path="/About" element={<About/>}></Route>
        <Route path="/Home" element={<Home/>}></Route>
        <Route path="/Women" element={<Women/>}></Route>
        <Route path="/Men" element={<Men/>}></Route>
       

      </Routes>
      
    </BrowserRouter>
      
     
    </div>
  );
}

export default App;
