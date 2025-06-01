import { useAuthContext } from "../hooks/useAuthContext"

const Home = () => {

    const { user, dispatch } = useAuthContext()
    
    const handleLogout = () => {
        localStorage.removeItem('user')
        dispatch( {type: 'LOGOUT'} )
    }

    return(
        <>
            {user && <button onClick={handleLogout}>Log Out</button>}
        </>
    )
}

export default Home