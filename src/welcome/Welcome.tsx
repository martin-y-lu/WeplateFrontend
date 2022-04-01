import React, { useEffect, useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SvgXml } from "react-native-svg"
// import { arrow_svg, check_svg, selected_icon_svg, unselected_icon_svg } from '../settings/Settings';

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

export function BaseWelcome(props){
   return <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#ff7474', justifyContent: 'center' }}>
    {props?.body}
   <View style={{alignItems: 'left', margin: 15,paddingLeft:20,}}>
        {props.children}

   </View>
    <View pointerEvents="none" style = {{
        width:"100%",
        height:"100%",
        position:"absolute",
        top: 150, 
        left: -80,
     }}>
        <Image  source={require("../faded-backdrop.png")} style={styles.backdrop} /> 
        <Image source={require('../faded-backdrop2.png')} style={styles.backdropBottom} />
     </View>

</View> 
}
export const WelcomeButton = (props)=>{
    return <TouchableOpacity style = {{
        marginTop:30,
        marginLeft:"50%",
        backgroundColor:"white",
        borderRadius:10,
        width: 150,
        height: 40,
        justifyContent:"center",
        alignItems:"center",
    }}
    onPress = {props?.onPress}>
        <Text style = {{
           color:"#FA935B",
            fontWeight:"bold",
            fontSize: 20,
        }}>
            {props.children}
        </Text>
    </TouchableOpacity>
}
export const Welcome1 = ({navigation})=>{
    return <BaseWelcome>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.text}>We have a short questionnare for you to fill out in order to fully customize your diet based on your needs.</Text>
        <WelcomeButton onPress = {()=>{
                navigation.navigate("Welcome2")
            }}> Next </WelcomeButton>
    </BaseWelcome>
}

function DropButton(props){
    const [open,setOpen] = useState(false)
    return <>
        <TouchableOpacity style = {{
            marginTop:6,
            width: "100%",
            height: 50,
            flexDirection:"row",
            paddingRight:30,
        }} onPress = {()=>{
            setOpen(!open)
        }}>
           <View style = {{
               flex: 1,
               backgroundColor:"white",
               borderTopLeftRadius: 5,
               borderBottomLeftRadius: 5,
               flexDirection: "row",
               paddingLeft:15,
                alignItems:"center",
           }}>
               <Text style = {{
                   color  : "#B1B1B1",
                   fontSize: 18,
               }}>
                   {props.name??""}
               </Text>

               <Text style = {{
                   marginLeft:'auto',
                   color  : "#B1B1B1",
                   fontSize: 18,
                   marginRight: 20,
               }}>
                   {props?.value??""}
               </Text>

           </View>
           <View style = {{
               marginLeft: 6,
               height:"100%",
               aspectRatio:1,
               backgroundColor:"white",
               borderTopRightRadius: 5,
               borderBottomRightRadius: 5,
               justifyContent:"center",
               alignItems:"center"
           }}>
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
           </View>
        </TouchableOpacity>
        {open && 
            props.children   
        }
    </>
}
import { Dimensions } from "react-native";
import NumberPlease from "react-native-number-please"
import DateTimePicker from '@react-native-community/datetimepicker';
import { stringToDate, dateToString } from '../dashboard/state';
import { valueXY } from '../dashboard/tooltip/components/types';
import { useRecoilState, useRecoilValue } from "recoil"
import { ingredientsAtom, usersAtom, useUserActions } from "../utils/session/useUserActions"
import { APIHealthGoal, getAPIHealthGoalName, healthGoals, activityLevels, APIActivityLevel, getAPIActivityLevelName, getAPIActivityLevelDescription, APIEveryMeal, everyMeals, getAPIEveryMealName, dietaryRestrictions, APIDietaryRestriction, getAPIDietaryRestrictionName, baseAllergens, APIBaseAllergen, getAPIBaseAllergenName } from '../utils/session/apiTypes';
import { usePersistentAtom } from '../utils/state/userState';
function PickButton(props){
    const width = Dimensions.get("window").width   -100
    const check = props.check??false;
    return <TouchableOpacity style = {{
        width,
        marginLeft: 20,
        backgroundColor:"white",
        marginTop:6,
        height: 40,
        borderRadius: 5,

        flexDirection:"row",
        alignItems: "center",
        paddingLeft: 10,
    }}
        onPress = {props?.onPress}
    >
        <Text style = {{}}>
                {props?.name ?? ""}
        </Text>
        {
                check ? 
                <View style = {{
                    marginRight: 15,
                    marginLeft:"auto"
                }}>
                    <SvgXml xml = {check_svg}/>
                </View> : null
            }   
    </TouchableOpacity>
}

