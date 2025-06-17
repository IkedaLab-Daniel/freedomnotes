import { useAuthContext } from '../hooks/useAuthContext'
import { notifySuccess } from '../hooks/useToaster';
import { Link } from 'react-router-dom';
import '../css/footer.css'

const Footer = () => {

    const { user, dispatch } = useAuthContext();

    const handleLogout = async () => {
        localStorage.removeItem('user');
        dispatch( { type: 'LOGOUT'} )
        notifySuccess( 'Logged Out ')
    }

    return(
        <>  
            <footer>
                <div className="left">
                    <p>&copy; dev.iceice</p>
                </div>                
                <div className="right">
                    <Link to="/">
                        <p>Home</p>
                    </Link>
                    <Link to="/profile">
                        <p>Profile</p>
                    </Link>
                    {user.username && (<p className='logout' onClick={handleLogout}>Logout</p>)}
                    {!user.username && (
                        <Link to="/login">
                            <p>Log In</p>
                        </Link>
                    )}
                    {!user.username && (
                        <Link to="/signup">
                            <p>Sign Up</p>
                        </Link>
                    )}
                </div>
            </footer>
        </>
    )
}

export default Footer