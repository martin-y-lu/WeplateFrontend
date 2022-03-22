import {atom, selector} from 'recoil'
import { invalidateMealStates, mealStateKeysAtom, mealStatesAtom } from '../dashboard/state'
import { ingredientsAtom, usersAtom } from '../utils/session/useUserActions'

export const Rname = selector({
    key: "name",
    get: ({get})=>{
        const info = get(infoState)
        return info.name
    } ,set: ({get,set}, newVal)=>{
        const info = get(infoState)
        set(infoState, {...info, name: newVal}) 
    }
})

export const RdietGoals = selector({
    key: "dietGoals",
    get: ({get})=>{
        const info = get(infoState)
        return info.dietGoals
    } ,set: ({get,set}, newVal)=>{
        const info = get(infoState)
        set(infoState, {...info, dietGoals: newVal}) 
    }
})

export const RactivityLevel = selector({
    key: "activityLevel",
    get: ({get})=>{
        const info = get(infoState)
        return info.activityLevel
    } ,set: ({get,set}, newVal)=>{
        const info = get(infoState)
        set(infoState, {...info, activityLevel: newVal}) 
    }
})

export const RdietaryRestrictions = selector({
    key: "dietaryRestrictions",
    get: ({get})=>{
        const info = get(infoState)
        return info.dietaryRestrictions
    } ,set: ({get,set}, newVal)=>{
        const info = get(infoState)
        set(infoState, {...info, dietaryRestrictions: newVal}) 
    }
})

export const RfoodAllergies = selector({
    key: "foodAllergies",
    get: ({get})=>{
        const info = get(infoState)
        return info.foodAllergies
    } ,set: ({get,set}, newVal)=>{
        const info = get(infoState)
        const newInfo = {...info, foodAllergies: newVal}
        console.log({newInfo})
        set(infoState, newInfo) 
    }
})
export const Rbirthday = selector({
    key: "birthday",
    get: ({get})=>{
        const info = get(infoState)
        return info.birthday
    } ,set: ({get,set}, newVal)=>{
        const info = get(infoState)
        set(infoState, {...info, birthday: newVal}) 
    }
})

export const Rsex = selector({
    key: "sex",
    get: ({get})=>{
        const info = get(infoState)
        return info.sex
    }
    ,set: ({get,set}, newVal)=>{
        const info = get(infoState)
        const newInfo = {...info, sex: newVal}
        console.log({newInfo})
        set(infoState, newInfo) 
    }
})

export const Rweight = selector({
    key: "rweight",
    get: ({get})=>{
        const info = get(infoState)
        return info.weight
    }
    ,set: ({get,set}, newVal)=>{
        const info = get(infoState)
        set(infoState, {...info, weight: newVal}) 
    }
})

export const Rheight = selector({
    key: "Rheight",
    get: ({get})=>{
        const info = get(infoState)
        return info.height
    }
    ,set: ({get,set}, newVal)=>{
        const info = get(infoState)
        set(infoState, {...info, height: newVal}) 
    }
})
function setInfoState({get,set},newInfoState){
    const user = get(usersAtom)
    const ingredients = get(ingredientsAtom)
    console.log(ingredients)

    function getId(allergenName){
        for(const ingredient of (ingredients?? [])){
            if(ingredient.name === allergenName) return ingredient.id
        }
        return null
    }
    const newAllergies = newInfoState.foodAllergies.map(el => {return {name: el, id : getId(el)}}).filter(el=> el.id !== null)
    const newUser = {
        ...user,
        name: newInfoState.name,
        health_goal: newInfoState.dietGoals,
        activity_level: newInfoState.activityLevel,
        dietary_restrictions: newInfoState.dietaryRestrictions,
        allergies: newAllergies,
        birthdate: newInfoState.birthday,
        weight: newInfoState.weight,
        height: newInfoState.height,
        sex: newInfoState.sex,
    }
    console.log(newUser)
    // invalidate meal states
    set(mealStatesAtom,{})
    set(usersAtom,newUser)
}
export const infoState = selector({
    key: "infoStates",
    get: ({get})=>{
        const user = get(usersAtom)
        return {
                name: user?.name,
                dietGoals: user?.health_goal,
                activityLevel: user?.activity_level,
                dietaryRestrictions: user?.dietary_restrictions ?? [],
                foodAllergies: user?.allergies?.map(el=> el.name),
                birthday: user?.birthdate,
                weight: user?.weight,
                height: user?.height,
                sex: user?.sex
            } 
    },
    set: setInfoState
    // default: {
    //     name: "John Doe",
    //     dietGoals: "Athletic Performance",
    //     activityLevel: 'Moderate',
    //     dietaryRestrictions: ['Vegan', 'Lactose Intolerant'],
    //     foodAllergies: ['Peanuts', 'Shellfish'],
    //     birthday: '2002-06-30',
    //     weight: 152,
    //     height: "6\'4\"",
    // }
})
// export const Rname = atom({
//     key: "name",
//     default: 'John Doe'
// })

// export const RdietGoals = atom({
//     key: "dietGoals",
//     default: "Athletic Performance"
// })

// export const RactivityLevel = atom({
//     key: "activityLevel",
//     default: 'Moderate'
// })

// export const RdietaryRestrictions = atom({
//     key: "dietaryRestrictions",
//     default: ['Vegan', 'Lactose Intolerant']
// })

// export const RfoodAllergies = atom({
//     key: "foodAllergies",
//     default: ['Peanuts', 'Shellfish']
// })
// export const Rbirthday = atom({
//     key: "birthday",
//     default: '2002-06-30'
// })

// export const Rsex = atom({
//     key: "sex",
//     default: 'Male'
// })

// export const Rweight = atom({
//     key: "rweight",
//     default: 103
// })

// export const Rheight = atom({
//     key: "Rheight",
//     default: 68
// })

// export const infoState = atom({
//     key: "infoStates",
//     default: {
//         name: "John Doe",
//         dietGoals: "Athletic Performance",
//         activityLevel: 'Moderate',
//         dietaryRestrictions: ['Vegan', 'Lactose Intolerant'],
//         foodAllergies: ['Peanuts', 'Shellfish'],
//         birthday: '2002-06-30',
//         weight: 152,
//         height: "6\'4\"",
//     }
// })