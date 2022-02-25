import React, { useEffect, useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SvgXml } from "react-native-svg"
import { arrow_svg, check_svg, selected_icon_svg, unselected_icon_svg } from '../settings/Settings';
function BaseWelcome(props){
   return <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#ff7474', justifyContent: 'center' }}>
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
const WelcomeButton = (props)=>{
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
import { APIHealthGoal, getAPIHealthGoalName, healthGoals, activityLevels, APIActivityLevel, getAPIActivityLevelName, getAPIActivityLevelDescription, APIEveryMeal, everyMeals, getAPIEveryMealName, dietaryRestrictions, APIDietaryRestriction, getAPIDietaryRestictionName, baseAllergens, APIBaseAllergen, getAPIBaseAllergenName } from '../utils/session/apiTypes';
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
            }}>
                <DateTimePicker style = {{
                    height: 50,
                }} value = {stringToDate(birthdate) ?? new Date()} mode = "date" display = "calendar" onChange = {(event,date)=>{
                    setBirthDate(dateToString(date))
                }}/>
            </View>
        </DropButton>
        <DropButton name = "Height" value = {height ? height + " cm" : null}>         
            <   NumberPlease pickerStyle = {{
                width :"100%"
                }}
                digits = {[{id:"height", label: "cm",min: 0,max:1000}]} values = {[{id: "height" ,value:height ??50}]} onChange= {(values)=>{
                    setHeight(values[0].value)
            }}/>
        </DropButton>
        <DropButton name = "Weight" value = {weight ? weight + " kg" : null}>         
            <NumberPlease pickerStyle={{
                    width: "100%",    
                }} 
                digits = {[{id:"weight", label: "kg",min: 0,max:1000}]} values = {[{id: "weight" ,value:weight ?? 140}]} onChange= {(values)=>{
                    setWeight(values[0].value)
            }}/>
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
    return <TouchableOpacity style = {{
        height: 40,
        width,
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
            fontSize : 16,
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
                return <RadioButton key = {restriction} name = {getAPIDietaryRestictionName(restriction)} check = {restrictions.includes(restriction)} onPress = {()=>{
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
    return <BaseWelcome>
        <Text style={styles.title}>Finished!</Text>
        <Text style={styles.text}>We will use this information to craft a well balanced diet, tailored towards your needs.</Text>
        <WelcomeButton onPress = {()=>{
                const register = (async ()=>{
                    console.log({user})
                    try{
                        const res  = await userActions.registerUser({
                            ...user,
                            username: persistentState.email,
                            password: persistentState.password,
                        })
                        console.log({res})
                        navigation.navigate("SidebarNavigable",{screen:"Dashboard"})
                    }catch(e){
                        console.log(e)
                        navigation.navigate("Login")
                    }
                })
                register()
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