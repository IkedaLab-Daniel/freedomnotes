
export const Utils = () => {
    
    const formatDate = ( dateString ) => {
        const date = new Date(dateString);
        const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }

    // ? This is a softLogut
    // ? Logout user without notification
    // ? Use when token expires and need to logout user
    const softLogout = () => {
        localStorage.removeItem('user');
        dispatch( { type: 'LOGOUT' } );
    }

    return { formatDate, softLogout }
}