export const Welcome2 = ({navigation})=>{
    const [user,_setUser] = useRecoilState(usersAtom)
    const width = Dimensions.get("window").width   -100
    const [sex,setSex] = useState(null as "Male"|"Female");
    const [birthdate,setBirthDate] = useState(null)
    const [height,setHeight] = useState(null)
    const [weight,setWeight] = useState(null as number)
    const inchesToFeet = (inches) =>{
        const ft =  Math.floor(inches/12)
        const inc = inches%12
        return [ft, inc]
    }

    const feetToInches = (feet, inches) =>{
        return feet*12 + inches
    }

    const initialHeight = [
        {id:"feet", value: inchesToFeet(60)[0]},
        {id:"inches", value: Math.floor(inchesToFeet(60)[1])}
    ];

    const [heightValue, setHeightValue] = useState(initialHeight)
    const heightEntry = [
        {id: "feet", label:'\'', min: 0, max:8},
        {id: "inches", label:'\"', min: 0, max:11}
    ]

    var twentyYearsAgo = new Date();
    twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() -20);

    return <BaseWelcome>
        <Text style={styles.sub_title}>Part 1:</Text>
        <Text style={styles.sub_title2}>Biological Information</Text>
        <View style = {{width: 40,borderTopWidth:4,borderColor:"white",marginTop:5,marginBottom:5}}/>
        <DropButton name = "Biological Sex" value = {sex}> 
            <PickButton name = "Male" check = {sex === "Male"} onPress = {()=>{ setSex("Male")}}/>
            <PickButton name = "Female" check = {sex === "Female"} onPress = {()=>{ setSex("Female")}}/>
        </DropButton>
        <DropButton name = "Birthday" value = {birthdate}>
            <View style = {{
                width: width,
                height: 50,
                marginLeft: 20,
                backgroundColor:"white",
                marginTop:6,
                // height: 40,
                borderRadius: 5,
                paddingLeft:10,
            }}>
                <DateTimePicker style = {{
                    height: 50,
                }} value = {stringToDate(birthdate) ?? twentyYearsAgo} mode = "date" display = "calendar" onChange = {(event,date)=>{
                    setBirthDate(dateToString(date))
                }}/>
            </View>
        </DropButton>
        {/* <DropButton name = "Height" value = {height ? height + " cm" : null}>         
            <   NumberPlease pickerStyle = {{
                width :"100%"
                }}
                digits = {[{id:"height", label: "cm",min: 0,max:1000}]} values = {[{id: "height" ,value:height ??50}]} onChange= {(values)=>{
                    setHeight(values[0].value)
            }}/>
        </DropButton> */}
        <DropButton name = "Height" value = {height ? ( inchesToFeet(height)[0] + '\''+ Math.floor(inchesToFeet(height)[1])+'\"') : null}>         
        <View style = {{
                width: width,
                // height: 50,
                marginLeft: 20,
                backgroundColor:"white",
                marginTop:6,
                // height: 40,
                borderRadius: 5,
                paddingLeft: "20%",
            }}>

            <NumberPlease pickerStyle={{ width: "50%"}} 
                            digits = {heightEntry} values = {heightValue} onChange= {(values)=>{
                                setHeightValue(values)
                                setHeight(feetToInches(values[0].value, values[1].value))
                            }}/>
                            </View>
        </DropButton>
        
        <DropButton name = "Weight" value = {weight ? weight + " lbs" : null}>   
        <View style = {{
                width: width,
                // height: 50,
                marginLeft: 20,
                backgroundColor:"white",
                marginTop:6,
                // height: 40,
                borderRadius: 5,
                paddingLeft: "20%",
            }}>
            <NumberPlease pickerStyle={{
                width: "100%",    
            }} 
                digits = {[{id:"weight", label: "lbs",min: 0,max:1000}]} values = {[{id: "weight" ,value:weight ?? 140}]} onChange= {(values)=>{
                    setWeight(values[0].value)
                }}/>
            </View>      
        </DropButton>

        {   sex!== null && birthdate !== null && height !== null && weight != null &&
            <WelcomeButton onPress = {()=>{
                _setUser({
                    ...user,
                    height,
                    weight,
                    sex: sex.toLowerCase() as "male" | "female",
                    birthdate,
                })

                navigation.navigate("Welcome3")
            }}> Continue </WelcomeButton>
        }

    </BaseWelcome>
}

