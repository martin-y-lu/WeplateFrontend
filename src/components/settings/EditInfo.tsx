import React, {useState,useEffect} from 'react'
import { View,Text,Button, Image,StyleSheet, TextInput,SafeAreaView,Dimensions } from "react-native"
import { useRecoilState, useRecoilValue,atom } from "recoil"
import { SvgXml } from "react-native-svg"
import {Rname,RdietGoals,RactivityLevel,RdietaryRestrictions,RfoodAllergies,Rbirthday,Rsex,Rweight,Rheight ,infoState} from './state'
import {editInfoState} from './state2'
import { TouchableOpacity } from "react-native-gesture-handler"
import DateTimePicker from '@react-native-community/datetimepicker';
import { dateToString, stringToDate } from "../state";
import { ingredientsAtom, usersAtom, useUserActions } from "../../utils/session/useUserActions";
import NumberPlease from "react-native-number-please";
import { baseAllergens, dietaryRestrictions, getAPIBaseAllergenName, APIDietaryRestriction, getAPIDietaryRestrictionName, APIBaseAllergen } from '../../utils/session/apiTypes';
import {authAtom} from '../../utils/session/useFetchWrapper'
import { useLogin } from '../../utils/session/session'
import { SHADOW_STYLE } from '../../utils/Loading';
import { MIN_PASSWORD_LENGTH } from '../login/Login';
import { usePersistentAtom } from '../../utils/state/userState'



