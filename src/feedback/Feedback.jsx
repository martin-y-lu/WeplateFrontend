import * as React from 'react';
import { View,Text,Button, StyleSheet, Image } from "react-native"
// import { RadioButton } from 'react-native-paper';

const Feedback = ({navigation})=>{
    const [checked, setChecked] = React.useState('first');
    return <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#ff7474', justifyContent: 'center' }}>
        <View style={{alignItems: 'left', margin: 15}}>
            <Text style={styles.title}>Question 1/4</Text>
            <Text style={styles.text}>What was your opinion on the cleanliness of the dining hall?</Text>
            {/* <View>
                <RadioButton
                    value="first"
                    status={ checked === 'first' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('first')}
                />
                <RadioButton
                    value="second"
                    status={ checked === 'second' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('second')}
                />
                <RadioButton
                    value="third"
                    status={ checked === 'first' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('first')}
                />
                <RadioButton
                    value="fourth"
                    status={ checked === 'second' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('second')}
                />
            </View> */}

        </View>

        <Image source={require('../faded-backdrop2.png')} style={styles.backdrop} />
        <Image source={require('../faded-backdrop2.png')} style={styles.backdropBottom} />
        {/* <Image></Image> */}

    </View>
}

export default Feedback

const styles = StyleSheet.create({

    title: {
        color: 'white',
        fontWeight: '800',
        fontSize: 20
    },

    text: {
        color: 'white'
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