import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext';
import { notifySuccess, notifyError } from '../hooks/useToaster';

import '../css/login.css';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassowrd] = useState('');
    const [loading, setLoading] = useState(false);

    const { dispatch } = useAuthContext()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!username){
            notifyError("Enter Username")
            setLoading(false)
            return
        }

        if (!password){
            notifyError("Enter Password")
            setLoading(false)
            return
        }
        
        const response = await fetch('http://localhost:4000/api/user/login', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({username, password})
        })

        const json = await response.json();

        if (!response.ok){
            setLoading(false);
            notifyError(json.error)
        }

        if (response.ok){
            localStorage.setItem('user', JSON.stringify(json));             
            dispatch({type: 'LOGIN', payload: json})
            notifySuccess(`Logged in as @${json.username}`);
            setUsername('');
            setPassowrd('');
        }

        setLoading(false)
    }
    
    return(
        <>
            <div id="login">
                <div className="login-form">
                    <h1>Log In</h1>
                    <form>
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                         />
                        <label htmlFor="password">Password</label>
                        <input 
                        type="Password" 
                        name="passowrd" 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassowrd(e.target.value)}
                        />
                        <button 
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            { loading ? ('Loading') : ('Log In') }
                        </button>
                        <Link to="/signup">
                            <p>Don't have an account? Sign Up</p>
                        </Link>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login