const EditDietGoals = () => {
    const checkmark = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.0331 12.3893C6.26619 12.6194 6.65382 12.5669 6.81744 12.2832L13.621 0.487082C13.7706 0.227812 14.1128 0.157117 14.3529 0.33593L16.2254 1.73096C16.4306 1.88387 16.4872 2.16711 16.3566 2.3872L7.40846 17.4565C7.24372 17.7339 6.86325 17.785 6.63117 17.5609L0.325091 11.4698C0.140486 11.2915 0.120868 11.0024 0.279695 10.8008L1.7462 8.93922C1.93073 8.70499 2.27795 8.6833 2.49019 8.89276L6.0331 12.3893Z" fill="#DDDDDD"/>
    </svg>
    `
    const infoStates = useRecoilValue(infoState);
    const [selectedBox, changeSelectedBox] = useRecoilState(RdietGoals)
    return(
        <View style={styles.innerContainer} > 
            <Text style={styles.header}>Diet Goals</Text>
            <TouchableOpacity onPress = {()=> changeSelectedBox("improve_health")}>
                <View style={[{borderTopWidth:1},styles.seperator]}> 
                    <Text style = {styles.feildName}>Improve Health</Text>
                    {selectedBox == "improve_health" &&
                        <SvgXml style = {styles.triangle} xml = {checkmark}/>
                    }
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {()=> changeSelectedBox("lose_weight")}>
                <View style={styles.seperator}> 
                    <Text style = {styles.feildName}>Lose Weight</Text>
                    {selectedBox == "lose_weight" &&
                        <SvgXml style = {styles.triangle} xml = {checkmark}/>
                    }
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {()=> changeSelectedBox("build_muscle")}>
                <View style={styles.seperator}> 
                    <Text style = {styles.feildName}>Build Muscle</Text>
                    {selectedBox == "build_muscle" &&
                        <SvgXml style = {styles.triangle} xml = {checkmark}/>
                    }
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {()=> changeSelectedBox("athletic_performance")}>
                <View style={styles.seperator}> 
                    <Text style = {styles.feildName}>Athletic Performance</Text>
                    {selectedBox == "athletic_performance" &&
                        <SvgXml style = {styles.triangle} xml = {checkmark}/>
                    }
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {()=> changeSelectedBox("improve_body_tone")}>
                <View style={styles.seperator}> 
                    <Text style = {styles.feildName}>Improve Body Tone</Text>
                    {selectedBox == "improve_body_tone" &&
                        <SvgXml style = {styles.triangle} xml = {checkmark}/>
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}

const EditActivityLevel = () => {
    const checkmark = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.0331 12.3893C6.26619 12.6194 6.65382 12.5669 6.81744 12.2832L13.621 0.487082C13.7706 0.227812 14.1128 0.157117 14.3529 0.33593L16.2254 1.73096C16.4306 1.88387 16.4872 2.16711 16.3566 2.3872L7.40846 17.4565C7.24372 17.7339 6.86325 17.785 6.63117 17.5609L0.325091 11.4698C0.140486 11.2915 0.120868 11.0024 0.279695 10.8008L1.7462 8.93922C1.93073 8.70499 2.27795 8.6833 2.49019 8.89276L6.0331 12.3893Z" fill="#DDDDDD"/>
    </svg>
    `
    const checkmarkInvisible = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.0331 12.3893C6.26619 12.6194 6.65382 12.5669 6.81744 12.2832L13.621 0.487082C13.7706 0.227812 14.1128 0.157117 14.3529 0.33593L16.2254 1.73096C16.4306 1.88387 16.4872 2.16711 16.3566 2.3872L7.40846 17.4565C7.24372 17.7339 6.86325 17.785 6.63117 17.5609L0.325091 11.4698C0.140486 11.2915 0.120868 11.0024 0.279695 10.8008L1.7462 8.93922C1.93073 8.70499 2.27795 8.6833 2.49019 8.89276L6.0331 12.3893Z" fill="#FFFFFF"/>
    </svg>
    `
    const infoStates = useRecoilValue(infoState);
    const [selectedBox, changeSelectedBox] = useRecoilState(RactivityLevel)

    return(
        <View style={styles.innerContainer} > 
            <Text style={styles.header}>Activity Level</Text>

            <TouchableOpacity onPress = {()=> changeSelectedBox("mild")}>
                <View style={[{borderTopWidth:1},styles.seperator]}> 
                    <Text style = {styles.feildName2}>Mild</Text>
                    <Text style = {styles.feildDescription}>20-30 minutes exercise{'\n'}1-2 days a week</Text>
                    {selectedBox == "mild" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmark}/>
                    }
                    {selectedBox != "mild" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmarkInvisible}/>
                    }
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {()=> changeSelectedBox("moderate")}>
                <View style={styles.seperator}> 
                    <Text style = {styles.feildName2}>Moderate</Text>
                    <Text style = {styles.feildDescription}>30-60 minutes exercise{'\n'}2-4 days a week</Text>
                    {selectedBox == "moderate" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmark}/>
                    }
                    {selectedBox != "moderate" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmarkInvisible}/> 
                    
                    }
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {()=> changeSelectedBox("heavy")}>
                <View style={styles.seperator}> 
                    <Text style = {styles.feildName2}>Heavy</Text>
                    <Text style = {styles.feildDescription}>60+ minutes exercise{'\n'}5-6 days a week</Text>
                    {selectedBox == "heavy" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmark}/>
                    }
                    {selectedBox != "heavy" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmarkInvisible}/> 
                    
                    }
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress = {()=> changeSelectedBox("extreme")}>
                <View style={styles.seperator}> 
                    <Text style = {styles.feildName2}>Extreme</Text>
                    <Text style = {styles.feildDescription}>120+ minutes exercise{'\n'}7 days a week</Text>
                    {selectedBox == "extreme" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmark}/>
                    }
                    {selectedBox != "extreme" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmarkInvisible}/>
                    
                    }
                </View>
            </TouchableOpacity>

        </View>
    )
}

const EditDietaryRestrictions = () => {
    const checkmark = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.0331 12.3893C6.26619 12.6194 6.65382 12.5669 6.81744 12.2832L13.621 0.487082C13.7706 0.227812 14.1128 0.157117 14.3529 0.33593L16.2254 1.73096C16.4306 1.88387 16.4872 2.16711 16.3566 2.3872L7.40846 17.4565C7.24372 17.7339 6.86325 17.785 6.63117 17.5609L0.325091 11.4698C0.140486 11.2915 0.120868 11.0024 0.279695 10.8008L1.7462 8.93922C1.93073 8.70499 2.27795 8.6833 2.49019 8.89276L6.0331 12.3893Z" fill="#DDDDDD"/>
    </svg>
    `
    const infoStates = useRecoilValue(infoState);
    const [selectedDietRestrictions, changeSelectedDietRestrictions] = useRecoilState(RdietaryRestrictions)
    const selected = (restriction) => {
        for(let i = 0; i < selectedDietRestrictions.length; i++){
            if (selectedDietRestrictions[i] == restriction){
                return true
            }
        }
        return false
    }
    const toggle = (restriction) => {
        var temp = [...selectedDietRestrictions]
        for(let i = 0; i < temp.length; i++){
            if (temp[i] == restriction){
                temp.splice(i,1)
                changeSelectedDietRestrictions(temp)
                console.log(selectedDietRestrictions)
                return
            }
        }
        temp.push(restriction)
        changeSelectedDietRestrictions(temp)
        console.log(selectedDietRestrictions) 
    }
    return(
        <View style={styles.innerContainer}> 
            <Text style={styles.header}>Dietary Restictions</Text>
            <Text style={styles.subheader}>Select all that apply</Text>
            {
                dietaryRestrictions.map((dietaryRestriction:APIDietaryRestriction)=>{
                return <View key = {dietaryRestriction} style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle(dietaryRestriction)}>
                        <View style= {styles.checkbox} > 
                            {selected(dietaryRestriction) &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>{getAPIDietaryRestrictionName(dietaryRestriction)}</Text>
                    </TouchableOpacity>
                </View>
                })
            }
                {/* <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Vegan")}>
                        <View style= {styles.checkbox} > 
                            {selected('Vegan') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Vegan</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Lactose Intolerant")}>
                        <View style= {styles.checkbox} > 
                            {selected('Lactose Intolerant') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Lactose Intolerant</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Kosher")}>
                        <View style= {styles.checkbox} > 
                            {selected('Kosher') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Kosher</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Halal")}>
                        <View style= {styles.checkbox} > 
                            {selected('Halal') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Halal</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Gluten Free")}>
                        <View style= {styles.checkbox} > 
                            {selected('Gluten Free') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Gluten Free</Text>
                    </TouchableOpacity>
                </View> */}
        </View>
    )
}

