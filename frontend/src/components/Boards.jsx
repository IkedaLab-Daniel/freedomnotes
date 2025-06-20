import { useState, useEffect } from "react"
import { notifySuccess, notifyError } from "../hooks/useToaster"
import { Link } from "react-router-dom"
import '../css/boards.css'

const Boards = () => {

    const [ boards, setBoards ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)
    const apiURL = import.meta.env.VITE_API_URL;

    const fetchBoard = async () => {
        setIsLoading(true)
        try{
            const response = await fetch(`${apiURL}/api/board`)
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
                    <p>Select board to add note</p>
                </div>

                <div className="boards-container">
                    { isLoading && (<p>Loading ...</p>)}
                    { (!boards && !isLoading) && (<p>No Boards</p>)}
                    {boards && boards.map((board, index) => (
                        <Link to={`/board/${board._id}`}>
                            <div className="board" key={board._id || index}>
                                <p className="board-title">{board.board_name}</p>
                                <div className="board-bg">
                                    { (board.totalNotes >= 20) ? (
                                        <>
                                            <p className={`board-status closed`}>FULL</p>
                                            <p className="board-notes-total">{board.totalNotes}/20</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className={`board-status ${board.status}`}>{(board.status).toUpperCase()}</p>
                                            <p className="board-notes-total">{board.totalNotes}/20</p>
                                        </>
                                       
                                    )}

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