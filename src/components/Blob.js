import { View, Image, SafeAreaView } from 'react-native'
import styles from '../../styles'

export default function Blob(){
    return(

        <View 
        style={{
        height: "65%",
        borderBottomLeftRadius: 70, 
        borderBottomRightRadius: 70
        }}>
        
        <Image
            source={require("../../assets/brancp.png")}
            style={{
            width: "100%",
            height: "100%"   
        }}/>

        </View>
    )
}