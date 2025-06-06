import { useState } from "react"
import Notes from "../components/Notes"
import Footer from "../components/Footer"

const BoardView = () => {

    const [ board, setBoard ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);

    const fetchBoardData = async () => {
        setIsLoading(true)

        try{
            const response = await fetch('')
        } catch (error){
            setIsLoading(false)
            console.log (error)
        }
    }

    return(
        <>
            <h1>Hello</h1>
            <Notes />
            <Footer />
        </>
    )
}

export default BoardView