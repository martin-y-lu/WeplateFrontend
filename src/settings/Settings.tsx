import { View,Text,Button, ScrollView, Dimensions, DatePickerIOSBase, DatePickerIOS } from "react-native"
import { SvgXml } from "react-native-svg";
import { useRecoilState, useRecoilValue } from 'recoil';
import { ingredientsAtom, usersAtom, useUserActions } from "../utils/session/useUserActions";
import { useLogin } from '../debug/Debug';
import { TouchableOpacity } from "react-native-gesture-handler";
import { getAPIHealthGoalName, healthGoals, APIHealthGoal, getAPIActivityLevelName, activityLevels, APIActivityLevel, getAPIActivityLevelDescription, getAPIBaseAllergenName, baseAllergens, APIBaseAllergen, getAPIDietaryRestictionName as getAPIDietaryRestrictionName, dietaryRestrictions, APIDietaryRestriction, capitalizeFirstLetter, APIUserSettings } from '../utils/session/apiTypes';
import {useEffect, useState} from 'react';
import { dateToString, stringToDate } from "../dashboard/state";
import DateTimePicker from '@react-native-community/datetimepicker';
import { authAtom } from "../utils/session/useFetchWrapper";
import NumberPlease from "react-native-number-please";

const empty_avatar_svg = `<svg width="65" height="72" viewBox="0 0 65 72" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="32.5" cy="32.5391" r="32.5" fill="#A6A6A6"/>
<path d="M54 64.0391C54 77.2939 44.1503 68.75 32 68.75C19.8497 68.75 10 77.2939 10 64.0391C10 50.7842 19.8497 40.0391 32 40.0391C44.1503 40.0391 54 50.7842 54 64.0391Z" fill="white"/>
<path d="M54 64.0391C54 77.2939 44.1503 68.75 32 68.75C19.8497 68.75 10 77.2939 10 64.0391C10 50.7842 19.8497 40.0391 32 40.0391C44.1503 40.0391 54 50.7842 54 64.0391Z" fill="white"/>
<path d="M54 64.0391C54 77.2939 44.1503 68.75 32 68.75C19.8497 68.75 10 77.2939 10 64.0391C10 50.7842 19.8497 40.0391 32 40.0391C44.1503 40.0391 54 50.7842 54 64.0391Z" fill="white"/>
<circle cx="32" cy="23.0391" r="11" fill="white"/>
<circle cx="32" cy="23.0391" r="11" fill="white"/>
<circle cx="32" cy="23.0391" r="11" fill="white"/>
</svg>
`

