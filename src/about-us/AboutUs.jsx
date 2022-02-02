import { View,Text,Button, StyleSheet, ImageBackground, TouchableOpacity } from "react-native"
// import {bg.png} from '../../src/'

const image = { uri: 'https://s3-alpha-sig.figma.com/img/ab60/32ae/e2a63b157756c696ab479c819cd66e53?Expires=1644796800&Signature=YWfnZp2FVfkuHGonbv~78NNoKg-0s1R44NQnWi9XiLKBCjjXUxR2Klbz6ulpRdIXlzm-IgGB58jgNQB2NJXK4HTODWmHLuzV6OUUvGIw6IrkEaPXnCB0bFk0Xo~oODdrqPblIQnPot2h30GjezWzdi6rdMOfI5f7EiPfO0yPFWxDV-hvK~jQT5F4yjg26A1UFrb0NOpLvseEUkNsdFhR84zPfHaZLHsB0e1mGhEGHaxQa9OV~ht-gb~ltVOjnNAQHY-reO66wmB1orQXfRxXp8hcxL-3HXYDMniCuLFUldzRWW0r4SmboZ--KpidGPQ7OCH4T2pwK8IW32h2rYiVxQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA' };

const AboutUs = ({navigation})=>{
    return (
    
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>

        <ImageBackground 
            // source = {{uri: 'https://s3-alpha-sig.figma.com/img/ab60/32ae/e2a63b157756c696ab479c819cd66e53?Expires=1644796800&Signature=YWfnZp2FVfkuHGonbv~78NNoKg-0s1R44NQnWi9XiLKBCjjXUxR2Klbz6ulpRdIXlzm-IgGB58jgNQB2NJXK4HTODWmHLuzV6OUUvGIw6IrkEaPXnCB0bFk0Xo~oODdrqPblIQnPot2h30GjezWzdi6rdMOfI5f7EiPfO0yPFWxDV-hvK~jQT5F4yjg26A1UFrb0NOpLvseEUkNsdFhR84zPfHaZLHsB0e1mGhEGHaxQa9OV~ht-gb~ltVOjnNAQHY-reO66wmB1orQXfRxXp8hcxL-3HXYDMniCuLFUldzRWW0r4SmboZ--KpidGPQ7OCH4T2pwK8IW32h2rYiVxQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA',
            // }} 
            source = {require('../bg.png')} 
            resizeMode = "cover" 
            imageStyle= {{opacity:0.2}}
            style = {styles.image}
        >
            <View style={{backgroundColor: 'white', padding: 28}}>
                <Text style={styles.title}>About Us</Text>
                <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non odio euismod lacinia at quis risus sed vulputate odio. Lectus sit amet est placerat in egestas erat imperdiet sed. Commodo odio aenean sed adipiscing diam donec adipiscing. Porttitor rhoncus dolor purus non enim praesent elementum. Quis risus sed vulputate odio ut.</Text>
                <TouchableOpacity
                    style={styles.button}
                    // onPress={() => navigate('HomeScreen')}
                    underlayColor='#fff'
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground>
        
    </View>)
}

const styles = StyleSheet.create ({

    title: {
        color: '#A4A4A4',
        fontWeight: '700',
        fontSize: 38,
        marginBottom: 10
    },

    text: {
        color: '#A4A4A4',
        fontSize: 15,
        lineHeight: 25
    },

    image: {
        flex: 1,
        justifyContent: "center",
        // opacity: .3
    },

    button: {
        backgroundColor: '#FF7070',
        fontSize: 100,
        padding: 10,
        marginTop: 10,
        marginLeft: 'auto',
        borderRadius: 10,
        width: 110
    },

    buttonText: {
        color: 'white',
        fontWeight: '700',
        textAlign: 'center'
    }

})


export default AboutUs