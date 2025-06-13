import { useAuthContext } from "../hooks/useAuthContext"
import NotLoggedIn from "../components/NotLoggedIn";
import ProfileInfo from "../components/ProfileInfo";
import Footer from "../components/Footer.jsx"

const Profile = () => {
    const { user } = useAuthContext();

    if (!user?.username) {
        return (
            <>
                <NotLoggedIn/>
                <Footer/>
            </>
        );
    } else{
        return (
            <>
                <ProfileInfo user={ user } />
                <Footer />
            </>
        )
    }
}

export default Profile