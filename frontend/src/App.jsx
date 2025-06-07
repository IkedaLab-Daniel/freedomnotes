import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// > Components
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import BoardView from './pages/BoardView'
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
              path="/board/:id"
              element = {<BoardView/>}
            />
          </Routes>
        </div>

      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