const EditFoodAllergies = ({navigation}) => {
    const checkmark = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.0331 12.3893C6.26619 12.6194 6.65382 12.5669 6.81744 12.2832L13.621 0.487082C13.7706 0.227812 14.1128 0.157117 14.3529 0.33593L16.2254 1.73096C16.4306 1.88387 16.4872 2.16711 16.3566 2.3872L7.40846 17.4565C7.24372 17.7339 6.86325 17.785 6.63117 17.5609L0.325091 11.4698C0.140486 11.2915 0.120868 11.0024 0.279695 10.8008L1.7462 8.93922C1.93073 8.70499 2.27795 8.6833 2.49019 8.89276L6.0331 12.3893Z" fill="#DDDDDD"/>
    </svg>
    `
    const infoStates = useRecoilValue(infoState);
    const [selectedFoodAllergies, changeSelectedFoodAllergies] = useRecoilState(RfoodAllergies)
    const selected = (allergy) => {
        for(let i = 0; i < selectedFoodAllergies.length; i++){
            if (selectedFoodAllergies[i] == allergy){
                return true
            }
        }
        return false
    }
    const toggle = (allergy) => {
        var temp = [...selectedFoodAllergies]
        for(let i = 0; i < temp.length; i++){
            if (temp[i] == allergy){
                temp.splice(i,1)
                changeSelectedFoodAllergies(temp)
                return
            }
        }
        temp.push(allergy)
        changeSelectedFoodAllergies(temp)
    }
    return(
        <View style={styles.innerContainer}> 
            <Text style={styles.header}>Allergens</Text>
            <Text style={styles.subheader}>Select all that apply</Text>
                {/* <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Peanuts")}>
                        <View style= {styles.checkbox} > 
                            {selected('Peanuts') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Peanuts</Text>
                    </TouchableOpacity>
                </View> */}
                {baseAllergens.map(((allergen:APIBaseAllergen)=>{
                return  <View key = {allergen} style={styles.checkboxSeperator}>
                        <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle(allergen)}>
                            <View style= {styles.checkbox} > 
                                {selected(allergen) &&
                                        <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                    }
                            </View>
                            <Text style = {styles.feildName}>{getAPIBaseAllergenName(allergen)}</Text>
                        </TouchableOpacity>
                    </View>
                    
                }))}
                {/* <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Tree Nuts")}>
                        <View style= {styles.checkbox} > 
                            {selected('Tree Nuts') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Tree Nuts</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Eggs")}>
                        <View style= {styles.checkbox} > 
                            {selected('Eggs') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Eggs</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Soy")}>
                        <View style= {styles.checkbox} > 
                            {selected('Soy') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Soy</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Wheat")}>
                        <View style= {styles.checkbox} > 
                            {selected('Wheat') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Wheat</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Fish")}>
                        <View style= {styles.checkbox} > 
                            {selected('Fish') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Fish</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Shellfish")}>
                        <View style= {styles.checkbox} > 
                            {selected('Shellfish') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Shellfish</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Corn")}>
                        <View style= {styles.checkbox} > 
                            {selected('Corn') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Corn</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkboxSeperator}>
                    <TouchableOpacity style = {{flexDirection:'row'}} onPress = {()=>toggle("Gelatin")}>
                        <View style= {styles.checkbox} > 
                            {selected('Gelatin') &&
                                    <SvgXml style = {styles.innerCheckmark} xml = {checkmark}/>
                                }
                        </View>
                        <Text style = {styles.feildName}>Gelatin</Text>
                    </TouchableOpacity>
                </View> */}
        </View>
    )
}

const EditBirthday = () => {
    const [user,_setUser] = useRecoilState(usersAtom)
    const [birthdate, setBirthday] = useRecoilState(Rbirthday);
    // const [showPicker, setShowPicker] = useState(false); 
    const showPicker = true;
    const dateToPrettyDate = (date) =>{
        const [year,month,day] = date.split('-')
        const monthDict = {
            '01': 'January',
            '02': 'February',
            '03': 'March',
            '04': 'April',
            '05': 'May',
            '06': 'June',
            '07': 'July',
            '08': 'August',
            '09': 'September',
            '10': 'October',
            '11': 'November',
            '12': 'December'
        }

        return monthDict[month] +' '+ parseInt(day) +', ' + year    
    }
    const backArrow = `<svg width="19" height="29" viewBox="0 0 19 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.17044 14.4243C8.02856 14.6022 8.02473 14.8535 8.16112 15.0357L17.8882 28.0273C18.1371 28.3598 17.8956 28.8332 17.4803 28.8269L10.9852 28.7283C10.8303 28.7259 10.6853 28.6519 10.5925 28.528L0.402676 14.9175C0.266292 14.7353 0.270122 14.484 0.411996 14.3061L11.0122 1.01214C11.1088 0.891069 11.256 0.821559 11.4108 0.823916L17.9056 0.922844C18.3209 0.92917 18.5478 1.40976 18.2889 1.7345L8.17044 14.4243Z" fill="#A4A4A4"/>
    </svg>`
    return(
        <View style={styles.innerContainer} > 
            <Text style={styles.header}>Birthday</Text>
            <View style = {{width:'100%',height:'92%',backgroundColor:'white',flexDirection:'column',justifyContent:'space-between', alignItems:'center'}}>
                <TouchableOpacity style = {{width:Dimensions.get('window').width}} >
                <View style = {[styles.seperator, {borderTopWidth:1,marginHorizontal:10, justifyContent:'center'}]}>
                    <Text style={{color:'#A6A6A6', fontSize:20}}>{dateToPrettyDate(birthdate)}</Text>
                </View>
                </TouchableOpacity>
                {showPicker &&
                <View style = {{height:300, width:'100%', backgroundColor:'#EDEDED', alignItems:'center'}}>
                    <DateTimePicker style= {{height:300, backgroundColor:'#EDEDED', width:300, alignItems:'center', marginTop:10}} value = {stringToDate(birthdate)} mode = "date" display = "spinner" onChange = {
                        (event,date)=> {
                            const newDate = dateToString(date)
                            console.log(newDate)
                            setBirthday(newDate)
                        }
                    }
                        />
                </View>
                }
                </View>
            </View>
    )
}

const EditSex = () => {
    const [selectedBox, changeSelectedBox] = useRecoilState(Rsex)
    const checkmark = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.0331 12.3893C6.26619 12.6194 6.65382 12.5669 6.81744 12.2832L13.621 0.487082C13.7706 0.227812 14.1128 0.157117 14.3529 0.33593L16.2254 1.73096C16.4306 1.88387 16.4872 2.16711 16.3566 2.3872L7.40846 17.4565C7.24372 17.7339 6.86325 17.785 6.63117 17.5609L0.325091 11.4698C0.140486 11.2915 0.120868 11.0024 0.279695 10.8008L1.7462 8.93922C1.93073 8.70499 2.27795 8.6833 2.49019 8.89276L6.0331 12.3893Z" fill="#DDDDDD"/>
    </svg>
    `
    const checkmarkInvisible = `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.0331 12.3893C6.26619 12.6194 6.65382 12.5669 6.81744 12.2832L13.621 0.487082C13.7706 0.227812 14.1128 0.157117 14.3529 0.33593L16.2254 1.73096C16.4306 1.88387 16.4872 2.16711 16.3566 2.3872L7.40846 17.4565C7.24372 17.7339 6.86325 17.785 6.63117 17.5609L0.325091 11.4698C0.140486 11.2915 0.120868 11.0024 0.279695 10.8008L1.7462 8.93922C1.93073 8.70499 2.27795 8.6833 2.49019 8.89276L6.0331 12.3893Z" fill="#FFFFFF"/>
    </svg>
    `
    return(
        <View style={styles.innerContainer} > 
            <Text style={styles.header}>Biological Sex</Text>
                <TouchableOpacity onPress = {()=> changeSelectedBox("male")}>
                <View style={[{borderTopWidth:1},styles.seperator]}> 
                    <Text style = {styles.feildName}>Male</Text>
                    {selectedBox == "male" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmark}/>
                    }
                    {selectedBox != "male" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmarkInvisible}/>
                    }
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress = {()=> changeSelectedBox("female")}>
                <View style={styles.seperator}> 
                    <Text style = {styles.feildName}>Female</Text>
                    {selectedBox == "female" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmark}/>
                    }
                    {selectedBox != "female" &&
                        <SvgXml style = {styles.checkmark} xml = {checkmarkInvisible}/>
                    }
                </View>
            </TouchableOpacity>

        </View>
    )
}

