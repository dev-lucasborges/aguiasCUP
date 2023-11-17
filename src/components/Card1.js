import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles";

export default function Card1({ circleColor1, circleColor2, scoreA, scoreB }) {
    // Função para converter a cor do time para um estilo
    const getCircleStyle = (color) => {
        return {
            ...styles.circle,
            backgroundColor: color,
        };
    };

    return (
        <View style={{ alignItems: 'center', backgroundColor: "#FFF", padding: 30, borderRadius: 22, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ justifyContent: 'center', alignItems: "center" }}>
                    <View style={getCircleStyle(circleColor1)} />
                    <Text style={{ fontWeight: 500, marginTop: 10 }}>Time A</Text>
                </View>

                <Text style={styles.boardText}>{scoreA}</Text>

                <Text style={styles.boardText}>-</Text>

                <Text style={styles.boardText}>{scoreB}</Text>

                <View style={{ justifyContent: 'center', alignItems: "center" }}>
                    <View style={getCircleStyle(circleColor2)} />
                    <Text style={{ fontWeight: 500, marginTop: 10 }}>Time B</Text>
                </View>
            </View>

            <View style={{ backgroundColor: 'red', borderRadius: 50, marginTop: 10, paddingLeft: 5, paddingRight: 5, marginTop: -25 }}>
                <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: "bold", padding: 5 }}>AO VIVO</Text>
            </View>
        </View>
    );
}
