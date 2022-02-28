import { View,Text,Pressable,Modal,Button, StyleSheet, Image, Dimensions, ImageBackground, ScrollView, TouchableOpacity, TextInput, Keyboard,TouchableWithoutFeedback, KeyboardAvoidingView} from "react-native"
import React, {useState} from 'react';
import { SvgXml } from 'react-native-svg'
import {Picker} from '@react-native-picker/picker';
import { usePersistentAtom } from "../utils/state/userState";
import { useRecoilState } from 'recoil';
import { usersAtom, useUserActions } from "../utils/session/useUserActions";
import { APIUserSettings } from '../utils/session/apiTypes';
import { useEffect } from "react";
import { useRoute } from '@react-navigation/native';

const BABSON_PK = 10; 
const numToSchool = {
  10: "Babson College"
}

const logo_xml = `<svg width="182" height="86" viewBox="0 0 182 86" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 46.0001L11.5 64.0001L19 46.0001L26.5 64.0001L34 46.0001" stroke="#FF3939" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40 55.0001C40 59.9706 44.0294 64.0001 49 64.0001H55M40 55.0001C40 50.0295 44.0294 46.0001 49 46.0001C53.9706 46.0001 58 50.0295 58 55.0001H40Z" stroke="#FF3939" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M160 55.0001C160 59.9706 164.029 64.0001 169 64.0001H175M160 55.0001C160 50.0295 164.029 46.0001 169 46.0001C173.971 46.0001 178 50.0295 178 55.0001H160Z" stroke="#434343" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M73.1656 55C73.1656 51.7779 75.7777 49.1658 78.9998 49.1658C82.2219 49.1658 84.834 51.7779 84.834 55C84.834 58.2221 82.2219 60.8342 78.9998 60.8342C75.7777 60.8342 73.1656 58.2221 73.1656 55ZM73.1656 65.6783C74.8977 66.6266 76.8858 67.1658 78.9998 67.1658C85.7188 67.1658 91.1656 61.719 91.1656 55C91.1656 48.281 85.7188 42.8342 78.9998 42.8342C76.7369 42.8342 74.6183 43.452 72.8034 44.5282C72.2736 43.521 71.2169 42.8342 69.9998 42.8342C68.2514 42.8342 66.834 44.2516 66.834 46V55V82C66.834 83.7484 68.2514 85.1658 69.9998 85.1658C71.7483 85.1658 73.1656 83.7484 73.1656 82V65.6783Z" fill="#434343"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M120.834 55.0002C120.834 58.2223 118.222 60.8343 115 60.8343C111.778 60.8343 109.166 58.2223 109.166 55.0002C109.166 51.778 111.778 49.166 115 49.166C118.222 49.166 120.834 51.778 120.834 55.0002ZM121.197 44.5284C119.382 43.4522 117.263 42.8343 115 42.8343C108.281 42.8343 102.834 48.2812 102.834 55.0002C102.834 61.7192 108.281 67.166 115 67.166C117.263 67.166 119.382 66.5481 121.197 65.472C121.726 66.4792 122.783 67.166 124 67.166C125.749 67.166 127.166 65.7486 127.166 64.0002L127.166 55.0002L127.166 46.0002C127.166 44.2517 125.749 42.8343 124 42.8343C122.783 42.8343 121.726 43.5212 121.197 44.5284Z" fill="#434343"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M133 33.8341C134.748 33.8341 136.166 35.2515 136.166 37V42.8341H142C143.748 42.8341 145.166 44.2515 145.166 46C145.166 47.7484 143.748 49.1658 142 49.1658H136.166V55C136.166 58.2221 138.778 60.8341 142 60.8341C145.222 60.8341 147.834 58.2221 147.834 55C147.834 53.2515 149.251 51.8341 151 51.8341C152.748 51.8341 154.166 53.2515 154.166 55C154.166 61.719 148.719 67.1658 142 67.1658C135.281 67.1658 129.834 61.719 129.834 55V46V37C129.834 35.2515 131.251 33.8341 133 33.8341Z" fill="#434343"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M97 24.8343C98.7484 24.8343 100.166 26.2517 100.166 28.0001V64.0001C100.166 65.7485 98.7484 67.1659 97 67.1659C95.2516 67.1659 93.8342 65.7485 93.8342 64.0001V28.0001C93.8342 26.2517 95.2516 24.8343 97 24.8343Z" fill="#434343"/>
<path d="M62.5 4.00006H85V34.0001H62.5M62.5 4.00006H40V19.0001M62.5 4.00006V19.0001M62.5 34.0001H40V19.0001M62.5 34.0001V19.0001M62.5 19.0001H40" stroke="#FF3939" stroke-width="6.33166" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`