const EditWeight = () => {
    const [user,_setUser] = useRecoilState(usersAtom)
    const [weight, setWeight] = useRecoilState(Rweight);
    const [showPicker, setShowPicker] = useState(false); 
    const initialWeight = [
        {id:"weight", value: weight},
    ];
    const [weightValue, setWeightValue] = useState(initialWeight)
    const weightEntry = [
        {id: "weight", label:'lbs', min: 10, max:900},
    ]

    return(
        <View style={styles.innerContainer}> 
            <Text style={styles.header}>Weight</Text>
            <View style = {{width:'100%',height:'92%',backgroundColor:'white',flexDirection:'column',justifyContent:'space-between', alignItems:'center'}}>
                <TouchableOpacity style = {{width:Dimensions.get('window').width}} onPress = {()=>{setShowPicker(!showPicker)}}>
                <View style = {[styles.seperator, {borderTopWidth:1,marginHorizontal:10, justifyContent:'center'}]}>
                    <Text style={{color:'#A6A6A6', fontSize:20}}>{weight + ' lbs'}</Text>
                </View>
                </TouchableOpacity>
                <View style = {{height:'35%', width:'100%', backgroundColor:'#EDEDED', alignItems:'center'}}>
                    <NumberPlease pickerStyle={{ width: "100%", backgroundColor:'#EDEDED'}} 
                        digits = {weightEntry} values = {weightValue} onChange= {(values)=>{
                        setWeightValue(values)
                        setWeight(values[0].value)
                    }}/>
                </View>
                </View>
            </View>
    )
}

