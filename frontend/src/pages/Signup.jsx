import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext';
import { notifyError, notifySuccess } from '../hooks/useToaster';
import '../css/signup.css';

const Signup = () => {

    const [username, setUsername] = useState('');
    const [password, setPassowrd] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { dispatch } = useAuthContext()
    const apiURL = import.meta.env.VITE_API_URL;


    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!username || !password || !confirmPassword){
            notifyError("All fields must be filled!")
            setLoading(false)
            return
        }

        if (password !== confirmPassword){
            notifyError("Confirm Password does not match")
            setLoading(false)
            setConfirmPassword('')
            return
        }

        try{
            const response = await fetch(`${apiURL}/api/user/signup`, {
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
                notifySuccess(`Welcome, @${json.username}`);
                setUsername('');
                setPassowrd('');
            }

            setLoading(false)
        } catch(error){
            notifyError("Opps! Server is offline")
        }
        
        setLoading(false);
    }
    
    return(
        <>
            <div id="signup">
                <div className="signup-form">
                    <h1>Sign Up</h1>
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
                        <label htmlFor="confirm password">Confirm Password</label>
                        <input 
                        type="Password" 
                        name="confirm passowrd" 
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button 
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            { loading ? ('Loading...') : ('Sign Up') }
                        </button>
                        <Link to="/login">
                            <p>Already have an account? Log In</p>
                        </Link>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Signup