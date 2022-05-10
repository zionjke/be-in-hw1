type ErrorsMessagesType = {
    errorsMessages: [
        {
            message: string,
            field: string,
        }

    ],
    resultCode: number
}

export const sendError = (field:string,message:string): ErrorsMessagesType => {
    return {
        errorsMessages: [
            {
                message: message,
                field: field
            }

        ],
        resultCode: 1
    }
}




export const validateUrl = (url:string) => {
    return /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(url);
}
