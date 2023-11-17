import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Card2(props) {
  const cestasTimeA = 21;
  const cestasTimeB = 12;
  const totalCestas = cestasTimeA + cestasTimeB;

  const assistsTimeA = 10;
  const assistsTimeB = 10;
  const totalAssists = assistsTimeA + assistsTimeB;

  const faltasTimeA = 1;
  const faltasTimeB = 3;
  const totalFaltas = faltasTimeA + faltasTimeB;

  const rebotesTimeA = 11;
  const rebotesTimeB = 12;
  const totalRebotes = rebotesTimeA + rebotesTimeB;

  const percentRebotesTimeA = (rebotesTimeA / totalRebotes) * 100;
  const percentRebotesTimeB = (rebotesTimeB / totalRebotes) * 100;

  const percentFaltasTimeA = (faltasTimeA / totalFaltas) * 100;
  const percentFaltasTimeB = (faltasTimeB / totalFaltas) * 100;

  const percentAssistsTimeA = (assistsTimeA / totalAssists) * 100;
  const percentAssistsTimeB = (assistsTimeB / totalAssists) * 100;

  // Calcular a porcentagem de cestas feitas para cada time
  const percentCestasTimeA = (cestasTimeA / totalCestas) * 100;
  const percentCestasTimeB = (cestasTimeB / totalCestas) * 100;

  return (
    <View style={styles.container}>


      <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
        <Text>{cestasTimeA}</Text>
        <Text style={{fontWeight: 600, marginBottom: 1}}>Cestas Feitas</Text>
        <Text>{cestasTimeB}</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentCestasTimeA}%`, backgroundColor: "blue" }]} />
        <View style={[styles.progressBar, { width: `${percentCestasTimeB}%`, backgroundColor: "red" }]} />
      </View>

      <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
        <Text>{assistsTimeA}</Text>
        <Text style={{fontWeight: 600, marginBottom: 1}}>Assistências</Text>
        <Text>{assistsTimeB}</Text>
      </View>
    
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentAssistsTimeA}%`, backgroundColor: "blue" }]} />
        <View style={[styles.progressBar, { width: `${percentAssistsTimeB}%`, backgroundColor: "red" }]} />
      </View>

      <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
        <Text>{faltasTimeA}</Text>
        <Text style={{fontWeight: 600, marginBottom: 1}}>Faltas</Text>
        <Text>{faltasTimeB}</Text>
      </View>
    
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentFaltasTimeA}%`, backgroundColor: "blue" }]} />
        <View style={[styles.progressBar, { width: `${percentFaltasTimeB}%`, backgroundColor: "red" }]} />
      </View>

      <View style={{flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
        <Text>{rebotesTimeA}</Text>
        <Text style={{fontWeight: 600, marginBottom: 1}}>Rebotes</Text>
        <Text>{rebotesTimeB}</Text>
      </View>
    
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentRebotesTimeA}%`, backgroundColor: "blue" }]} />
        <View style={[styles.progressBar, { width: `${percentRebotesTimeB}%`, backgroundColor: "red" }]} />
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 22,
  },
  progressBarContainer: {
    flexDirection: "row",
    width: "100%",
    height: 16,
    borderRadius: 8,
    marginVertical: 10,
    overflow: "hidden", // Garante que as barras de progresso não ultrapassem os limites da View
  },
  progressBar: {
    height: "100%",
  },
  textContainer: {
    width: "100%",
  },
  teamInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});
