import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast';
import '../css/login.css';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassowrd] = useState('');
    const [loading, setLoading] = useState(false);

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
            console.log("Success: ");
            notifySuccess(json.success)
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