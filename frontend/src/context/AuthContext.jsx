import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            return { user : action.payload }
        case 'LOGOUT':
            return { user : { role : "guest"}}
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, { user : { role : "guest"}})

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        if (user){
            dispatch( {type : 'LOGIN', payload: user} )
        }
    }, [])

    console.log('AuthContext State:', state)

    return(
        <AuthContext.Provider value={ {...state, dispatch} }>
            { children }
        </AuthContext.Provider>
    )
}