import { Link } from 'react-router-dom'
import '../css/notloggedin.css'

const NotLoggedIn = () => {

    return(
        <>
            <div id="notloggedin">
                <div className="modal">
                    <h1>User not Logged In</h1>
                    <div className="btn-container-notloggedin">
                         <Link to = "/login">
                            <button className='login'>Log In</button>
                         </Link>
                        <Link to = "/signup">
                            <button className='signup'>Sign Up</button>
                        </Link>
                        <Link to = "/">
                            <button className='home'>{`< Home`}</button>
                        </Link>
                    </div>
                </div>
            </div>
           
        </>
    )
}

export default NotLoggedIn