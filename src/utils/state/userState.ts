import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'
import {atom, SetterOrUpdater, useRecoilState, } from 'recoil'
const defaultPersist = {
    loaded: false,
    doOnboarding: true,
    email: null as string,
    password: null as string,
    alternativePasswords: [] as string[],
}
type defaultPersistType = typeof defaultPersist
const persistentAtom = atom({
    key: "persistentAtom",
    default: defaultPersist,
})

export function usePersistentAtom(){
    const [pers,setPers] = useRecoilState(persistentAtom)
    async function fetchPersistentAtom(){
        const resstring = await AsyncStorage.getItem("persist")
        // console.log({resstring})
        if(resstring){
            const res = JSON.parse(resstring)
            const newPers = {
                ...res,
                loaded: true,
            }
            if(newPers !== pers){
                setPers(newPers)
            
            }
            return newPers;
        }else{
            const newPers = {
                ...pers,
                loaded: true,
            }
            if(pers !== newPers){
                await setPersistentAtom(newPers)
                setPers(newPers)
            }
            return newPers;
        }
    }
    async function setPersistentAtom(value){
        const newPers = {
            ...pers,
            ...value
        }
        console.log({newPers})
        setPers(newPers)
        await AsyncStorage.setItem("persist",JSON.stringify(newPers))
    }
    const dangerouslySetPersistentAtom = setPers
    const ret : [ defaultPersistType , (defaultPersistType) => Promise<void>, any , any] = [pers,setPersistentAtom,fetchPersistentAtom,dangerouslySetPersistentAtom] 
    
    return ret

}