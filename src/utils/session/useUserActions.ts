import { atom, useSetRecoilState } from 'recoil';
import { TimeInfo } from '../../dashboard/state';
import { mealToAPIForm, MealState } from '../../dashboard/typeUtil';
import { authAtom, useFetchWrapper } from './useFetchWrapper';
import { APIMealSuggest, APIPortionInfo, APIPortionSuggest, APIMealEvent, APIMealByTimePayload, APIAnalyticsMealChoiceEntry } from './apiTypes';

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
        suggestionByMealId,
        portionSuggestionByItemID,
        postAnalyticsMealChoices,
        getAnalyticsMealChoices,
        postAnalyticsMealItemVote,
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
        // console.log({endpoint})
        const resp = await fetchWrapper.get(endpoint)
        if(resp.error) throw new Error(resp.message)
        if(resp == null) throw new Error(`No data.`)
        return resp as APIMealByTimePayload
    }
    async function mealById(id:number){
        const endpoint = `${baseUrl}/api/meals/${encodeURIComponent(id)}/`
        // console.log({endpoint})
        const resp = await fetchWrapper.get(endpoint)
        return resp as APIMealEvent
    }
    async function suggestionByMealId(id:number){
        const endpoint =  `${baseUrl}/api/suggest/${encodeURIComponent(id)}/items/`
        const resp = await fetchWrapper.get(endpoint)
        return resp as APIMealSuggest;
    }
    async function portionSuggestionByItemID(small1: number, small2: number, large: number){
        const endpoint = `${baseUrl}/api/suggest/portions/?small1=${encodeURIComponent(small1)}&small2=${encodeURIComponent(small2)}&large=${large}`
        const resp = await fetchWrapper.get(endpoint)
        return resp as APIPortionSuggest;
    }
    async function postAnalyticsMealChoices(mealState : MealState){
        const endpoint =  `${baseUrl}/api/analytics/meal_choice/`
        const resp = await fetchWrapper.post(endpoint,{
            meal: mealState.mealID,
            small1: mealState.dishA.id,
            small2: mealState.dishB.id,
            large: mealState.dishC.id,
            small1_portion: mealState.dishA.portion.fillFraction,
            small2_portion: mealState.dishB.portion.fillFraction,
            large_portion: mealState.dishC.portion.fillFraction,
        })
        return resp as {detail:string}
    }
    async function getAnalyticsMealChoices(mealId:number){
        const endpoint = `${baseUrl}/api/analytics/meal_choice/?meal=${encodeURIComponent(mealId)}`
        const resp = await fetchWrapper.get(endpoint)
        return resp as Array<APIAnalyticsMealChoiceEntry>
    }

    async function postAnalyticsMealItemVote(mealItemId: number,liked: boolean){
        const endpoint = `${baseUrl}/api/analytics/meal_item_vote/`
        const resp = await fetchWrapper.post(endpoint,{
            meal_item: mealItemId,
            liked
        })
        return resp as {detail: string}
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