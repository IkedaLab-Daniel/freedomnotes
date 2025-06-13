import { notifySuccess, notifyError } from "./useToaster";

export const useNoteActions = ( user, note) => {

    const unlistNote = async (note_id) => {
        console.log("New unlist method called")
        setIsLoading(true);

        try{
            const response = await fetch(`http://localhost:4000/api/note/${note_id}/archive`, {
                method : "PATCH",
                headers : {
                    Authorization: `Bearer ${user.token}`
                }
            });

            const json = await response.json()

            if (response.ok){
                setIsLoading(false);
                notifySuccess('Note Deleted')
                onClose()
                onSUDO();  
            }

            if (!response.ok){
                setIsLoading(false)
                notifyError( json.error )
            }

        } catch (error){
            setIsLoading(false);
            notifyError( 'Server offline ZZZ' )
        }
    }

    return { unlistNote }
}