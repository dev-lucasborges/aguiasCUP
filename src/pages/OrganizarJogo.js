import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, get, getDatabase, push, serverTimestamp, set } from 'firebase/database';
import * as ScreenOrientation from 'expo-screen-orientation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowRotateLeft } from '@fortawesome/free-solid-svg-icons/faArrowRotateLeft'

const OrganizarJogo = ({ route }) => {
    const navigation = useNavigation();
    const { tournamentId } = route.params;
    const [teams, setTeams] = useState([]);
    const [teamA, setTeamA] = useState(null);
    const [teamB, setTeamB] = useState(null);
    const [lastAction, setLastAction] = useState(null);
    const db = getDatabase();
    const matchRef = push(ref(db, 'torneios/partidas'));
    const matchId = matchRef.key;

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
    

    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);

        const fetchTeams = async () => {
            
            const teamsRef = ref(db, `torneios/${tournamentId}/times`);
            const snapshot = await get(teamsRef);
            

            if (snapshot.exists()) {
                const teamsData = snapshot.val();
                const teamsList = Object.keys(teamsData).map(key => ({
                    id: key,
                    ...teamsData[key],
                }));

                setTeams(teamsList);
            }
        };

        fetchTeams();

        return () => {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
        };
    }, [tournamentId]);

    

    const selectTeam = team => {
        if (!teamA) {
            setTeamA(team);
            setTeams(teams.filter(t => t.id !== team.id));
            setLastAction('A');
        } else if (!teamB && team.id !== teamA.id) {
            setTeamB(team);
            setTeams(teams.filter(t => t.id !== team.id));
            setLastAction('B');
        }
    };

    const revertLastAction = () => {
        let revertedTeam = null;
        if (lastAction === 'B') {
            revertedTeam = teamB;
            setTeamB(null);
            setLastAction(teamA ? 'A' : null);
        } else if (lastAction === 'A') {
            revertedTeam = teamA;
            setTeamA(null);
            setLastAction(null);
        }
        if (revertedTeam) {
            setTeams([...teams, revertedTeam]);
        }
    };

    const handleStartGame = async () => {
        if (teamA && teamB) {
            const db = getDatabase();
            const matchRef = push(ref(db, 'torneios/partidas'));
            const matchId = matchRef.key;

            await set(matchRef, {
                aoVivo: true,
                inicio: serverTimestamp(), // Horário do servidor do Firebase
                timeA: teamA,
                timeB: teamB,
            });

            navigation.navigate('Partida', { matchId, teamA, teamB });
        } else {
            alert('Por favor, selecione dois times.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: mapeamentoDeCores[teamA?.cor] || "transparent"}}>
                <Text>Time A</Text>
                {teamA && <Text style={{fontWeight: 600, fontSize: 17}}>{teamA.nome}</Text>}
            </View>
            <View style={styles.middleContainer}>
                <Text style={{color: "#FFF", fontSize: 30, marginVertical: 30, fontWeight: "bold"}}>Times</Text>
                <FlatList
                    data={teams}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => selectTeam(item)}>
                            <View style={{backgroundColor: "#FFF", padding: 10, borderRadius: 17, marginVertical: 5, flexDirection: "row", alignItems: "center", width: 250}}>
                            <View style={{
                            height: 30, // Tamanho do círculo
                            width: 30, // Tamanho do círculo
                            borderRadius: 30, // Metade da altura e largura para torná-lo um círculo
                            backgroundColor: mapeamentoDeCores[item.cor] || '#000',
                            marginEnd: 10,
                            borderWidth: 1
                            }} />
                            <Text style={{fontWeight: 600, color: "#000",}}>{item.nome}</Text>
                        </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: mapeamentoDeCores[teamB?.cor] || "transparent"}}>
                <Text>Time B</Text>
                {teamB && <Text style={{fontWeight: 600, fontSize: 17}}>{teamB.nome}</Text>}
            </View>
            <TouchableOpacity onPress={handleStartGame} style={styles.startButton}>
                <Text style={{color: "#FFF"}}>Começar Jogo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={revertLastAction} style={styles.revertButton}>
            <FontAwesomeIcon style={{color: "#FFF"}}icon={faArrowRotateLeft} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
    },
    sideContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    middleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 3,
        borderRightWidth: 3,
        backgroundColor: "#060610"
    },
    startButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: 'blue',
        padding: 10,
        color: "#FFF",
        borderRadius: 10,
        paddingHorizontal: 40
    },
    revertButton: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 20
    },
});

export default OrganizarJogo;
