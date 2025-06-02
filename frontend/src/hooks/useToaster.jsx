import { toast } from 'react-hot-toast'

export const notifySuccess = ( message ) => {
     toast.success(message, {
                duration: 4000,
                style: {
                    border: "1px solid #4caf50", 
                    padding: "10px 20px", 
                    fontSize: "1.2rem", 
                  },
        });
}

export const notifyError = (message) => {
    toast.error(message, {
            duration: 4000,
            style: {
                border: "1px solidrgb(175, 76, 76)", 
                padding: "10px 20px", 
                fontSize: "1.2rem", 
              },
    });
}