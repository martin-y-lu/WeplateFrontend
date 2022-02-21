import {useState} from 'react';
import { View,Text,Button, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard} from "react-native"
import { setTextRange } from 'typescript';
// import { RadioButton } from 'react-native-paper';

// const bg = { uri: "https://reactjs.org/logo-og.png" };
// const bg2 = require('../faded-backdrop2.png');
// const onPress2 = (str) => alert(str);

const Feedback = ({navigation})=>{
    const [text, setText] = useState("");
    const [done, setDone] = useState(false);

    // setText("")
    // setDone(false)
    // const [checked, setChecked] = React.useState('first');
    return <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
> 
    <View style={{ flex: 1, backgroundColor: '#FA4A4A', justifyContent: 'center' }}>
            {/* <ImageBackground source={bg2} resizeMode="stretch" style={styles.image}> */}

        <View style={{alignItems: 'left', margin: 30}}>

            {! done && 
                <View style={{alignItems: 'left', width: '100%'}}>
                    <Text style={styles.questionText}>How was the food?</Text>
                    <TextInput
                        style={styles.input}
                        multiline
                        numberOfLines={10}
                        maxLength={250}
                        onChangeText={setText}
                        // value={number}
                        placeholder="I loved the peach cobbler!"
                        keyboardType="default"
                    />
                </View>
            }
            
            {
                text.length > 0 && !done &&
                <TouchableOpacity 
                    style={styles.continueContainer}
                    onPress={() => setDone(true)}
                >
                    <Text style={styles.continue}>
                        Continue
                    </Text>
                </TouchableOpacity>
            }
            {
                text.length == 0 && !done &&
                <TouchableOpacity style={styles.continueContainer2}>
                    <Text style={styles.continue}>
                        Continue
                    </Text>
                </TouchableOpacity>
            }
            {
            done &&
                <View>
                    <Text style={styles.thankYou}>Thank You!</Text>
                    <Text style={styles.thank}>The dining hall will make improvements to your dining experience based on your feedback.</Text>
                </View>
            }
        </View>

        {/* <Image source={require('../faded-backdrop2.png')} style={styles.backdrop} /> */}
    
        {/* <Image source={require('../faded-backdrop2.png')} style={styles.backdropBottom} /> */}
        {/* <Image></Image> */}

        
    {/* </ImageBackground> */}

    </View>
        </TouchableWithoutFeedback>
}

export default Feedback

const styles = StyleSheet.create({

    thankYou: {
        fontWeight: '900',
        fontSize: 35,
        color: 'white',
    },

    thank: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500'
    },

    input: {
        marginVertical: 10,
        width: '100%',
        height: 300,
        fontSize: 15,
        backgroundColor: 'white',
        padding: 20,
        paddingTop: 20
    },

    continueContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-end',
        paddingHorizontal: 25
    },

    continueContainer2: {
        opacity: .5,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'flex-end',
        paddingHorizontal: 25
    },
    continue: {
        color: '#FA4A4A',
        fontWeight: '900',
        fontSize: 16
    },

    title: {
        color: 'white',
        fontWeight: '800',
        fontSize: 20
    },

    questionText: {
        color: 'white',
        fontSize: 17,
        fontWeight: '500'
    },

    backdrop: {
        position: 'absolute',
        top: -750,

    },

    backdropBottom: {
        position: 'absolute',
        top: 270,

    },

    button: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },

    button2: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },

    text2: {
        color: 'white',
        fontWeight: '400',
        marginLeft: 10,
    },

    hor: {
        flexDirection: 'row',
        // marginTop: 10
    },

    image: {
        flex: 1,
        justifyContent: "center",
      },

    selection: {
        marginTop: 5,
        padding: 5
    }
})