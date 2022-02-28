import { View,Text,Button, Image,StyleSheet,SafeAreaView, ScrollView, Dimensions } from "react-native"
import { useRecoilState, useRecoilValue } from "recoil"
import { SvgXml } from "react-native-svg"
import {editInfoState} from './state2'
import { TouchableOpacity } from "react-native-gesture-handler"
import {Rname,RdietGoals,RactivityLevel,RdietaryRestrictions,RfoodAllergies,Rbirthday,Rsex,Rweight,Rheight ,infoState} from './state'
import { capitalizeFirstLetter, getAPIActivityLevelName, getAPIBaseAllergenName, getAPIDietaryRestrictionName, getAPIHealthGoalName } from "../utils/session/apiTypes"
import { useState } from "react"
import { useUserActions } from "../utils/session/useUserActions"
import { formatNumber } from "../utils/math"

const Settings = ({navigation})=>{
    const userActions = useUserActions()

    const name = useRecoilValue(Rname)
    const dietGoals = useRecoilValue(RdietGoals)
    const activityLevel = useRecoilValue(RactivityLevel)
    const dietaryRestrictions = useRecoilValue(RdietaryRestrictions)
    const foodAllergies = useRecoilValue(RfoodAllergies)
    const birthday = useRecoilValue(Rbirthday)
    const sex = useRecoilValue(Rsex)
    const weight = useRecoilValue(Rweight)
    const height = useRecoilValue(Rheight);
    const [selected, setSelected] = useRecoilState(editInfoState);
    const arrow = `<svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 7.13397C13.1667 7.51888 13.1667 8.48112 12.5 8.86602L2 14.9282C1.33333 15.3131 0.499999 14.832 0.499999 14.0622L0.5 1.93782C0.5 1.16802 1.33333 0.686896 2 1.0718L12.5 7.13397Z" fill="#DDDDDD"/>
    </svg>
    `

    const edit = (page) =>{
      setSelected(page)
      // navigation.navigate("EditInfo")
      navigation.navigate("EditInfo",{page})
    }

    const arrayToPrettyArray = (arr) =>{
      if(arr.length == 0){
        return ''
      }
      else if(arr.length == 1){
        return arr[0]
      }
      else{
        return arr[0] + '...'
      }
    }

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

    const inchesToFeet = (inches) =>{
      const ft =  Math.floor(inches/12)
      const inc = inches%12
      return [ft, inc]
  }

    return <SafeAreaView style={{backgroundColor: 'white' ,flex: 1}}>
      <ScrollView>
        <View style = {{flexDirection: 'row', marginTop: 50}}>
              <Image
        style={styles.logo}
        source={{
          uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
        }}
      />
      <Text numberOfLines = {0} style = {{color:'#A6A6A6',fontSize: 30, alignSelf:'center', marginLeft: 20, marginRight: 20}}> {name} </Text>
      </View>
      <Text style = {styles.miniHeader}>Personal Settings</Text>
      {dietGoals &&
      <View style = {[styles.seperator, {borderTopWidth:1}]}>
        <Text style = {styles.feildName}>Diet Goals</Text>
        <View style = {styles.feildAndArrowContainter}>
            <Text style = {styles.feild}> {getAPIHealthGoalName(dietGoals)}</Text>
            <View style = {{justifyContent:'center'}}>
                <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Diet Goals')}>
                    <SvgXml style = {styles.triangle} xml = {arrow}/>
                </TouchableOpacity>
            </View>
        </View>
      </View>
      }
      {activityLevel &&
      <View style = {styles.seperator}>
        <Text style = {styles.feildName}>Activity Level</Text>
        <View style = {styles.feildAndArrowContainter}>
            <Text style = {styles.feild}> {getAPIActivityLevelName(activityLevel)}</Text>
            <View style = {{justifyContent:'center'}}>
                <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Activity Level')}>
                    <SvgXml style = {styles.triangle} xml = {arrow}/>
                </TouchableOpacity>
            </View>
        </View>
      </View>}

      {dietaryRestrictions && <>
        <View style = {styles.seperator}>
          <Text style = {styles.feildName}>Dietary Restrictions</Text>
          <View style = {styles.feildAndArrowContainter}>
                  <Text style = {styles.feild}> {arrayToPrettyArray(dietaryRestrictions.map(getAPIDietaryRestrictionName))}</Text>
                  <View style = {{justifyContent:'center'}}>
                      <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Dietary Restrictions')}>
                          <SvgXml style = {styles.triangle} xml = {arrow}/>
                      </TouchableOpacity>
                  </View>
          </View>
        </View>
      </>}

      {foodAllergies &&
      <>
      <View style = {styles.seperator}>
        <Text style = {styles.feildName}>Food Allergies</Text>
        <View style = {styles.feildAndArrowContainter}>
            <Text style = {styles.feild}> {arrayToPrettyArray(foodAllergies.map(getAPIBaseAllergenName))}</Text>
            <View style = {{justifyContent:'center'}}>
                <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Food Allergies')}>
                    <SvgXml style = {styles.triangle} xml = {arrow}/>
                </TouchableOpacity>
            </View>
        </View>
      </View>
      </>}
      <Text style = {styles.miniHeader}>Biological Settings</Text>
      {birthday &&
      <View style = {[styles.seperator, {borderTopWidth:1}]}>
        <Text style = {styles.feildName}>Birthday</Text>
        <View style = {styles.feildAndArrowContainter}>
            <Text style = {styles.feild}> {dateToPrettyDate(birthday)}</Text>
            <View style = {{justifyContent:'center'}}>
                <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Birthday')}>
                    <SvgXml style = {styles.triangle} xml = {arrow}/>
                </TouchableOpacity>
            </View>
        </View>
      </View> 
      }

      {sex &&
      <View style = {styles.seperator}>
        <Text style = {styles.feildName}>Sex</Text>
        <View style = {styles.feildAndArrowContainter}>
            <Text style = {styles.feild}> { capitalizeFirstLetter(sex)}</Text>
            <View style = {{justifyContent:'center'}}>
                <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Sex')}>
                    <SvgXml style = {styles.triangle} xml = {arrow}/>
                </TouchableOpacity>
            </View>
        </View>
      </View>
      }

      {isFinite(weight) ?
      <View style = {styles.seperator}>
        <Text style = {styles.feildName}>Weight</Text>
        <View style = {styles.feildAndArrowContainter}>
            <Text style = {styles.feild}> {formatNumber(weight) + ' lbs'}</Text>
            <View style = {{justifyContent:'center'}}>
                <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Weight')}>
                    <SvgXml style = {styles.triangle} xml = {arrow}/>
                </TouchableOpacity>
            </View>
        </View>
      </View> : null
      }
      { isFinite(height) &&
      <View style = {styles.seperator}>
        <Text style = {styles.feildName}>Height</Text>
        <View style = {styles.feildAndArrowContainter}>
            <Text style = {styles.feild}> {inchesToFeet(height)[0]+ '\'' + Math.floor(inchesToFeet(height)[1]) + '\"'}</Text>
            <View style = {{justifyContent:'center'}}>
                <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Height')}>
                    <SvgXml style = {styles.triangle} xml = {arrow}/>
                </TouchableOpacity>
            </View>
        </View>
      </View>
      }

      <Text style = {styles.miniHeader}>Account Settings</Text>
      {/* <View style = {[styles.seperator, {borderTopWidth:1}]}>
        <Text style = {styles.feildName}>Name</Text>
        <View style = {styles.feildAndArrowContainter}>
            <Text style = {styles.feild}> {sex}</Text>
            <View style = {{justifyContent:'center'}}>
                <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Name')}>
                    <SvgXml style = {styles.triangle} xml = {arrow}/>
                </TouchableOpacity>
            </View>
        </View>
      </View> */}
{/* 
      <View style = {styles.seperator}>
        <Text style = {styles.feildName}>Email</Text>
        <View style = {styles.feildAndArrowContainter}>
            <Text style = {styles.feild}> {sex}</Text>
            <View style = {{justifyContent:'center'}}>
                <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Name')}>
                    <SvgXml style = {styles.triangle} xml = {arrow}/>
                </TouchableOpacity>
            </View>
        </View>
      </View> */}

      {/* <View style = {styles.seperator}>
        <Text style = {styles.feildName}>Password</Text>
        <View style = {styles.feildAndArrowContainter}>
            <Text style = {styles.feild}> {sex}</Text>
            <View style = {{justifyContent:'center'}}>
                <TouchableOpacity style= {{paddingLeft:10}} onPress = {()=> edit('Name')}>
                    <SvgXml style = {styles.triangle} xml = {arrow}/>
                </TouchableOpacity>
            </View>
        </View>
      </View> */}

      <SettingsEntry name = "Log out" current = "" openable = {false} onPress = {()=>{
            async function logOut(){
                console.log("Logging out")
                await userActions.logout()
                navigation.navigate("Login")
            }
            logOut()
        }}/>

        <View style = {{ marginTop: 40,}}/>
      </ScrollView>
    </SafeAreaView> 
}

function SettingsEntry(props){
  const {name,current,onPress} = props
  const [_open,_setOpen] = useState(false)
  const openable = props?.openable ?? true
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
              if(onPress){
                  onPress()
              }
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

          {
              openable &&
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
          }
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

const styles = StyleSheet.create({
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
        borderWidth: 1,
        borderTopWidth:0,
        borderColor: '#EDEDED', 
        borderRightWidth: 0,
        borderLeftWidth: 0,
        flexDirection:'row',
        padding: 10,
        justifyContent: 'space-between'
    },
    feildName: {
        fontSize:18,
        marginLeft: 10,
        //marginTop: 20,
        color: "#A6A6A6" 
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
    }

  });

export default Settings