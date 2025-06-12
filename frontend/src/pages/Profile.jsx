import { useAuthContext } from "../hooks/useAuthContext"
import NotLoggedIn from "../components/NotLoggedIn";
import ProfileInfo from "../components/ProfileInfo";

const Profile = () => {
    const { user } = useAuthContext();

    if (!user?.username) {
        return <NotLoggedIn />;
    } else{
        return <ProfileInfo user={ user } />
    }

    

}

export default Profile