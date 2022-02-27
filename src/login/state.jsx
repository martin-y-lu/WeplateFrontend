import {atom} from 'recoil'

export const logInState = atom({
    key: "account",
    // default: {
    //     date: null,
    //     meal: "Breakfast",
    //     streakLength: 12
    // }
    default: {
        email: null,
        password: null,
        name: "John Doe",
        token: null
    }
})