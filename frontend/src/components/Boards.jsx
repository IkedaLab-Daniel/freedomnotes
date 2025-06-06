import { useState, useEffect } from "react"
import { notifySuccess, notifyError } from "../hooks/useToaster"
import { Link } from "react-router-dom"
import '../css/boards.css'

const Boards = () => {

    const [ boards, setBoards ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)

    const fetchBoard = async () => {
        setIsLoading(true)
        try{
            const response = await fetch('http://localhost:4000/api/board')
            const json = await response.json();
            if (response.ok){
                setIsLoading(false)
                setBoards(json.boards)
            }

            if(!response.ok){
                setIsLoading(false)
                notifyError('Boards not fetched! Server Error')
            }

        } catch (error){
            setIsLoading(false)
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
                    { isLoading && (<p>Loading ...</p>)}
                    { !boards && (<p>No Boards</p>)}
                    {boards && boards.map((board, index) => (
                        <Link to={`/board/${board._id}`}>
                            <div className="board" key={board._id || index}>
                                <p className="board-title">{board.board_name}</p>
                                <div className="board-bg">
                                    <p className={`board-status ${board.status}`}>{(board.status).toUpperCase()}</p>
                                    <p className="board-notes-total">{board.totalNotes}/20</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                

            </section>
        </>
    )
}

export default Boards