import { create } from 'apisauce';
import qs from 'query-string';

// const client = create({ baseURL: 'https://dace1a0e81ae.ngrok.io' });
const client = create({ baseURL: 'http://127.0.0.1:3001/' });
const request = async (method, path, data) => {
    let response = undefined;
    try {
        if (method === 'GET' && (typeof data === 'object' || typeof data === 'string')) {
            path += "?" + qs.stringify(data);
        }
        if (method !== "GET") {
            response = await client[method.toLowerCase()](path, data);
        } else {
            response = await client[method.toLowerCase()](path);
        }
    } catch (error) {
        response = error.response
    }

    if (response.status >= 400) {
        throw Error(`Unhandled Error: ${JSON.stringify(response)}`);
    }

    if (response.problem) {
        throw Error(response.problem);
    }
    return response.data;
};

export default request;