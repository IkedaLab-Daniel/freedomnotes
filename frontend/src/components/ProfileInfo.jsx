import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../css/profileinfo.css';

const ProfileInfo = ({ user }) => {

    const [ backButton, setBackButton ] = useState("< Back")

    return(
        <>
            <section id="profile-info">
                <h1 className="username">@{user.username}</h1>
                <Link to="/">
                    <span
                        className='back'
                        onMouseOver={() => {
                            setBackButton("< Home")
                            console.log("Hello!")
                        }}
                        onMouseLeave={() => setBackButton("< Back")}
                    >
                        {backButton}
                    </span>
                </Link>  

                <div className="my-notes">
                    <h2>My Notes</h2>

                </div>
            </section>
        </>
    )
}

export default ProfileInfo