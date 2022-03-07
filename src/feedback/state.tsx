import {atom} from 'recoil'

export enum FeedbackTypes{
    COOKING_FOOD_PREP = "Cooking and Food Preparation",
    DINING_HALL_MANAGEMENT = "Dining Hall Management",
    REQUEST_APP_FEATURES = "Request App Features",
    OTHER = "Other"
}

export const diningHallFeedbacks = ["Cleanliness","Supply Shortages","To-go Containers","Dietary Restrictions & Allergies","Events","Other"]
export type FeedbackState = {
    [FeedbackTypes.COOKING_FOOD_PREP]?: {
        dishNames : string[],
        feedback: string
    }   
    [FeedbackTypes.DINING_HALL_MANAGEMENT]?:{
        diningHallFeedbacks: string[],
        feedback: string
    }
    [FeedbackTypes.REQUEST_APP_FEATURES]?:{
        features : string[],
        feedback: string, 
    }
    [FeedbackTypes.OTHER]?:{
        feedback: string,
    }
}

export const feedbackAtom = atom({
    key: "FeedbackState",
    default: {} as FeedbackState
})