import * as Font from 'expo-font'
export function useFonts(){
    console.log("Loading fonts")
    Font.useFonts({
        // "Avenir":require("../assets/avenir_ff/"),
        "Avenir-Black":require("../assets/avenir_ff/AvenirLTStd-Black.ttf"),
        "Avenir-Heavy":require("../assets/avenir_ff/AEH.ttf"),
        "Avenir-Medium":require("../assets/avenir_ff/Avenir Medium.ttf"),
        "Avenir-Roman":require("../assets/avenir_ff/AvenirLTStd-Roman.ttf"),
    })
}