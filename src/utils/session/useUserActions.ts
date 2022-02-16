import { atom, useSetRecoilState } from 'recoil';
import { authAtom, useFetchWrapper } from './useFetchWrapper';

export const usersAtom = atom({
    key: "usersAtom",
    default: null,
})

export { useUserActions };

function useUserActions () {
    const baseUrl = "https://mosesxu.ca/weplate";
    const fetchWrapper = useFetchWrapper();
    const setAuth = useSetRecoilState(authAtom);
    const setUsers = useSetRecoilState(usersAtom);

    return {
        login,
        logout,
        getAll,
        meals
    }

    function login(email:string, password:string) {
        let data = {
            username: email,
            password,
        }

        return fetchWrapper.post(`${baseUrl}/api/token_auth/`, data)
            .then(user => {
                console.log(user)
                setUsers(user)
                if("token" in user){
                    setAuth(user.token);
                }
                // get return url from location state or default to home page
                // const { from } = history.location.state || { from: { pathname: '/' } };
                // history.push(from);

                return user;
            });
    }
    async function meals(){
        const resp = await fetchWrapper.get(`${baseUrl}/api/meals/`)
        if(resp.error) throw new Error(resp.message)
        if(resp == null || resp?.data == null) throw new Error("No data.")
        return resp.data as APIMealPayload
    }
    function logout() {
        // remove user from local storage, set auth state to null and redirect to login page
        localStorage.removeItem('user');
        setAuth(null);
        // history.push('/login');
    }

    function getAll() {
        return fetchWrapper.get(baseUrl).then(setUsers);
    }    
}