const get_started_button = `<svg width="315" height="40" viewBox="0 0 315 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="315" height="40" rx="10" fill="#FF3939"/>
</svg>
`
const log_in_button = `<svg width="315" height="40" viewBox="0 0 315 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="315" height="40" rx="10" fill="#434343"/>
</svg>
`
const windowHeight = Dimensions.get('window').height;
const unfocused_textbox_background_color = '#E8E8E8'
const focused_textbox_background_color = 'white'
const Login = ({navigation})=>{
  const route = useRoute()
  //declares state of page and automatically sets it to 0
  //0 means to show start view (option to log in or get started)
  //1 shows the get started view
  //2 shows the log in view
  const userActions = useUserActions()
  const [persistentState,setPersistentState,fetchPersistentState] = usePersistentAtom() as any
  const [persistentStateChecked,setPersistentStateChecked] = useState(false);
  useEffect(()=>{
    if(persistentState.password !== null && persistentState.email !== null && !persistentStateChecked){
      console.log("Naving back to dashboard",route.name)
      navigation.navigate("SidebarNavigable",{screen:"Dashboard"})
      setPersistentStateChecked(true)
    }
  },[persistentState])

  const [state, setState] = useState(0);

  // const [name, onNameChangeText] = useState("Hugh Jazz");
  const [name, onNameChangeText] = useState();
  const [nameColor, changeNameColor] = useState(unfocused_textbox_background_color);

  // const [email, onEmailChangeText] = useState("2021090@appleby.on.ca");
  const [email, onEmailChangeText] = useState(null as string);
  const [emailColor, changeEmailColor] = useState(unfocused_textbox_background_color);

  // const [password, onPasswordChangeText] = useState("goodpassword123");
  const [password, onPasswordChangeText] = useState("");
  const [passwordColor, changePasswordColor] = useState(unfocused_textbox_background_color);

  const [confirm_password, onConfirm_PasswordChangeText] = useState();
  // const [confirm_password, onConfirm_PasswordChangeText] = useState();
  const [confirm_passwordColor, changeConfirm_PasswordColor] = useState(unfocused_textbox_background_color);

  const [select_schoolColor, changeSelect_schoolColor] = useState(unfocused_textbox_background_color);
  // const [school, setSchool] = useState(1);
  const [school, setSchool] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [message,setMessage] = useState("");

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };
  const onLoginPress = async ()=>{
    console.log({
      email,
      password,
    })
    if(email == "" || email == null){
      setMessage("Missing email.")
      return;
    }
    if(!validateEmail(email)){
      setMessage("Invalid email.")
      return;
    }
    if(password == "" || password == null){
      setMessage("Missing password.")
      return
    }

    try{
      await userActions.login(email.toLowerCase(),password) 
      setMessage("")
      await setPersistentState({
        email : email.toLowerCase(),
        password,

      })
      navigation.navigate("SidebarNavigable",{screen:"Dashboard"})
    }catch(e){
      setMessage("Invalid email or password")
      return;
    }
    // navigation.navigate("SidebarNavigable",{screen:"--DEBUG--"})
  }
  const [user,_setUser] = useRecoilState(usersAtom)
  const onRegisterPress = async ()=>{
    console.log({
      email,
      password,
    })
    if(name == "" || name == null){
      setMessage("Missing name.")
      return
    }

    if(email == "" || email == null){
      setMessage("Missing email.")
      return;
    }
    if(!validateEmail(email)){
      setMessage("Invalid email.")
      return;
    }
    if(password == "" || password == null){
      setMessage("Missing password.")
      return
    }
    if(password.length<5){
      setMessage("Password too short.")
      return
    }
    if(password !== confirm_password){
      setMessage("Passwords do not match.")
      return
    }
    if(school == null){
      setMessage("Missing school.")
      return
    }

    const res = await userActions.checkEmail(email);
    console.log({res})
    if(res.detail == "Email already taken"){
      setMessage("Email already taken.")
      return
    }

    setMessage("")
    await setPersistentState({
      email: email.toLowerCase(),
      password,
      doOnboarding:true,
    })

    _setUser({
      school,
      name,
      ban: [],
      favor: [],
      dietary_restrictions: [],
      allergies: [],
      height: null,
      weight: null,
      birthdate: null,
      meals : [],
      meal_length: null,
      sex: null,
      health_goal: null,
      activity_level: null,
      grad_year: null,
      id: null,
    } as APIUserSettings)

    navigation.navigate("Welcome1")
  }

  const openPicker = () =>{
    Keyboard.dismiss
    setModalVisible(true)
    Keyboard.dismiss(true)
  }

    return <View style={styles.container}>
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
              <ImageBackground
              style={styles.image}
              resizeMode  = "cover"
              source={require("./assets/Background.png")}
            >
              <Modal
        style= {{ flexDirection: 'column-reverse',alignSelf: 'flex-end',
          margin: 0, height: windowHeight}}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style = {{height:windowHeight, justifyContent: 'flex-end',backgroundColor: 'rgba(0,0,0,0)'}}>
        <TouchableWithoutFeedback onPress = {()=> setModalVisible(!modalVisible)}>  
          <View style ={{flex:2}}/>
        </TouchableWithoutFeedback>
          <View style = {{backgroundColor: '#E8E8E8', flex:1, opacity: 1, shadowOpacity:.5}}>
            <View style = {{flexDirection:'row',backgroundColor: 'white', height:'20%', justifyContent:'center', alignItems:'center'}}>
              <Button title='Done' onPress = {()=> setModalVisible(!modalVisible)} />
            </View>
            <Picker
              style = {{marginTop:0}}
              selectedValue={school}
              onValueChange={(itemValue, itemIndex) =>
                setSchool(itemValue)
            }>
              <Picker.Item itemStyle ={{color:'red'}} label="-- Select School --" value={null} />
              <Picker.Item label="Babson College" value={BABSON_PK}/>
            </Picker>
          </View>
        </View>
        </Modal>
            
              { 
              state == 0 && 
              <View style ={styles.start}>
                  
              <SvgXml style={{flex: 1, alignSelf:'center',}} xml={logo_xml} height = "50%" width = "50%"/>
              
              <TouchableOpacity style = {styles.get_started_button} onPress={ () => setState(1)}>
                <View style = {{backgroundColor:'#FF3939', borderRadius:10}}>
                  <Text style = {styles.buttonText}>Get Started</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style = {styles.log_in_button} onPress={ () => setState(2) }>
                <View style = {{backgroundColor:'#434343', borderRadius:10}}>
                  <Text style = {styles.buttonText}>Log In</Text>
                </View>
              </TouchableOpacity>

            </View>
            } 
              {/* Register State */}
            { 
            state == 1 && 
            
            // Show weplate background
              <ImageBackground
                style={styles.image2}
                resizeMode  = "cover"
                source={{
                  uri: 'https://s3-alpha-sig.figma.com/img/ab60/32ae/e2a63b157756c696ab479c819cd66e53?Expires=1644796800&Signature=YWfnZp2FVfkuHGonbv~78NNoKg-0s1R44NQnWi9XiLKBCjjXUxR2Klbz6ulpRdIXlzm-IgGB58jgNQB2NJXK4HTODWmHLuzV6OUUvGIw6IrkEaPXnCB0bFk0Xo~oODdrqPblIQnPot2h30GjezWzdi6rdMOfI5f7EiPfO0yPFWxDV-hvK~jQT5F4yjg26A1UFrb0NOpLvseEUkNsdFhR84zPfHaZLHsB0e1mGhEGHaxQa9OV~ht-gb~ltVOjnNAQHY-reO66wmB1orQXfRxXp8hcxL-3HXYDMniCuLFUldzRWW0r4SmboZ--KpidGPQ7OCH4T2pwK8IW32h2rYiVxQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA',
                }}
              >

                <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
                  <View style={{opacity: 0, backgroundColor:'white', height:'20%'}}>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
                  <KeyboardAvoidingView behavior = 'position' style ={styles.registerOuterView}>
                    <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
                      <View style = {styles.registerInnerView}>
                        {/* Register header */}
                        <Text style = {styles.headerText}>Register</Text>
                        <Text style = {{
                           color: '#9c9c9c', 
                           alignSelf:'flex-start',
                           fontSize: 16,
                           marginLeft: 50,
                           marginBottom: 20,
                        }}>{message}</Text>
                        {/* <ScrollView style={styles.register}> */}
                          {/* Render textboxes */}
                          {/* Name textbox */}
                          <TextInput
                            style={{
                              height: 50,
                              marginLeft: 20,
                              marginRight: 20,
                              marginBottom: 20,
                              borderWidth: 1,
                              padding: 10,
                              backgroundColor: nameColor,
                              borderRadius: 5,
                            }}
                            onChangeText={onNameChangeText}
                            value={name}
                            placeholder="Name"
                            placeholderTextColor = '#B1B1B1'
                            importantForAutofill = 'yes' 
                          importantForAutofill = 'yes' 
                            importantForAutofill = 'yes' 
                            borderColor = '#E8E8E8'
                            onFocus={ () => changeNameColor(focused_textbox_background_color) }
                            onBlur={ () => changeNameColor(unfocused_textbox_background_color) }
                          />
                          {/* Email Textbox */}
                          <TextInput
                              style={{
                                height: 50,
                                marginLeft: 20,
                                marginRight: 20,
                                marginBottom: 20,
                                borderWidth: 1,
                                padding: 10,
                                backgroundColor: emailColor,
                                borderRadius: 5,
                              }}
                              onChangeText={onEmailChangeText}
                              value={email}
                              placeholder="Email"
                              placeholderTextColor = '#B1B1B1'
                              importantForAutofill = 'yes' 
                            importantForAutofill = 'yes' 
                              importantForAutofill = 'yes' 
                              borderColor = '#E8E8E8'
                              onFocus={ () => changeEmailColor(focused_textbox_background_color) }
                              onBlur={ () => changeEmailColor(unfocused_textbox_background_color) }
                          />
                          {/* password textbox */}
                          <TextInput
                            style={{
                              height: 50,
                              marginLeft: 20,
                              marginRight: 20,
                              marginBottom: 20,
                              borderWidth: 1,
                              padding: 10,
                              backgroundColor: passwordColor,
                              borderRadius: 5,
                            }}
                            onChangeText={onPasswordChangeText}
                            value={password}
                            importantForAutofill = 'yes' 
                          importantForAutofill = 'yes' 
                            importantForAutofill = 'yes' 
                            placeholder="Password"
                            placeholderTextColor = '#B1B1B1'
                            borderColor = '#E8E8E8'
                            onFocus={ () => changePasswordColor(focused_textbox_background_color) }
                            onBlur={ () => changePasswordColor(unfocused_textbox_background_color) }
                            secureTextEntry = {true}
                          />
                          {/* Confirm Password Textbox */}
                          <TextInput
                            style={{
                              height: 50,
                              marginLeft: 20,
                              marginRight: 20,
                              marginBottom: 20,
                              borderWidth: 1,
                              padding: 10,
                              backgroundColor: confirm_passwordColor,
                              borderRadius: 5,
                            }}
                            onChangeText={onConfirm_PasswordChangeText}
                            value={confirm_password}
                            importantForAutofill = 'yes' 
                          importantForAutofill = 'yes' 
                            importantForAutofill = 'yes' 
                            placeholder="Confirm Password"
                            placeholderTextColor = '#B1B1B1'
                            borderColor = '#E8E8E8'
                            onFocus={ () => changeConfirm_PasswordColor(focused_textbox_background_color) }
                            onBlur={ () => changeConfirm_PasswordColor(unfocused_textbox_background_color) }
                            secureTextEntry = {true}
                          />
                          {/* Render select schools picker */}
                          <View style = {{flexDirection: 'row'}}>
                            <TextInput
                              style = {{   
                                flex: 3,                          
                                height: 50,
                                marginLeft: 20,
                                marginRight: 2,
                                marginBottom: 20,
                                borderWidth: 1,
                                padding: 10,
                                backgroundColor: unfocused_textbox_background_color,
                                borderRadius: 5,}}
                              value={numToSchool[school]}
                              placeholder="Select School"
                              placeholderTextColor = '#B1B1B1'
                              borderColor = '#E8E8E8'
                              onPressIn={ () => openPicker()}
                              editable = {false}
                            />
                            <TouchableOpacity style = {{flex:1}} onPress = { () => openPicker()}>
                            <View style = {{ flex: 1, marginLeft:2, marginRight:20,marginBottom:20, backgroundColor: unfocused_textbox_background_color, borderRadius:5, justifyContent: 'center', alignItems:'center'}}>
                              <View style ={styles.TriangleView}/>
                            </View>
                            </TouchableOpacity>
                          </View>
                        {/* </ScrollView> */}
                      </View>
                    </TouchableWithoutFeedback>
                  </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
                <View style={{ backgroundColor:"white", height:'20%'}}>
                  <View flexDirection = 'row' style = {{alignItems:"center"}}> 
                    <TouchableOpacity style= {{marginBottom:10}} onPress={ () => {setState(2); setMessage("")}}>
                      <Text style = {{color:'#B1B1B1', paddingVertical:10, marginHorizontal:20, fontSize: 15}}>I already have an account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.continue_button} onPress = {onRegisterPress}>
                      <View style = {{backgroundColor:'#FF3939', borderRadius: 5}}>
                        <Text style = {styles.buttonText}>Continue</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* </View> */}
              </ImageBackground>

          }       
          { 
            state == 2 && 
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
            <KeyboardAvoidingView behavior = 'position' style ={{backgroundColor:'white',height:'50%'}}>
            <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
              <View style ={styles.login}>
              <Text style = {styles.headerText}>Log In</Text>
              <Text style = {{
                   color: '#9c9c9c', 
                   alignSelf:'flex-start',
                   fontSize: 16,
                   marginLeft: 50,
                   marginBottom: 20,

              }}> {message} </Text>
                <TextInput
                  style={{
                    height: 50,
                    marginLeft: 20,
                    marginRight: 20,
                    marginBottom: 20,
                    borderWidth: 1,
                    padding: 10,
                    backgroundColor: emailColor,
                    borderRadius: 5,
                  }}
                  onChangeText={onEmailChangeText}
                  value={email}
                  placeholder="Email"
                  keyboardType = 'email-address'
                  importantForAutofill = 'yes' 
                  placeholderTextColor = '#B1B1B1'
                  borderColor = '#E8E8E8'
                  onFocus={ () => changeEmailColor(focused_textbox_background_color) }
                  onBlur={ () => changeEmailColor(unfocused_textbox_background_color) }
                />

                <TextInput
                  style={{
                    height: 50,
                    marginLeft: 20,
                    marginRight: 20,
                    marginBottom: 20,
                    borderWidth: 1,
                    padding: 10,
                    backgroundColor: passwordColor,
                    borderRadius: 5,
                  }}
                  onChangeText={onPasswordChangeText}
                  value={password}
                  importantForAutofill = 'yes' 
                  placeholder="Password"
                  placeholderTextColor = '#B1B1B1'
                  borderColor = '#E8E8E8'
                  onFocus={ () => changePasswordColor(focused_textbox_background_color) }
                  onBlur={ () => changePasswordColor(unfocused_textbox_background_color) }
                  secureTextEntry = {true}
                />
                {/* </KeyboardAvoidingView> */}
                <View>
                <View flexDirection = 'row' style = {{height: '30%'}}> 
                  <TouchableOpacity style= {{marginBottom:10}} onPress={ () =>{ setState(1); setMessage("")} }>
                    <Text style = {{color:'#B1B1B1', paddingVertical:10, marginHorizontal:20, fontSize: 15}}>Create a new account</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style = {styles.continue_button}  onPress = {onLoginPress}>
                    <View style = {{backgroundColor:'#FF3939', borderRadius: 5}}>
                      <Text style = {styles.buttonText}>Log In</Text>
                    </View>
                </TouchableOpacity>
                </View>
                </View>
                <View style = {{backgroundColor: 'red'}}></View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
          }
                </ImageBackground>
          </TouchableWithoutFeedback>
        </View> 
    }