export const arrow_svg = `<svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5 7.13397C13.1667 7.51888 13.1667 8.48112 12.5 8.86602L2 14.9282C1.33333 15.3131 0.499999 14.832 0.499999 14.0622L0.5 1.93782C0.5 1.16802 1.33333 0.686896 2 1.0718L12.5 7.13397Z" fill="#DDDDDD"/>
</svg>
`
export const check_svg = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.0331 12.3893C6.26619 12.6194 6.65382 12.5669 6.81744 12.2832L13.621 0.487082C13.7706 0.227812 14.1128 0.157117 14.3529 0.33593L16.2254 1.73096C16.4306 1.88387 16.4872 2.16711 16.3566 2.3872L7.40846 17.4565C7.24372 17.7339 6.86325 17.785 6.63117 17.5609L0.325091 11.4698C0.140486 11.2915 0.120868 11.0024 0.279695 10.8008L1.7462 8.93922C1.93073 8.70499 2.27795 8.6833 2.49019 8.89276L6.0331 12.3893Z" fill="#DDDDDD"/>
</svg>
`

export const unselected_icon_svg =   `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9.5" cy="9.5" r="8"  stroke-width="3"/>
</svg>
`
export const selected_icon_svg = `<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9.5" cy="9.5" r="8"  stroke-width="3" fill = "none"/>
<circle cx="9.5" cy="9.5" r="4.5" />
</svg>
`
const Settings = ({navigation})=>{
    const auth = useRecoilValue(authAtom)
    useLogin(navigation)
    const [user,_setUser] = useRecoilState(usersAtom)
    const userActions = useUserActions()
    async function setUser(newUser:APIUserSettings){
        _setUser(newUser)
        const res = await userActions.postUserSettings(newUser)
        // console.log({res})
        
    }

    function HeaderText(props){
        return <Text style = {{
            paddingTop: 30,
            color: "#DDDDDD",
            fontSize: 16,
            marginBottom: 4,

        }}>
            {props.children}
        </Text>
    }
    function SettingsEntry(props){

        const {name,current} = props
        const [_open,_setOpen] = useState(false)
        const open = props?.open ?? _open
        const setOpen = props?.setOpen ?? _setOpen

        return <View>
                <TouchableOpacity style = {{
                // flex:1,
                alignSelf:"stretch",
                width:(Dimensions.get('window').width - 20),
                height: 60,
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1, 
                borderTopWidth: 1, 
                borderColor: "#EDEDED",
            }}
                onPress = {()=>{
                    setOpen(!open)
                }}
                >
                <Text style = {{
                    marginLeft: 20,
                    fontSize: 20,
                    color:  "#bfbfbf",
                }}>
                    {name}
                </Text>

                <Text style = {{
                    marginLeft: "auto",
                    fontSize: 20,
                    color:  "#bfbfbf",
                    width: props?.width ?? 200,
                    textAlign: "right",
                }} ellipsizeMode = "tail" numberOfLines={1} >
                    {current}
                </Text>
                <View style = {{
                    margin : 10,
                    transform: [
                        {
                            rotate: open ? Math.PI/2 : 0
                        }
                    ]
                }}>    
                    <SvgXml xml = {arrow_svg}/>
                </View>
            </TouchableOpacity>
            {
               open ? <View style = {{
                marginLeft: 10,
                paddingLeft: 20,
                borderLeftWidth: 2,
                borderColor: "#EDEDED", 
                }}> 
                    {props.children}
                </View> : null 
            }
        </View>
    } 
    function OptionButtonBasic(props){
        const check :boolean = props.check  ?? false
        return <TouchableOpacity style = {{
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1, 
            borderTopWidth: 1, 
            borderColor: "#EDEDED",
        }}
            onPress = {props?.onPress}
        >
            <Text style = {{
               marginLeft: 20,
               fontSize: 20,
               color:  "#bfbfbf", 
               marginRight: "auto"
            }}>
                {props.name}
            </Text>
            {
                check ? 
                <View style = {{
                    marginRight: 30,
                }}>
                    <SvgXml xml = {check_svg}/>
                </View> : null
            }   
                    
        </TouchableOpacity>
    }
    function OptionButtonActivityLevel(props){
        const check :boolean = props.check  ?? false
        return <TouchableOpacity style = {{
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1, 
            borderTopWidth: 1, 
            borderColor: "#EDEDED",
        }}
            onPress = {props?.onPress}
        >
            <Text style = {{
               marginLeft: 20,
               fontSize: 20,
               color:  "#bfbfbf", 
               
               width: 100,
            //    backgroundColor: "orange"

            }}>
                {props.name}
            </Text>

            <Text style = {{
                // backgroundColor: "green",
                paddingLeft: 30,
                color:"#C8C8C8",
                marginRight: "auto",
            }}>
                {props.desc}
            </Text>
            {
                check ? 
                <View style = {{
                    marginRight: 30,
                }}>
                    <SvgXml xml = {check_svg}/>
                </View> : null
            }   
                    
        </TouchableOpacity>
    }
    function OptionButtonSelection(props){
        const check :boolean = props.check  ?? false
        return <TouchableOpacity style = {{
            height: 30,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1, 
            borderTopWidth: 1, 
            borderColor: "#EDEDED",
        }}
            onPress = {props?.onPress}
        >
            <SvgXml xml = {check ? selected_icon_svg : unselected_icon_svg} stroke="#C4C4C4" fill = {check? "#C4C4C4": "none"} />
            <Text style = {{
               marginLeft: 20,
               fontSize: 16,
               color:  "#bfbfbf", 
               
            //    width: 100,
            //    backgroundColor: "orange"

            }}>
                {props.name}
            </Text>
                    
        </TouchableOpacity>
    }
    const allergens = user?.allergies?.map(allergen=> allergen.name) ?? []

    function inAllergens(allergen:string){
        return allergens.includes(allergen)
    }
    // const [birthDate, setBirthDate] = useState(user?.birthdate ? stringToDate(user?.birthdate) : null)
    const [birthdateOpen,setBirthdateOpen] = useState(false)

    const ingredients = useRecoilValue(ingredientsAtom)
    useEffect(()=>{
        const getIngredients = async function(){
            await userActions.getIngredients()
        }
        getIngredients()
    },[auth])
    if(!user) {
        return <></>
    }

    // console.log(user.birthdate)
    return <ScrollView style={{ flex: 1,paddingLeft: 10,paddingRight:10 , backgroundColor: "white"}} 
                        contentContainerStyle = {{alignItems: 'flex-start',width:"100%"}}>
        <View style = {{
            width: "100%",
            marginTop:50,
            height: 40,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 30,
            paddingRight: 20,
            // backgroundColor: "orange"
        }}>
            <SvgXml xml = {empty_avatar_svg} style = {{
                marginRight: 20,
            }}/> 
            <Text adjustsFontSizeToFit style = {{
                fontSize: 26,
                color: "#A6A6A6",
            }}>
                {user?.name}
            </Text>
        </View>
        <HeaderText> Biological Settings </HeaderText>
        <SettingsEntry name = "Diet Goals"  current = { getAPIHealthGoalName(user?.health_goal)} >
            
                {healthGoals.map( (healthGoal: APIHealthGoal) => {

                    return <OptionButtonBasic key = {healthGoal} name = {getAPIHealthGoalName(healthGoal)}  check = {healthGoal == user?.health_goal} onPress ={()=>{
                        setUser({
                            ...user,
                            health_goal: healthGoal,
                        })                        
                    }} />
                })}
        </SettingsEntry>
        <SettingsEntry name = "Activity Level"  current = { getAPIActivityLevelName(user?.activity_level)} >
            {activityLevels.map( (activityLevel : APIActivityLevel) => {
                
                return <OptionButtonActivityLevel key = {activityLevel} name = {getAPIActivityLevelName(activityLevel)} desc = {getAPIActivityLevelDescription(activityLevel)} check = {activityLevel == user?.activity_level} onPress ={()=>{
                    setUser({
                        ...user,
                        activity_level: activityLevel
                    })                        
                }} />
            })}
        </SettingsEntry>
        <SettingsEntry name = "Dietary Restrictions" width = {130} current = { user?.dietary_restrictions?.map(getAPIDietaryRestrictionName)?.join(", ")} > 
            {dietaryRestrictions.map((dietRestriction:APIDietaryRestriction)=>{
                return <OptionButtonSelection key = {dietRestriction} name = {getAPIDietaryRestrictionName(dietRestriction)} check = { (user?.dietary_restrictions ?? []).includes(dietRestriction)} onPress = {()=>{
                    let newRestrictions = []
                    if((user?.dietary_restrictions ?? []).includes(dietRestriction)){
                        newRestrictions = user?.dietary_restrictions.filter(el => el!= dietRestriction)
                    }else{
                        newRestrictions = [...user?.dietary_restrictions ?? [], dietRestriction]
                    }
                    setUser({
                        ...user,
                        dietary_restrictions: newRestrictions
                    })
                }}/>
            })
                
            }
        </SettingsEntry>

        <SettingsEntry name = "Food Allergies"  current = { user?.allergies.map(el => getAPIBaseAllergenName(el.name)).join(", ")} > 
            {baseAllergens.map(((allergen:APIBaseAllergen)=>{
                return <OptionButtonSelection key = {allergen} name = {getAPIBaseAllergenName(allergen)} check = {inAllergens(allergen)} onPress = {()=>{
                    let newAllergen = []
                    if(inAllergens(allergen)){
                        // remove
                        newAllergen = allergens.filter(el => el != allergen)                        
                    }else{
                        newAllergen = [...allergens, allergen]
                    }
                    function getId(allergenName){
                        for(const ingredient of (ingredients?? [])){
                            if(ingredient.name === allergenName) return ingredient.id
                        }
                        return null
                    }
                    const newData = newAllergen.map(el => {return {name: el, id : getId(el)}}).filter(el=> el.id !== null)
                    setUser({
                        ...user,
                        allergies: newData
                    })
                }}/>
            }))}
        </SettingsEntry>

        <HeaderText> Physical Settings </HeaderText>
        <SettingsEntry name = "Birthday" current = {user?.birthdate} open = {birthdateOpen} setOpen = {setBirthdateOpen}>
           
        </SettingsEntry>
        { birthdateOpen &&  
            <View style = {{
                width: "100%",
                marginLeft: 10,
                paddingLeft: 20,
                borderLeftWidth: 2,
                borderColor: "#EDEDED", 
                // backgroundColor:"orange"
                }}> 
                
                <DateTimePicker value = {stringToDate(user?.birthdate)} mode = "date" display = "calendar" onChange = {(event,date)=>{
                    // setShow(Platform.OS === 'ios');
                    setUser({
                        ...user,
                        birthdate: dateToString(date)
                    })
                }}/>
            </View>
        }

        <SettingsEntry name = "Sex" current = { capitalizeFirstLetter( user?.sex)} >
            <OptionButtonBasic name = "Male" check = { user?.sex === "male"} onPress = {()=>{
                setUser({
                    ...user,
                    sex: "male"
                })                
            }}/>
            <OptionButtonBasic name = "Female" check = { user?.sex === "female"} onPress = {()=>{
                setUser({
                    ...user,
                    sex: "female"
                })                
            }}/>
        </SettingsEntry>
        
        <SettingsEntry name = "Weight" current = {user?.weight+ " lbs"} >
            <NumberPlease pickerStyle={{
                    width: "100%",    
                }} 
                digits = {[{id:"weight", label: "lbs",min: 0,max:1000}]} values = {[{id: "weight" ,value:user?.weight}]} onChange= {(values)=>{
                setUser({   
                    ...user,
                    weight: values[0].value
                })
            }}/>
        </SettingsEntry>
        <SettingsEntry name = "Height" current = {user?.height+ " inches"} >
            <NumberPlease pickerStyle = {{
                    width :"100%"
                }}
                digits = {[{id:"height", label: "inches",min: 0,max:1000}]} values = {[{id: "height" ,value:user?.height}]} onChange= {(values)=>{
                setUser({   
                    ...user,
                    height: values[0].value
                })
            }}/>
        </SettingsEntry>
        
    </ScrollView>
}

export default Settings