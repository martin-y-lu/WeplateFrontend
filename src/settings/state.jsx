import {atom} from 'recoil'

export const Rname = atom({
    key: "name",
    default: 'John Doe'
})

export const RdietGoals = atom({
    key: "dietGoals",
    default: "Athletic Performance"
})

export const RactivityLevel = atom({
    key: "activityLevel",
    default: 'Moderate'
})

export const RdietaryRestrictions = atom({
    key: "dietaryRestrictions",
    default: ['Vegan', 'Lactose Intolerant']
})

export const RfoodAllergies = atom({
    key: "foodAllergies",
    default: ['Peanuts', 'Shellfish']
})
export const Rbirthday = atom({
    key: "birthday",
    default: '2002-06-30'
})

export const Rsex = atom({
    key: "sex",
    default: 'Male'
})

export const Rweight = atom({
    key: "rweight",
    default: 103
})

export const Rheight = atom({
    key: "Rheight",
    default: 68
})

export const infoState = atom({
    key: "infoStates",
    default: {
        name: "John Doe",
        dietGoals: "Athletic Performance",
        activityLevel: 'Moderate',
        dietaryRestrictions: ['Vegan', 'Lactose Intolerant'],
        foodAllergies: ['Peanuts', 'Shellfish'],
        birthday: '2002-06-30',
        weight: 152,
        height: "6\'4\"",
    }
})