import { View, Text, Button, ScrollView, FlatList, StyleSheet } from "react-native"
import { SvgXml } from "react-native-svg"

const leaf_xml = `<svg width="60" height="39" viewBox="0 0 60 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.7" d="M23.5714 22.5714C22.7827 20.5256 21.9319 18.7338 21.0627 17.1739M13.0348 8.31129C14.6037 8.97479 17.9506 11.5884 21.0627 17.1739M21.0627 17.1739C25.0767 9.32987 19.5575 4.23696 16.0453 3.21838C12.5331 2.1998 7.01394 1.69051 3 2.1998C7.51568 9.32976 5.00697 12.3855 9.02091 16.4598C12.2321 19.7193 16.0453 20.1946 17.5505 20.0249" stroke="#C0C0C0" stroke-width="3" stroke-linecap="round"/>
<path opacity="0.7" d="M26.1429 37.1428C27.2065 34.0972 28.4358 31.2432 29.7985 28.6191M46.3771 11.5719C43.1494 12.7716 40.0021 15.0079 37.0958 18.09M29.7985 28.6191C23.1078 18.5914 31.2014 7.05942 41.8244 6.05664C50.3227 5.25442 55.4825 5.38812 57 5.55525C49.4122 17.5886 51.4356 23.6053 47.3888 27.115C43.9201 30.1233 41.8244 31.6275 33.2249 30.6247M29.7985 28.6191C31.1561 26.0049 32.646 23.6188 34.2366 21.4989M37.0958 18.09C38.0459 14.8811 38.6206 12.7419 38.7893 12.0733M37.0958 18.09C36.1131 19.1321 35.158 20.2709 34.2366 21.4989M34.2366 21.4989C39.0928 19.9751 42.6675 20.597 43.8478 21.0983" stroke="#C0C0C0" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const bread_xml = `<svg width="69" height="34" viewBox="0 0 69 34" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M34.5 2L46.831 2C57.581 2 65.4855 12.3125 66.434 18.875C67.3825 25.4375 68.6473 32 56.3163 32C46.4515 32 37.6618 32 34.5 32" stroke="#D3D3D3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M34.5 2L22.169 2C11.419 2 3.51453 12.3125 2.566 18.875C1.61746 25.4375 0.352748 32 12.6837 32C22.5485 32 31.3382 32 34.5 32" stroke="#D3D3D3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.1904 2C19.8741 3.68972 16.5123 8.08303 13.596 12.1383C11.4695 15.0953 15.4186 21.1069 19.3678 16.0377C22.5271 11.9824 27.7723 4.98951 30 2" stroke="#D3D3D3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M36.1904 2C34.8741 3.68972 31.5123 8.08303 28.596 12.1383C26.4695 15.0953 30.4186 21.1069 34.3678 16.0377C37.5271 11.9824 42.7723 4.98951 45 2" stroke="#D3D3D3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M50.6087 3C49.2899 4.66528 46.5189 8.22646 43.5971 12.2231C41.4666 15.1374 45.4232 21.0619 49.3797 16.0661C52.5449 12.0694 54.7681 9.40494 57 6.45867" stroke="#D3D3D3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`

// const 

const foods = [

    {
        foodName: 'Braised Cauliflower',
        type: "vegetable",
        calorieCount: 100
    },

    {
        foodName: 'Boiled Broccoli',
        type: "vegetable",
        calorieCount: 120
    },

    {
        foodName: 'Pickled Radishes',
        type: "vegetable",
        calorieCount: 80
    },

    {
        foodName: 'Mixed Greens',
        type: "vegetable",
        calorieCount: 80
    },

    {
        foodName: 'Garlic Naan',
        type: "grain",
        calorieCount: 200
    },
    

    {
        foodName: 'Boiled Broccoli',
        type: "vegetable",
        calorieCount: 150,
        station: 'A'
    },
    

    {
        foodName: 'Pickled Radishes',
        type: "vegetable",
        calorieCount: 150,
        station: 'A'
    },
    

    {
        foodName: 'Mixed Greens',
        type: "vegetable",
        calorieCount: 150,
        station: 'A'
    },
    

]

const FoodItem = ({foodName, type, calorieCount, station}) => (

    <View style={styles.foodItem}>

        <View>
            <Text style={styles.foodName}>{foodName}</Text>

            {station ? <Text style={styles.calorieCount}>Station {station}<Text/><Text style={{color: 'black', fontWeight: '600'}}> | </Text>{calorieCount} Calories</Text> 
            : <Text style={styles.calorieCount}>{calorieCount} Calories</Text> }
            
        </View>
        
        { type == 'vegetable' ?

            <SvgXml style={{marginLeft: 'auto'}} xml={leaf_xml} height="100%"/> 
            
            : <SvgXml style={{marginLeft: 'auto'}} xml={bread_xml} height="100%"/>

        }

    </View>

);

const renderFood = ({item}) => {
    return (
        <FoodItem 
            foodName={item.foodName}
            type={item.type}
            calorieCount={item.calorieCount}
            station={item.station}
        />
    );
}

const DiningMenu = ({navigation})=> {

    return (
    
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

            <FlatList 
                data = {foods}
                showsVerticalScrollIndicator={false}
                renderItem = {renderFood}
                contentContainerStyle={{ paddingBottom: 40 }}
                // keyExtractor={(item) => item.foodName}
                style={{width: '100%'}}    
            />
            
        </View>

    )
    
}


export default DiningMenu

const styles = StyleSheet.create({

    foodItem: {

        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        margin: 15,
        marginBottom: 0,

        // drop shadow for ios
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,  
        flexDirection: 'row',

        // drop shadow for android
        elevation: 5

    },

    foodName: {
        fontWeight: "700",
        fontSize: 20
    },

    calorieCount: {
        color: 'gray'
    }

})