const EditHeight = () => {
    const [user,_setUser] = useRecoilState(usersAtom)
    const [height, setHeight] = useRecoilState(Rheight);
    // const [showPicker, setShowPicker] = useState(false);
    const showPicker = true
    

    const inchesToFeet = (inches) =>{
        const ft =  Math.floor(inches/12)
        const inc = inches%12
        return [ft, inc]
    }

    const feetToInches = (feet, inches) =>{
        return feet*12 + inches
    }

    const initialHeight = [
        {id:"feet", value: inchesToFeet(height)[0]},
        {id:"inches", value: Math.floor(inchesToFeet(height)[1])}
    ];

    const [heightValue, setHeightValue] = useState(initialHeight)
    const heightEntry = [
        {id: "feet", label:'\'', min: 0, max:8},
        {id: "inches", label:'\"', min: 0, max:11}
    ]

    return(
        <View style={styles.innerContainer}> 
            <Text style={styles.header}>Height</Text>
            <View style = {{width:'100%',height:'92%',backgroundColor:'white',flexDirection:'column',justifyContent:'space-between', alignItems:'center'}}>
                <TouchableOpacity style = {{width:Dimensions.get('window').width}} >
                    <View style = {[styles.seperator, {borderTopWidth:1,marginHorizontal:10, justifyContent:'center'}]}>
                        <Text style={{color:'#A6A6A6', fontSize:20}}>{inchesToFeet(height)[0] + '\''+ Math.floor(inchesToFeet(height)[1])+'\"'}</Text>
                    </View>
                </TouchableOpacity>
                {showPicker &&
                <View style = {{height:'30%', width:'50%', backgroundColor:'#EDEDED', alignItems:'center', marginTop: 'auto'}}>
                    <NumberPlease pickerStyle={{ width: "100%", backgroundColor:'#EDEDED'}} 
                        digits = {heightEntry} values = {heightValue} onChange= {(values)=>{
                        setHeightValue(values)
                        setHeight(feetToInches(values[0].value, values[1].value))
                    }}/>
                </View>
                }
                </View>
            </View>
    )
}

