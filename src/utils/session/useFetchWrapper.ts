import { atom, useRecoilState } from 'recoil';


export const authAtom = atom({
    key: "authAtom",
    default: null,
})

export { useFetchWrapper };

function useFetchWrapper() {
    const [auth, setAuth] = useRecoilState(authAtom);

    return {
        get: request('GET'),
        post: request('POST'),
        put: request('PUT'),
        delete: request('DELETE')
    };

    function request(method) {
        return (url: string, body ?:any) => {
            const requestOptions = {
                method,
                headers: authHeader(url),
                body: null
            };
            if (body) {
                // requestOptions.headers['Content-Type'] = "multipart/form-data;";
                // requestOptions.body = body;
                requestOptions.headers['Content-Type'] = "application/json";
                requestOptions.body = JSON.stringify(body);
            }
            return fetch(url, requestOptions).then(handleResponse);
        }
    }
    
    // helper functions
    
    function authHeader(url) {
        // return auth header with jwt if user is logged in and request is to the api url
        const token = auth?.token;
        // console.log({token_auth_header:token})
        const isLoggedIn = !!token;
        if (isLoggedIn) {
            return { Authorization: `Token ${token}` };
        } else {
            return {};
        }
    }
    
    function handleResponse(response) {
        return response.text().then(text => {
            // console.log({text})
            const data = text && JSON.parse(text);
            
            if (!response.ok) {
                if ([401, 403].includes(response.status) && auth?.token) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    setAuth(null);
                }
    
                const error = (data && data.message) || response.statusText;
                console.error({error,response})
                return Promise.reject(error);
            }
    
            return data;
        });
    }    
}