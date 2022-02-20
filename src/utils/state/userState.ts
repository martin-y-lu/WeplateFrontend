import {atom, useRecoilState, } from 'recoil'
export const userState = atom({
    key: "userState",
    default: {
        doOnboarding: true,
        email: null,
        password: null,
    }
})