const EditName = () => {
    const [text, onChangeText] = useRecoilState(Rname);
    return(
        <View style={styles.innerContainer} > 
            <Text style={styles.header}>Name</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={onChangeText}
                value={text}
            />

        </View>
    )
}
const EditPassword = ({navigation}) => {
    const userActions = useUserActions()
    const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom()

    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorText,setErrorText] = useState("");

    const [emailSent,setEmailSent] = useState(false)
    useEffect(()=>{
        const unsub = navigation.addListener("focus",()=>{
            console.log("Cleared")
            setNewPassword("");
            setConfirmPassword("")
            setErrorText("")
            setEmailSent(false)
        })
        return unsub
    },[navigation])

    return(
        <View style={styles.innerContainer} > 
            <Text style={styles.header}> Create New Password</Text>
            <TextInput
                secureTextEntry
                style={styles.textInput}
                onChangeText={setNewPassword}
                value={newPassword}
            />
            <Text style={styles.header}> Confirm Password</Text>
            <TextInput
                secureTextEntry
                style={styles.textInput}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
            />
            { errorText.length> 0 &&
            <Text style= {{
                    marginTop: 15,
                    marginLeft: 40,
                    color: '#A6A6A6',
                    fontSize: 16,
                }}>
                {errorText}
            </Text>
            }
            {
                emailSent ? 
                <Text style = {{
                    marginTop: 15,
                    marginLeft: 40,
                    color: '#A6A6A6',
                    fontSize: 16, 
                }}>
                    An email has been sent to {persistentState.email} to confirm the password change.
                </Text> : 
                <TouchableOpacity style = {{
                    ...SHADOW_STYLE,
                borderRadius: 5,
                marginTop:15,
                alignSelf:"center",
                paddingHorizontal: 20,
                paddingVertical: 10,
                width: 120,
                justifyContent: "center",
                alignItems: "center",
                }}
                    onPress = {async ()=>{
                        if(newPassword.length == 0){
                            setErrorText("Enter a new password");
                            return
                        }
                        if(newPassword.length < MIN_PASSWORD_LENGTH){
                            setErrorText("Password is too short");
                            return
                        }
                        if(newPassword != confirmPassword){
                            setErrorText("Passwords do not match")
                            setConfirmPassword("");
                            return
                        }
                        setErrorText("");
                        await userActions.resetPassword(persistentState.email,newPassword)
                        await setPersistentState({
                            ...persistentState,
                            alternativePasswords: [newPassword,...persistentState?.alternativePasswords ?? []]
                        })
                        setEmailSent(true);
                    }} 
                >
                    <Text style={{
                        color: '#A6A6A6',
                        fontSize: 20,
                    }}>
                        Submit
                    </Text>
                </TouchableOpacity>
            }
        </View>
    )
}

