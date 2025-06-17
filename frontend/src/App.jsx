import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// > Components
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import BoardView from './pages/BoardView'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

import { useAuthContext } from './hooks/useAuthContext'
import { Toaster } from 'react-hot-toast'// > Stylesheet
import './App.css'

function App() {

  const { user } = useAuthContext()

  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <div className="pages">
          <Routes>
            <Route
              path='/'
              element = {<Home/>}
            />
            <Route
              path='/login'
              element = {!user.username ? <Login/> : <Navigate to="/" />}
            />
            <Route
              path='/signup'
              element = {!user.username ? <Signup/> : <Navigate to="/" />}
            />
            <Route 
              path="/board/:board_id"
              element = {<BoardView/>}
            />
            <Route
              path='/profile'
              element = {<Profile/>}
            />
            <Route
              path='/admin'
              element = {<Admin/>}
            />
          </Routes>
        </div>

      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
