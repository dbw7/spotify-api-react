import './App.css'
import { Route, Routes } from 'react-router-dom';
import AuthContext from './context/auth-context';
import Login from './pages/Login/Login';
import { useContext } from 'react';

function App() {

  const authCtx = useContext(AuthContext);

  return (
    <div className="App">
        <Routes>
          <Route path='/' element={authCtx.isLoggedIn ? <h1>You are logged in</h1> : <h1>You are not logged in</h1>} />
          <Route path='/login' element={<Login></Login>} />
        </Routes>
    </div>
  )
}

export default App