const EditInfo = ({navigation,route})=>{
    const page = route?.params.page ?? "Diet Goals"
    const infoStates = useRecoilValue(infoState);
    const selected = useRecoilValue(editInfoState);
    const [user, setUser] = useRecoilState(usersAtom);
    const userActions = useUserActions()
    const auth = useRecoilValue(authAtom)
    useLogin(navigation)
    const ingredients = useRecoilValue(ingredientsAtom)
    useEffect(()=>{
        const getIngredients = async function(){
            await userActions.getIngredients()
        }
        getIngredients()
    },[auth])


    const name = useRecoilValue(Rname)
    const dietGoals = useRecoilValue(RdietGoals)
    const activityLevel = useRecoilValue(RactivityLevel)
    const dietaryRestrictions = useRecoilValue(RdietaryRestrictions)
    const foodAllergies = useRecoilValue(RfoodAllergies)
    const birthday = useRecoilValue(Rbirthday)
    const sex = useRecoilValue(Rsex)
    const weight = useRecoilValue(Rweight)
    const height = useRecoilValue(Rheight);

    const arrow = `<svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 7.13397C13.1667 7.51888 13.1667 8.48112 12.5 8.86602L2 14.9282C1.33333 15.3131 0.499999 14.832 0.499999 14.0622L0.5 1.93782C0.5 1.16802 1.33333 0.686896 2 1.0718L12.5 7.13397Z" fill="#DDDDDD"/>
    </svg>
    `
    const backArrow =`<svg width="18" height="27" viewBox="0 0 18 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2L4.10542 11.1192C2.53914 12.32 2.53914 14.68 4.10542 15.8808L16 25" stroke="#A4A4A4" stroke-width="4"/>
    </svg>
    `
    
    // `<svg width="19" height="29" viewBox="0 0 19 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    // <path d="M8.17044 14.4243C8.02856 14.6022 8.02473 14.8535 8.16112 15.0357L17.8882 28.0273C18.1371 28.3598 17.8956 28.8332 17.4803 28.8269L10.9852 28.7283C10.8303 28.7259 10.6853 28.6519 10.5925 28.528L0.402676 14.9175C0.266292 14.7353 0.270122 14.484 0.411996 14.3061L11.0122 1.01214C11.1088 0.891069 11.256 0.821559 11.4108 0.823916L17.9056 0.922844C18.3209 0.92917 18.5478 1.40976 18.2889 1.7345L8.17044 14.4243Z" fill="#A4A4A4"/>
    // </svg>`

  

    function getId(allergenName){
        for(const ingredient of (ingredients?? [])){
            if(ingredient.name === allergenName) return ingredient.id
        }
        return null
    }
    const newData = foodAllergies.map(el => {return {name: el, id : getId(el)}}).filter(el=> el.id !== null)

    const submit = async () =>{
        const res = await userActions.postUserSettings(user)
        console.log({res})
        navigation.navigate("SidebarNavigable",{screen: "Settings"})
    }

    let PageComponent = EditFoodAllergies
    switch(page){
        case "Diet Goals": 
            PageComponent = EditDietGoals
            break
        case "Activity Level": 
            PageComponent = EditActivityLevel
            break
        case 'Dietary Restrictions': 
            PageComponent = EditDietaryRestrictions
            break
        case "Food Allergies": 
            PageComponent = EditFoodAllergies
            break
        case "Birthday": 
            PageComponent = EditBirthday
            break
        case "Sex": 
            PageComponent = EditSex
            break
        case "Weight": 
            PageComponent = EditWeight
            break
        case "Height": 
            PageComponent = EditHeight
            break
        case "Name": 
            PageComponent = EditName
            break
        case "Password":
            PageComponent = EditPassword
    }

    return <SafeAreaView style = {{height: '100%',backgroundColor:'white'}}>
        <View style = {styles.headerView}>
            <TouchableOpacity style = {{paddingTop: 10,paddingBottom: 10,paddingRight:30}} onPress = { submit}>
                <SvgXml style = {styles.backArrow} xml = {backArrow}/>
            </TouchableOpacity>
        </View>
        <View style = {{ paddingHorizontal: 30}}>
            <PageComponent navigation = {navigation} />
        </View>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    textInput:{
        borderColor: '#EDEDED',
        borderWidth: 1,
        borderLeftWidth:0,
        borderRightWidth:0,
        height: 40,
        color: '#A6A6A6',
        fontSize: 18,
        marginLeft:10,
        marginRight: 10,
    },
    backArrow: {
        shadowOpacity: 0,
        marginLeft: 10
    },
    headerView:{
        backgroundColor:'white',
        width: '100%',
        height: '8%',
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 3,
        },
        shadowOpacity: .1,
        shadowRadius: 2,
        elevation: 2,
        justifyContent: 'center',
        alignItems:'flex-start',
        marginBottom: 10,
    },
    header:{
        color: '#A6A6A6',
        fontSize: 20,
        marginTop:10,
        marginLeft: 10,
        marginRight: 20
    },
    subheader:{
        color: '#DDDDDD',
        fontSize: 15,
        marginTop:10,
        marginLeft: 10,
        marginRight: 20,
    },
    innerContainer:{
        backgroundColor: 'white'
    },
    container: {
      paddingTop: 50,
    },
    tinyLogo: {
      width: 50,
      height: 50,
    },
    logo: {
      width: 66,
      height: 58,
      marginLeft: 20,
    },
    miniHeader: {
        fontSize:15,
        marginLeft: 10,
        marginTop: 20,
        color: "#DDDDDD" 
    },
    seperator:{
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#EDEDED', 
        borderRightWidth: 0,
        borderLeftWidth: 0,
        flexDirection:'row',
        padding: 10,
        justifyContent: 'space-between',
        marginLeft: 5,
        marginRight:5
    },
    feildName: {
        fontSize:18,
        marginLeft: 10,
        //marginTop: 20,
        color: "#A6A6A6" 
    },
    feildName2:{
        flex:1,
        fontSize:18,
        marginLeft: 10,
        //marginTop: 20,
        color: "#A6A6A6" 
    },
    feildDescription:{
        flex:2,
        fontSize: 15,
        color: '#C8C8C8'
    },
    feildAndArrowContainter: {
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    feild: {
        fontSize:18,
        //marginLeft: 20,
        //marginTop: 20,
        color: "#C8C8C8" 
    },
    triangle: {
        alignSelf:'center',
        marginRight: 10,
    },
    checkboxSeperator: {
        flexDirection:'row',
        marginVertical: 10

    },
    checkbox: {
        width: 23,
        height: 23,
        borderWidth: 2,
        borderColor: "#A6A6A6",
        marginLeft: 20

    },
    innerCheckmark: {
        alignSelf:'center',
    },

    checkmark: {
        flex:1,
        alignSelf:'center',
        marginRight: 10,
    }

  });

export default EditInfo