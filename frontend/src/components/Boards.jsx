import { useState, useEffect } from "react"
import { notifySuccess, notifyError } from "../hooks/useToaster"
import '../css/boards.css'
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
                <div className="heading">
                    <h1>Boards</h1>
                </div>

                <div className="boards-container">
                    {boards && boards.map((board, index) => (
                        <div className="board" key={board._id || index}>
                            <p className="board-title">{board.board_name}</p>
                            <div className="board-bg">
                                <p className={`board-status ${board.status}`}>{(board.status).toUpperCase()}</p>
                                <p className="board-notes-total">{board.totalNotes}/20</p>
                            </div>
                        </div>
                    ))}
                </div>
                

            </section>
        </>
    )
}

export default Boards