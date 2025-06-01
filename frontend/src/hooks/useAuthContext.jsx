import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    console.log(context)

    if (!context){
        throw Error('This component is not a child of AuthContextProvider')
    }

    return context
}