import { useState } from "react"
import { toast } from 'react-hot-toast'

const Boards = () => {

    const [ boards, setBoards ] = useState([])

    const fetchBoard = async () => {
        const response = await fetch('http://localhost:4000/api/board')

        if (response.ok){
            console.log("Boards fetch OK");
            console.log(JSON.stringify(response))
        }

        if(!response.ok){

        }
        
    }
    
    return(
        <>
            <section id="boards">
                Boards section
                <h1>Hello, Ice</h1>
                <h1 onClick={fetchBoard}>Fetch Board</h1>
            </section>
        </>
    )
}

export default Boards