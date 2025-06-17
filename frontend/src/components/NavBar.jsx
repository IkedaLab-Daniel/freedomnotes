import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { toast } from  'react-hot-toast'
import { Link } from 'react-router-dom'

// images
import noteSVG from '../assets/note-fav.svg'
import userwhiteSVG from '../assets/user-white.svg'
import adminSVG from '../assets/admin.svg'
import '../css/navbar.css'

const NavBar = () => {

    const { user , dispatch } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    
    // > toastah
    const notifySuccess = (message) => {
        toast.success(message, {
                duration: 4000,
                style: {
                    border: "1px solid #4caf50", 
                    padding: "10px 20px", 
                    fontSize: "1.2rem", 
                  },
        });
    }

    const notifyError = (message) => {
        toast.error(message, {
                duration: 4000,
                style: {
                    border: "1px solidrgb(175, 76, 76)", 
                    padding: "10px 20px", 
                    fontSize: "1.2rem", 
                  },
        });
    }

    const handleLogout = () => {
        setIsLoading(true);
        localStorage.removeItem('user');
        dispatch( { type: 'LOGOUT' } );
        setIsLoading(false);
        notifySuccess('Logged Out');        
    }

    return(
        <>
            <div id="navbar">
                <div className="logo-container">
                    <Link to="/">
                        <img src={noteSVG} alt="" />
                        <h1>FreedomNotes.js</h1>
                    </Link>
                    
                </div>

                <div className="links-container">
                    <Link to="/" className='hide-on-mobile'>Home</Link>
                    <Link to="/profile" className='hide-on-mobile'>Profile</Link>
                    <Link to="/admin" className='hide-on-mobile'>Admin</Link>
                    <Link to="/profile" className='show-on-mobile'>
                        {user.username && (<p>@{user.username}</p>)}
                        <img src={userwhiteSVG} alt="" />
                    </Link>
                </div>

                <div className="user-buttons-container">
                    { user.username &&
                    <>
                        <Link to="/profile">
                            <span>@{user.username}</span>
                        </Link>
                        <button onClick={handleLogout} className='logout'>Log Out</button>
                    </>}

                    { !user.username &&
                    <>
                        <Link to="login">
                            <button className='login'>Log In</button>
                        </Link>

                        <Link to="signup">
                            <button className='signup'>Sign Up</button>
                        </Link>
                    </>}
                </div>
            </div>
            <Link to="/admin">
                <div className="admin-btn">
                    <img src={adminSVG} alt="" />
                    <p>Admin</p>
                </div>
            </Link>
            
        </>
    )
}

export default NavBar