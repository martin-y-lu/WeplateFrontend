import { atom, useSetRecoilState, useRecoilState } from 'recoil';
import { TimeInfo } from '../../dashboard/state';
import { mealToAPIForm, MealState } from '../../dashboard/typeUtil';
import { authAtom, useFetchWrapper } from './useFetchWrapper';
import { APIMealSuggest, APIPortionInfo, APIPortionSuggest, APIMealEvent, APIMealByTimePayload, APIAnalyticsMealChoiceEntry, APIUserSettings, APIKey, APIRegisterSettings } from './apiTypes';
import { usePersistentAtom } from '../state/userState';
import {useEffect} from 'react';

export const usersAtom = atom({
    key: "usersAtom",
    default: null as APIUserSettings,
})

export const ingredientsAtom = atom({
    key: "ingredientsAtom",
    default: null as {
        id: APIKey,
        name: string,
        school: APIKey,
    }[]
})

export { useUserActions };

function useUserActions () {
    const baseUrl = "https://weplate-backend.nn.r.appspot.com";
    // const baseUrl = "https://mosesxu.ca/weplate";
    const fetchWrapper = useFetchWrapper();
    const [auth,setAuth] = useRecoilState(authAtom);
    const [users, setUsers] = useRecoilState(usersAtom);
    const [ingredients,setIngredients] = useRecoilState(ingredientsAtom)
    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom() as any
    useEffect( ()=>{
        fetchPersistentState()
    },[])

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
        postAnalyticsTextFeedback,
        postUserSettings,
        getIngredients,
        registerUser,
        checkEmail,
    }

    async function login(email:string, password:string) {
        let data = {
            username: email,
            password,
        }
        // console.log("LOGIN!",data)

        // if(auth?.token !== null) return
        try{
            const _auth = await fetchWrapper.post(`${baseUrl}/api/token_auth/`, data)
        
            if(!("token" in _auth)) throw new Error("Invalid auth" + password +" "+email)
            
            setAuth(_auth)

            const userInfo = await fetchWrapper.get(`${baseUrl}/api/settings/`,null,_auth)
            setUsers(userInfo as APIUserSettings)
            // console.log({userInfo})
            // get return url from location state or default to home page
            // const { from } = history.location.state || { from: { pathname: '/' } };
            // history.push(from);

            return _auth;
        }catch(e){
            throw e;
        }
    }
    async function mealsByTime(timeInfo:TimeInfo){
        const endpoint = `${baseUrl}/api/meals/?date=${encodeURIComponent(timeInfo.date)}&group=${encodeURIComponent(mealToAPIForm(timeInfo.meal))}`
        console.log("MEALS BY TIME:",endpoint)
        // console.log({endpoint})
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
    async function suggestionByMealId(id:number){
        const endpoint =  `${baseUrl}/api/suggest/${encodeURIComponent(id)}/items/`
        console.log(endpoint)
        const resp = await fetchWrapper.get(endpoint)
        return resp as APIMealSuggest;
    }
    async function portionSuggestionByItemID(small1: number, small2: number, large: number){
        const endpoint = `${baseUrl}/api/suggest/portions/?small1=${encodeURIComponent(small1)}&small2=${encodeURIComponent(small2)}&large=${large}`
        console.log(endpoint)
        const resp = await fetchWrapper.get(endpoint)
        return resp as APIPortionSuggest;
    }
    async function postAnalyticsMealChoices(mealState : MealState){
        console.log("Posting")
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
    async function postAnalyticsTextFeedback(text:string){
        console.log("Posting")
        const endpoint = `${baseUrl}/api/analytics/text_feedback/`
        const resp = await fetchWrapper.post(endpoint,{
            feedback: text
        })
        console.log(resp)
    }
    async function getAnalyticsMealChoices(mealId:number){
        const endpoint = `${baseUrl}/api/analytics/meal_choice/?meal=${encodeURIComponent(mealId)}`
        const resp = await fetchWrapper.get(endpoint)
        return resp as Array<APIAnalyticsMealChoiceEntry>
    }

    async function postAnalyticsMealItemVote(mealItemId: number,liked: boolean){
        console.log("Posting")
        const endpoint = `${baseUrl}/api/analytics/meal_item_vote/`
        const resp = await fetchWrapper.post(endpoint,{
            meal_item: mealItemId,
            liked
        })
        return resp as {detail: string}
    }
    async function postUserSettings(newUser: APIUserSettings){
        console.log("Posting")
        const endpoint = `${baseUrl}/api/settings/update/`
        const resp = await fetchWrapper.post(endpoint,{
            ... newUser,
            ban: [],
            favour: [],
            allergies: newUser.allergies.map(el=> el.id),
        })
        return resp
    }
    async function registerUser(newUser: APIRegisterSettings){
        const endpoint = `${baseUrl}/api/register/`
        const resp = await fetchWrapper.post(endpoint,{
            ...newUser,
            ban: [],
            favour: [],
            allergies: newUser.allergies.map(el=> el.id),
        })
        return resp
    }
    async function getIngredients(){
        if(users?.school === null) return null
        if(ingredients != null) return ingredients

        const endpoint = `${baseUrl}/api/ingredients/${encodeURIComponent(users?.school)}/`
        const resp = await fetchWrapper.get(endpoint)
        setIngredients(resp)
        return resp as {
            id: APIKey,
            name: string,
            school: APIKey,
        }[]
    }
    async function checkEmail(email:string){
        const endpoint = `${baseUrl}/api/register/check_email/${encodeURIComponent(email)}/`
        const resp = await fetchWrapper.get(endpoint)
        return resp
    }


    async function logout() {
        // remove user from local storage, set auth state to null and redirect to login page
        await setPersistentState({
            ...persistentState,
            email: null,
            password: null,
        })
        setAuth(null);
        // history.push('/login');
    }

    function getAll() {
        return fetchWrapper.get(baseUrl).then(setUsers);
    }    
}