import {atom} from 'recoil'

export const dashboardState = atom({
    key: "dashboardState",
    // default: {
    //     date: null,
    //     meal: "Breakfast",
    //     streakLength: 12
    // }
    default: {
        date: new Date("December 17, 2022 11:13:00"),
        meal: "Breakfast",
        streakLength: 12
    }
})