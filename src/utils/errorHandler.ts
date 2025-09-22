import { AxiosError } from 'axios';
import cloneDeep from 'lodash.clonedeep';
import { HttpStatusCode } from './http';

type ErrorHandlerItems = { [key: number]: (axiosError: AxiosError) => void };

const globalHandlers: ErrorHandlerItems = {
    [HttpStatusCode.UNAUTHORIZED]: () => {
        console.error('Un-authorized');
    },
    [HttpStatusCode.SERVER_ERROR]: () => {
        console.error('Bad request');
    },
    [HttpStatusCode.NOT_FOUND]: (axiosError: AxiosError) => {
        console.error('NOT found', axiosError.response ? axiosError.response.data : '');
    },
    [HttpStatusCode.UNACCEPTABLE]: (axiosError: AxiosError) => {
        console.error('Unacceptable', axiosError.response ? axiosError.response.data : '');
    },
    [HttpStatusCode.UNSUPPORTED_MEDIA_TYPE]: (axiosError: AxiosError) => {
        console.error('Unsupported Media Type', axiosError.response ? axiosError.response.data : '');
    }
};

export function axiosErrorHandler(error: AxiosError, customHandlers?: ErrorHandlerItems) {
    if (!error.isAxiosError) return;

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (customHandlers) {
            const copied = cloneDeep<ErrorHandlerItems>(globalHandlers);
            for (const item in customHandlers) {
                copied[item] = customHandlers[item];
            }

            // Process handlers
            if (Object.prototype.hasOwnProperty.call(copied, error.response.status)) {
                copied[error.response.status](error);
                return;
            }
        }

        // Exception in case of not having a handler
        console.error('No handler for error: ', error.response);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error('No response from server error.', error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error in setting up request. Check your code.', error.message);
    }
}