const styles = StyleSheet.create({

  registerOuterView: {
    //height:'80%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    marginTop:'auto'
    //alignItems: 'center',
    // shadowOffset: {
    //   width: 0,
    //   height: -7,
    // },
    // shadowOpacity: .3,
    // shadowRadius: 5,
  },

  registerInnerView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    //alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: -7,
    },
    shadowOpacity: .3,
    shadowRadius: 5,
  },
  TriangleView: {
    //backgroundColor: '#B1B1B1',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 15,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#B1B1B1'
  },
  button:{
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen:{
    backgroundColor: "#F194FF"
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#E8E8E8',
    borderRadius: 5,
  },
  headerText:{
    color: '#434343', 
    paddingTop: 10, 
    //paddingLeft: 10,
    paddingBottom: 20,
    marginLeft: 20,
    marginTop:40,
    alignSelf:'flex-start',
    fontWeight:'bold',
    fontSize: 30
  },
    buttonText:{
      color: 'white', 
      paddingVertical: 10, 
      alignSelf:'center',
      fontWeight:'bold',
      fontSize: 15,
    },
    get_started_button: {
      flex: 1,
      height: '10%',
      width:3*Dimensions.get('window').width/4, 
      alignSelf:'center',
      marginBottom: 30,
    },
    continue_button: {
      flex: 1,
      //height: '10%',
      //width:3*Dimensions.get('window').width/4, 
      //height: '100%',
      marginLeft: 20,
      marginRight:20
    },
    log_in_button: {
      flex: 2,
      height: '10%',
      width:3*Dimensions.get('window').width/4, 
      alignSelf:'center',
      //paddingTop: 10,
    },
    container: {
      flex: 1,
      justifyContent:'flex-end'
    },
    tinyLogo: {
      width: 50,
      height: 50,
    },
    logo: {
      width: 66,
      height: 58,
    },
    start: {
      backgroundColor: 'white',
      borderTopLeftRadius: 30, 
      borderTopRightRadius: 30,
      //alignItems: 'center',
      shadowOffset: {
        width: 1,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius: 10,
      height: '50%'
    },
    login: {
      backgroundColor: 'white',
      borderTopLeftRadius: 30, 
      borderTopRightRadius: 30,
      //alignItems: 'center',
      shadowOffset: {
        width: 1,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius: 10,
      //height: '50%',
    },
    register: {
      backgroundColor: 'white',
      borderTopLeftRadius: 30, 
      borderTopRightRadius: 30,
      //alignItems: 'center',
      shadowOffset: {
        width: 0,
        height: -7,
      },
      shadowOpacity: .3,
      shadowRadius: 5,
    },
    background: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
    image: {
        flex: 1,
        //justifyContent: "center",
        flexDirection: 'column-reverse',
        //justifyContent:'flex-end'
    },
    image2: {
        flex: 1,
        //justifyContent: "center",
        flexDirection: 'column',
        height: "100%"
        //justifyContent:'flex-end'
    },
  });

export default Login