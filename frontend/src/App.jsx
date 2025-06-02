import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// > Components
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import NavBar from './components/NavBar'
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
              element = {!user ? <Login/> : <Navigate to="/" />}
            />
            <Route
              path='/signup'
              element = {!user ? <Signup/> : <Navigate to="/" />}
            />
          </Routes>
        </div>

      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
