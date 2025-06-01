import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// > Components
import Login from './pages/Login'
import Signup from './pages/Signup'
import { Toaster } from 'react-hot-toast'// > Stylesheet
import './App.css'

function App() {

  return (
    <>
      <BrowserRouter>
        {/* ? Nav bar here */}
        <div className="pages">
          <Routes>
            <Route
              path='/login'
              element = {<Login/>}
            />
            <Route
              path='/signup'
              element = {<Signup/>}
            />
          </Routes>
        </div>

      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
