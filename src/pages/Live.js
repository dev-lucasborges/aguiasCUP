import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import GoBackButton from "../components/GoBackButton"

const Live = () => {
    const [currentMatch, setCurrentMatch] = useState(null);

    const mapeamentoDeCores = {
        azul: "blue",
        vermelho: "red",
        amarelo: "yellow",
        laranja: "orange",
        cinza: "gray",
        verde: "green",
        branco: "white",
        preto: "black",
        lima: "lime",
        "azul-claro": "lightblue",
        rosa: "pink",
        creme: "beige"
    };

    const Circle = ({ color }) => {
        const backgroundColor = mapeamentoDeCores[color] || "gray";
        return (
            <View style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor,
                margin: 10,
            }} />
        );
    };

    useEffect(() => {
        const db = getDatabase();
        const matchRef = ref(db, 'torneios/partidas');

        const unsubscribe = onValue(matchRef, (snapshot) => {
            if (snapshot.exists()) {
                const matches = snapshot.val();
                const liveMatch = Object.values(matches).find(match => match.aoVivo);

                if (liveMatch) {
                    ['A', 'B'].forEach(teamKey => {
                        const teamStats = liveMatch[teamKey];
                        const team = teamKey === 'A' ? liveMatch.timeA : liveMatch.timeB;

                        if (teamStats && teamStats.jogadores) {
                            Object.keys(teamStats.jogadores).forEach(playerKey => {
                                const playerStats = teamStats.jogadores[playerKey];
                                if (team.jogadores[playerKey]) {
                                    team.jogadores[playerKey] = {
                                        ...team.jogadores[playerKey],
                                        ...playerStats,
                                    };
                                }
                            });
                        }
                    });

                    setCurrentMatch(liveMatch);
                }
            } else {
                console.log('Nenhuma partida encontrada');
            }
        }, (error) => {
            console.error('Falha ao obter dados:', error);
        });

        return () => unsubscribe();
    }, []);

    const calculateTeamStats = (teamData) => {
        return {
            pontos: Object.values(teamData.jogadores || {}).reduce((total, player) => total + (player.pontos || 0), 0),
            assistencias: Object.values(teamData.jogadores || {}).reduce((total, player) => total + (player.assistencias || 0), 0),
            faltas: Object.values(teamData.jogadores || {}).reduce((total, player) => total + (player.faltas || 0), 0),
            rebotes: Object.values(teamData.jogadores || {}).reduce((total, player) => total + (player.rebotes || 0), 0),
        };
    };

    if (!currentMatch) {
        return <SafeAreaView style={{alignItems: "center", justifyContent: "center"}}><Text>Carregando partida ao vivo...</Text></SafeAreaView>;
    }

    const statsA = calculateTeamStats(currentMatch.timeA);
    const statsB = calculateTeamStats(currentMatch.timeB);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#E67330"}}>

            <GoBackButton
            onPress={() => navigation.goBack()} 
            bgColor="bgColorWhite"
            />

            <View>
                {/* Estatísticas do Time A */}
                <View style={{backgroundColor: "#FFF", color: "#000", flexDirection: "row", margin: 30, padding: 20, borderRadius: 22, justifyContent: "space-between"}}>

                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={{alignItems: "center"}}>
                        <Circle color={currentMatch.timeA.cor} />
                        <Text>{currentMatch.timeA.liga}</Text>
                        <Text>Time A</Text>
                    </View>
                    <Text style={{fontSize: 50, fontWeight: 700}}>{statsA.pontos}</Text>
                </View>
                
                <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontSize: 40, color: "#E67330", fontWeight: "bold"}}> - </Text>
                </View>


                <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={{fontSize: 50, fontWeight: 700}}>{statsB.pontos}</Text>
                    <View style={{alignItems: "center"}}>
                        <Circle color={currentMatch.timeB.cor} />
                        <Text>{currentMatch.timeB.liga}</Text>
                        <Text>Time B</Text>
                    </View>
                </View>
                    
                </View>
                <Text>Time A - {currentMatch.timeA.nome} ({currentMatch.timeA.liga})</Text>
                <Text>Total de Pontos: {statsA.pontos}</Text>
                <Text>Total de Assistências: {statsA.assistencias}</Text>
                <Text>Total de Faltas: {statsA.faltas}</Text>
                <Text>Total de Rebotes: {statsA.rebotes}</Text>

                {/* Estatísticas do Time B */}
                <Text>Time B - {currentMatch.timeB.nome} ({currentMatch.timeB.liga})</Text>
                <Text>Total de Pontos: {statsB.pontos}</Text>
                <Text>Total de Assistências: {statsB.assistencias}</Text>
                <Text>Total de Faltas: {statsB.faltas}</Text>
                <Text>Total de Rebotes: {statsB.rebotes}</Text>
            </View>
        </SafeAreaView>
    );
};

export default Live;
