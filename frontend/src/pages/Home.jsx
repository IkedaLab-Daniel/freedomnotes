import { useAuthContext } from "../hooks/useAuthContext"
import Boards from "../components/Boards"
const Home = () => {

    const { user, dispatch } = useAuthContext()
    
    const handleLogout = () => {
        localStorage.removeItem('user')
        dispatch( {type: 'LOGOUT'} )
    }

    return(
        <>
            <Boards />
        </>
    )
}

export default Home