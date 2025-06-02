import { useState, useEffect } from "react"
import { notifySuccess, notifyError } from "../hooks/useToaster"

const Boards = () => {

    const [ boards, setBoards ] = useState(null)

    const fetchBoard = async () => {

        try{
            const response = await fetch('http://localhost:4000/api/board')
            const json = await response.json();
            if (response.ok){
                console.log("Boards fetch OK");
                console.log((json))
            }

            if(!response.ok){
                notifyError('Boards not fetched! Server Error')
            }
            setBoards(json.boards)
        } catch (error){
            notifyError("Server Down")
        }
    }

    useEffect(() => {
        fetchBoard();
    }, []);
    
    return(
        <>
            <section id="boards">
                Boards section
                <h1>Hello, Ice</h1>
                {boards && boards.map((board, index) => (
                    <div key={board._id || index}>
                        <p>{board.board_name}</p>
                        <p>Total Notes: {board.totalNotes}/20</p>
                        <p>Status: {(board.status).toUpperCase()}</p>
                        <hr />
                    </div>
                ))}
                <h1>End</h1>
            </section>
        </>
    )
}

export default Boards