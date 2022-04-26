import { atom, useRecoilState } from 'recoil';


export const authAtom = atom({
    key: "authAtom",
    default: null,
})

export { useFetchWrapper };

function useFetchWrapper() {
    const [auth, setAuth] = useRecoilState<{
        token: string
    }>(authAtom);

    return {
        get: request('GET'),
        post: request('POST'),
        put: request('PUT'),
        delete: request('DELETE')
    };

    function request(method) {
        return (url: string, body ?:any, props ?: {auth?, bodyType ?: "json" | "form"}) => {
            const {auth,bodyType} = props
            const _bodyType = bodyType ?? "json"
            const requestOptions = {
                method,
                headers: authHeader(url,auth),
                body: null
            };
            if (body) {
                // requestOptions.headers['Content-Type'] = "multipart/form-data;";
                // requestOptions.body = body;
                requestOptions.headers['Content-Type'] = { json: "application/json", form: 'multipart/form-data'}[_bodyType];
                requestOptions.body = JSON.stringify(body);
            }
            return fetch(url, requestOptions).then(handleResponse);
        }
    }
    
    // helper functions
    
    function authHeader(url,_auth) {
        // return auth header with jwt if user is logged in and request is to the api url
        const token = _auth?.token ?? auth?.token;
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
            try{
                const data = text && JSON.parse(text);
                
                if (!response.ok) {
                    if ([401, 403].includes(response.status) && auth?.token) {
                        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                        setAuth(null);
                    }
        
                    const error = (data && data.message) || response.statusText;
                    console.error({data,response})
                    throw new Error(JSON.stringify({data,response}))
                    // return Promise.reject(error);
                }
        
                return data;
            }catch(e){
                // console.error(text)
            }
        });
    }    
}