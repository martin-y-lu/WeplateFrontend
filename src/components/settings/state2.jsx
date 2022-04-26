import {atom} from 'recoil'

export const editInfoState = atom({
    key: "SettingsSelected",
    default: "name"
})