import {atom} from 'recoil'

export const editInfoState = atom({
    key: "selected",
    default: "name"
})