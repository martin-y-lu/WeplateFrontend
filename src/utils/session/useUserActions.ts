import { atom, useSetRecoilState } from 'recoil';
import { TimeInfo } from '../../dashboard/state';
import { mealToAPIForm } from '../../dashboard/typeUtil';
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
        mealsByTime,
        mealById,
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
                setAuth(user)
                // get return url from location state or default to home page
                // const { from } = history.location.state || { from: { pathname: '/' } };
                // history.push(from);

                return user;
            });
    }
    async function mealsByTime(timeInfo:TimeInfo){
        const endpoint = `${baseUrl}/api/meals/?date=${encodeURIComponent(timeInfo.date)}&group=${encodeURIComponent(mealToAPIForm(timeInfo.meal))}`
        console.log({endpoint})
        const resp = await fetchWrapper.get(endpoint)
        if(resp.error) throw new Error(resp.message)
        if(resp == null) throw new Error(`No data.`)
        return resp as APIMealByTimePayload
    }
    async function mealById(id:number){
        const endpoint = `${baseUrl}/api/meals/${encodeURIComponent(id)}/`
        console.log({endpoint})
        const resp = await fetchWrapper.get(endpoint)
        return resp as APIMealEvent
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