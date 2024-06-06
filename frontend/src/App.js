import {BrowserRouter as Router, Routes,Route} from 
'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import Header from './components/Header';
import Dashboard from  './pages/Dashboard';
import Login from './pages/Login'
import Register from './pages/Register'
import CreateCourse from './pages/CreateCourse';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


function App() {
  return (
    <>
    <Router>
    <div className='container'>
      <Header/>
      <Routes>
        <Route path='/Dashboard' element={<Dashboard/>} />
        <Route path='/' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/createCourse' element={<CreateCourse/>} />

      </Routes>
    </div> 
    </Router>
    <ToastContainer/>
    </>
  );
}

export default App;
