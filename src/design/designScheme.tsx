import { atom, useRecoilValue } from "recoil";

export type Color = string;

export const defaultDesignScheme = {
    colors: {
        brand1: "#CE014E" as Color,
        brand2: "#FF5F00" as Color,
        brand3: "#FDB812" as Color,
        accent1: "#FF3939" as Color,
        accent2: "#FF7070" as Color,
        grayscale1: "#302F2F" as Color,
        grayscale2: "#606060" as Color, 
        grayscale3: "#585656" as Color,
        grayscale4: "#E9E8E8" as Color,
    }
}

export const designScheme = atom({
    key: "designScheme",
    default: defaultDesignScheme
})

export const useDesignScheme = ()=>{
    const ds = useRecoilValue(designScheme)
    return ds
}