function RadioButton(props){
    const [user,_setUser] = useRecoilState(usersAtom)
    const check :boolean = props.check  ?? true
    const width = Dimensions.get("window").width   -100
    const condensed = props?.desc?.length> 10 ?? false
    return <TouchableOpacity style = {{
        height: 40,
        width,
        marginBottom: condensed ? 5: 0,
        marginTop: condensed ? 5: 0,
        // backgroundColor: "orange",
        flexDirection:"row",
        alignItems: "center",
        paddingLeft:15,
    }} onPress = {props?.onPress}
    >
        <SvgXml xml = {check ? selected_icon_svg : unselected_icon_svg} stroke = "white" fill = {check ? "white" :"none"}/>
        <Text style = {{
            color: "white",
            marginLeft: 10,
            fontSize : 16,
        }}>
            {props.name}
        </Text>
        <Text style = {{
            color: "white",
            marginLeft: "auto",
            fontSize : condensed? 12 : 16,
        }}>
            {props.desc}
        </Text>
    </TouchableOpacity>
}
export const Welcome3 = ({navigation})=>{
    const [user,_setUser] = useRecoilState(usersAtom)
    const [goal,setGoal] = useState(null as APIHealthGoal)
   return <BaseWelcome>
        <Text style={styles.sub_title}>Part 2:</Text>
        <Text style={styles.sub_title2}>Personal Goals</Text>
        <View style = {{width: 40,borderTopWidth:4,borderColor:"white",marginTop:5,marginBottom:5}}/>
        <Text style={styles.sub_title2}>Is there any specific goal you wish to achieve with your diet?</Text>
        { healthGoals.map((healthGoal:APIHealthGoal) => {
            return <RadioButton key = {healthGoal} name = {getAPIHealthGoalName(healthGoal)} check = { healthGoal == goal} onPress = {()=>{
                setGoal(healthGoal)
            }}/>
        })}
        { goal !== null && <WelcomeButton onPress = {()=>{
            _setUser({
                ...user,
                health_goal: goal
            })
            navigation.navigate("Welcome4")
        }}>
                Continue
            </WelcomeButton>}
   </BaseWelcome>
}
export const Welcome4 = ({navigation})=>{
    const [user,_setUser] = useRecoilState(usersAtom)
    const [level,setLevel] = useState(null as APIActivityLevel)
   return <BaseWelcome>
        <Text style={styles.sub_title}>Part 3:</Text>
        <Text style={styles.sub_title2}>Activity Level</Text>
        <View style = {{width: 40,borderTopWidth:4,borderColor:"white",marginTop:5,marginBottom:5}}/>
        <Text style={styles.sub_title2}>What's your activity level per day?</Text>
        {   activityLevels.map((activityLevel:APIActivityLevel)=>{
                return <RadioButton key = {activityLevel} name = {getAPIActivityLevelName(activityLevel)} desc = {getAPIActivityLevelDescription(activityLevel)} check = {activityLevel == level} onPress = {()=>{
                    setLevel(activityLevel)
                }}/>
        })}
        { level !== null && <WelcomeButton onPress = {()=>{
            _setUser({
                ...user,
                activity_level: level
            })
            navigation.navigate("Welcome5")
        }}>
                Continue
            </WelcomeButton>}
        
   </BaseWelcome>
}
export const Welcome5 = ({navigation})=>{
    const [user,_setUser] = useRecoilState(usersAtom)
    const [meals,setMeals] = useState([] as APIEveryMeal[])
    
   return <BaseWelcome>
            <Text style={styles.sub_title}>Part 4:</Text>
            <Text style={styles.sub_title2}>Daily Meals</Text>
            <View style = {{width: 40,borderTopWidth:4,borderColor:"white",marginTop:5,marginBottom:5}}/>
            <Text style={styles.sub_title2}>From the following, select the meals that you normally have every day.</Text>
            { everyMeals.map( (everyMeal: APIEveryMeal)=>{
                return <RadioButton key = {everyMeal} name = {getAPIEveryMealName(everyMeal)} check = {meals.includes(everyMeal)} onPress = {()=>{
                    if(meals.includes(everyMeal)){
                        setMeals(meals.filter(meal => meal !== everyMeal))
                    }else{
                        setMeals([...meals,everyMeal])
                    }
                }}/>
            })
        }

        { meals.length > 0 && <WelcomeButton onPress = {()=>{
            _setUser({
                ...user,
                meals: meals
            })
            navigation.navigate("Welcome6")
        }}>
                Continue
            </WelcomeButton>}
    </BaseWelcome>
}
export const Welcome6 = ({navigation})=>{
    const [user,_setUser] = useRecoilState(usersAtom)
    const [mealLength,setMealLength] = useState(40 as number)
   return <BaseWelcome>
        <Text style={styles.sub_title}>Part 5:</Text>
        <Text style={styles.sub_title2}>Meal Length</Text>
        <View style = {{width: 40,borderTopWidth:4,borderColor:"white",marginTop:5,marginBottom:5}}/>
        <Text style={styles.sub_title2}>How long do you generally take for each meal?</Text>
        <NumberPlease pickerStyle={{
                    width: "100%",    
                }} 
                digits = {[{id:"mealLength", label: "minutes",min: 10,max:120, step: 5}]} values = {[{id: "mealLength" ,value:mealLength ?? 40}]} onChange= {(values)=>{
                    setMealLength(values[0].value)
        }}/>
        { mealLength != null && <WelcomeButton onPress = {()=>{
            _setUser({
                ...user,
                meal_length: mealLength
            })
            navigation.navigate("Welcome7")
        }}>
            Continue    
        </WelcomeButton>}
    </BaseWelcome>
}
export const Welcome7 = ({navigation})=>{
    const [user,_setUser] = useRecoilState(usersAtom)
    const [restrictions,setRestrictions] = useState([] as APIDietaryRestriction[])
    
   return <BaseWelcome>
            <Text style={styles.sub_title}>Part 6:</Text>
            <Text style={styles.sub_title2}>Dietary Restrictions</Text>
            <View style = {{width: 40,borderTopWidth:4,borderColor:"white",marginTop:5,marginBottom:5}}/>
            <Text style={styles.sub_title2}> Which restrictions do you adhere to?</Text>
            { dietaryRestrictions.map( (restriction: APIDietaryRestriction)=>{
                return <RadioButton key = {restriction} name = {getAPIDietaryRestrictionName(restriction)} check = {restrictions.includes(restriction)} onPress = {()=>{
                    if(restrictions.includes(restriction)){
                        setRestrictions(restrictions.filter(restr => restr !== restriction))
                    }else{
                        setRestrictions([...restrictions,restriction])
                    }
                }}/>
            })
        }

        { true && <WelcomeButton onPress = {()=>{
            _setUser({
                ...user,
                dietary_restrictions:restrictions
            })
            navigation.navigate("Welcome8")
        }}>
                Continue
            </WelcomeButton>}
    </BaseWelcome>
}
export const Welcome8 = ({navigation})=>{
    const userActions = useUserActions()
    const ingredients = useRecoilValue(ingredientsAtom)
    useEffect(()=>{
        const getIngredients = async function(){
            await userActions.getIngredients()
        }
        getIngredients()
    },[])
    const [user,_setUser] = useRecoilState(usersAtom)
    const [allergens,setAllergens] = useState([] as APIBaseAllergen[])
    
   return <BaseWelcome>
            <Text style={styles.sub_title}>Part 7:</Text>
            <Text style={styles.sub_title2}>Allergies</Text>
            <View style = {{width: 40,borderTopWidth:4,borderColor:"white",marginTop:5,marginBottom:5}}/>
            {/* <Text style={styles.sub_title2}>P.</Text> */}
            { baseAllergens.map( (allergen: APIBaseAllergen)=>{
                return <RadioButton key = {allergen} name = {getAPIBaseAllergenName(allergen)} check = {allergens.includes(allergen)} onPress = {()=>{
                    if(allergens.includes(allergen)){
                        setAllergens(allergens.filter(aller => aller !== allergen))
                    }else{
                        setAllergens([...allergens,allergen])
                    }
                }}/>
            })
        }

        { true && <WelcomeButton onPress = {()=>{
            console.log({ingredients})
             const newData = allergens.map(el => {return {name: el, id : getId(el)}}).filter(el=> el.id !== null)
             function getId(allergenName){
                for(const ingredient of (ingredients ?? [])){
                    if(ingredient.name === allergenName) return ingredient.id
                }
                return null
            }
            _setUser({
                ...user,
                allergies: newData
            })
            navigation.navigate("Welcome9")
        }}>
                Continue
            </WelcomeButton>}
    </BaseWelcome>
}
export const Welcome9 = ({navigation})=>{
    const [user,_setUser] = useRecoilState(usersAtom)
    const [gradYear,setGradYear] = useState(2025)
   return <BaseWelcome>
        <Text style={styles.sub_title}>Part 8:</Text>
        <Text style={styles.sub_title2}>More about you</Text>
        <View style = {{width: 40,borderTopWidth:4,borderColor:"white",marginTop:5,marginBottom:5}}/>
        <Text style={styles.sub_title2}>What is your graduation year? </Text>
        <NumberPlease pickerStyle={{
                    width: "100%",    
                }} 
                digits = {[{id:"gradYear",min: 1950,max:2050}]} values = {[{id: "gradYear" ,value:gradYear ?? 2025}]} onChange= {(values)=>{
                    setGradYear(values[0].value)
        }}/>
        { gradYear != null && <WelcomeButton onPress = {()=>{
            _setUser({
                ...user,
                grad_year: gradYear
            })
            navigation.navigate("Welcome10")
        }}>
            Continue    
        </WelcomeButton>}
    </BaseWelcome> 
}
export const Welcome10 = ({navigation})=>{
    const userActions = useUserActions()
    const [user,_setUser] = useRecoilState(usersAtom)
    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom() as any
    useEffect(()=>{
        if(navigation.isFocused()){
            const register = (async ()=>{
                console.log({user})
                try{
                    console.log("registering");
                    const res  = await userActions.registerUser({
                        ...user,
                        username: persistentState.email,
                        password: persistentState.password,
                    })
                    console.log({res})
                    await setPersistentState({
                        ...persistentState,
                        register: false
                    })
                    await userActions.login(persistentState.email,persistentState.password) 
                    console.log("sending verification email")
                    userActions.verifyEmail(persistentState.email);
                }catch(e){
                    console.log(e)
                    await userActions.logout()
                    navigation.navigate("Login")
                }
            })
            register();
        }       
    },[navigation.isFocused()]);
    const [failMessage, setFailMessage] = useState("");
    return <BaseWelcome>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.text}> We sent an email to {persistentState.email} to verify your email address and activate your account.
         </Text>
         <Text style = {[styles.text, { 
            marginTop: 30,
         }]}>
            Continue after you activated your account.
         </Text>
         <Text style = {[styles.text, { 
            marginTop: 30,
            color: "white",
            fontWeight:"bold",
            fontStyle: "italic",
         }]}>
            {failMessage}
         </Text>
        <WelcomeButton onPress = {()=>{
                const checkVerify = (async ()=>{
                    const isVerified = await userActions.isVerified()
                    console.log({isVerified})
                    if(isVerified){
                        await setPersistentState({
                            ...persistentState,
                            verified: true,
                        })
                        navigation.navigate("Welcome11");
                    }else{
                        setFailMessage("Open the link sent in the email to verify your account.")
                    }
                })
                checkVerify()
            }}> Continue </WelcomeButton>
    </BaseWelcome>
}
export const Welcome11 = ({navigation})=>{
    const userActions = useUserActions()
    const [user,_setUser] = useRecoilState(usersAtom)
    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom() as any
    return <BaseWelcome>
        <Text style={styles.title}>Finished!</Text>
        <Text style={styles.text}>We will use this information to craft a well balanced diet, tailored towards your needs.</Text>
        <WelcomeButton onPress = {()=>{
                navigation.navigate("SidebarNavigable",{screen:"Dashboard"})
            }}> Continue </WelcomeButton>
    </BaseWelcome>
}


const styles = StyleSheet.create({

    title: {
        color: 'white',
        fontWeight: '800',
        fontSize: 50
    },
    sub_title: {
        color: 'white',
        fontWeight: '800',
        fontSize: 40
    },
    sub_title2: {
        color: 'white',
        fontWeight: '800',
        fontSize: 20
    },

    text: {
        color: 'white',
        fontSize: 18,
    },

    backdrop: {
        position: 'absolute',
        top: -750,

    },

    backdropBottom: {
        position: 'absolute',
        top: 270,

    }

})