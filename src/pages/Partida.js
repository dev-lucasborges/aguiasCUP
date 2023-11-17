import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  getDatabase,
  ref,
  onValue,
  update,
  serverTimestamp,
} from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons/faArrowRotateLeft";
import { StatusBar } from "expo-status-bar";

const Partida = ({ route }) => {
  const { matchId, teamA, teamB } = route.params;
  const [scoreA, setScoreA] = useState({});
  const [scoreB, setScoreB] = useState({});
  const [inicioPartida, setInicioPartida] = useState(null);
  const [tempoPartida, setTempoPartida] = useState(0);
  const [acoesHistorico, setAcoesHistorico] = useState([]);
  const [mensagemTemporaria, setMensagemTemporaria] = useState("");

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
    creme: "beige",
  };

  useEffect(() => {
    const db = getDatabase();
    const matchRef = ref(db, `torneios/partidas/${matchId}`);

    /* const unsubscribe = onValue(matchRef, (snapshot) => {
      if (snapshot.exists() && snapshot.val().inicio) {
        setInicioPartida(snapshot.val().inicio);
      }
    }); */

    /* return () => unsubscribe(); */
  }, [matchId]);

  /* useEffect(() => {
            if (inicioPartida) {
                const interval = setInterval(() => {
                    const tempoAtual = Date.now();
                    const tempoDecorrido = Math.max(0, (tempoAtual - inicioPartida) / 1000); // Convertido para segundos
                    setTempoPartida(tempoDecorrido);
                }, 1000);

                return () => clearInterval(interval);
            }
        }, [inicioPartida]); */

  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
    );
    const db = getDatabase();
    const matchRef = ref(db, `torneios/partidas/${matchId}`);

    /* onValue(matchRef, (snapshot) => {
            if (snapshot.exists()) {
                const partidaData = snapshot.val();
                if (partidaData.inicio) {
                    // Iniciar intervalo para atualizar o tempo
                    const interval = setInterval(() => {
                        const tempoAtual = Date.now();
                        const tempoDecorrido = Math.max(0, (tempoAtual - partidaData.inicio) / 1000); // Convertido para segundos
                        setTempoPartida(tempoDecorrido);
                    }, 1000);
                    
                    return () => clearInterval(interval);
                };

            }
        }); */

    /*  const unsubscribe = onValue(matchRef, (snapshot) => {
            if (snapshot.exists()) {
                const partidaData = snapshot.val();
                if (partidaData.inicio) {
                    const tempoAtual = Date.now();
                    const tempoDecorrido = Math.max(0, (tempoAtual - partidaData.inicio) / 1000); // Convertido para segundos
                    setTempoPartida(tempoDecorrido);
                }
            }
        }); */

    initScores(teamA, setScoreA);
    initScores(teamB, setScoreB);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
      /* unsubscribe(); */
    };
  }, [teamA, teamB, matchId]);

  const exibirMensagemTemporaria = (mensagem) => {
    setMensagemTemporaria(mensagem);
    setTimeout(() => setMensagemTemporaria(""), 3000); // Oculta a mensagem após 3 segundos
  };

  const reverterUltimaAcao = () => {
    if (acoesHistorico.length > 0) {
      const ultimaAcao = acoesHistorico.pop();
      const { teamId, playerId, type, value } = ultimaAcao;

      const updateScores = teamId === "A" ? setScoreA : setScoreB;
      updateScores((prevScores) => {
        const newScores = { ...prevScores };
        const playerScore = newScores[playerId] || {};
        playerScore[type] = Math.max(0, (playerScore[type] || 0) - value);
        newScores[playerId] = playerScore;

        const db = getDatabase();
        const scorePath = `torneios/partidas/${matchId}/${teamId}/jogadores/${playerId}`;
        const updates = {};
        updates[`${type}`] = playerScore[type];
        update(ref(db, scorePath), updates);

        return newScores;
      });

      setAcoesHistorico(acoesHistorico);
    }
  };

  const adicionarAcaoAoHistorico = (
    teamId,
    playerId,
    type,
    value,
    playerName
  ) => {
    const novaAcao = { teamId, playerId, type, value, playerName };
    setAcoesHistorico((prevAcoes) => [...prevAcoes, novaAcao]);
    exibirMensagemTemporaria(
      `${type.toUpperCase()} para o jogador: ${playerName}`
    );
  };

  const initScores = (team, setScore) => {
    const initialScore = {};
    const playersArray = team?.jogadores
      ? Object.keys(team.jogadores).map((key) => ({
          id: key,
          ...team.jogadores[key],
        }))
      : [];

    playersArray.forEach((player) => {
      initialScore[player.id] = {
        pontos: 0,
        assistencias: 0,
        rebotes: 0,
        faltas: 0,
      };
    });

    setScore(initialScore);
  };

  const addScore = (teamId, playerId, type, value, playerName) => {
    const updateScores = teamId === "A" ? setScoreA : setScoreB;
    updateScores((prevScores) => {
      const newScores = { ...prevScores };
      const playerScore = newScores[playerId] || {};
      playerScore[type] = (playerScore[type] || 0) + value;
      newScores[playerId] = playerScore;

      const db = getDatabase();
      const scorePath = `torneios/partidas/${matchId}/${teamId}/jogadores/${playerId}`;
      const updates = {};
      updates[`${type}`] = playerScore[type];
      update(ref(db, scorePath), updates);

      adicionarAcaoAoHistorico(teamId, playerId, type, value, playerName);

      return newScores;
    });
  };

  const renderPlayer = (player, teamId) => {
    return (
      <View style={styles.playerContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            borderStyle: "solid",
            borderTopWidth: 1,
            paddingVertical: 5,
          }}
        >
          <View style={{ width: 200, justifyContent: "center" }}>
            <Text
              style={styles.playerName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {player.numeroCamisa}. {player.nome}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "73%",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#7BDA85",
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 5,
              }}
              onPress={() =>
                addScore(teamId, player.id, "pontos", 1, player.nome)
              }
            >
              <Text>P1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#7BDA85",
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 5,
              }}
              onPress={() =>
                addScore(teamId, player.id, "pontos", 2, player.nome)
              }
            >
              <Text>P2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#4EB258",
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 5,
              }}
              onPress={() =>
                addScore(teamId, player.id, "pontos", 3, player.nome)
              }
            >
              <Text>P3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#4EA0B2",
                paddingHorizontal: 12,
                paddingVertical: 3,
                borderRadius: 5,
              }}
              onPress={() =>
                addScore(teamId, player.id, "assistencias", 1, player.nome)
              }
            >
              <Text>A</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#E72DF7",
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 5,
              }}
              onPress={() =>
                addScore(teamId, player.id, "rebotes", 1, player.nome)
              }
            >
              <Text>R</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#FF4343",
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 5,
              }}
              onPress={() =>
                addScore(teamId, player.id, "faltas", 1, player.nome)
              }
            >
              <Text>F</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const getTotal = (score, type) => {
    return Object.values(score).reduce(
      (total, playerScore) => total + (playerScore[type] || 0),
      0
    );
  };

  const encerrarPartida = () => {
    const db = getDatabase();
    update(ref(db, `torneios/partidas/${matchId}`), {
      aoVivo: false,
      fim: serverTimestamp(),
    });

    alert("Partida encerrada");
  };

  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const secs = Math.floor(segundos % 60);
    const tempoFormatado = `${minutos}:${secs.toString().padStart(2, "0")}`;
    return tempoFormatado;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Team A */}
        <View style={styles.teamContainer}>
          <View
            style={{
              backgroundColor: mapeamentoDeCores[teamA.cor] || "transparent",
              height: 80,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#FFF",
                paddingVertical: 20,
                paddingHorizontal: 40,
                borderRadius: 22,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {teamA.liga}
                {" - "}
                <Text
                  style={{
                    color: mapeamentoDeCores[teamA.cor],
                    textTransform: "uppercase",
                  }}
                >
                  {teamA.cor}
                </Text>
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
            }}
          >
            <Text>Pontos: {getTotal(scoreA, "pontos")}</Text>
            <Text>Faltas: {getTotal(scoreA, "faltas")}</Text>
          </View>
          <FlatList
            data={Object.keys(teamA?.jogadores || {}).map((key) => ({
              id: key,
              ...teamA.jogadores[key],
            }))}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderPlayer(item, "A")}
          />
        </View>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Team B */}
        <View style={[styles.teamContainer]}>
          <View
            style={{
              backgroundColor: mapeamentoDeCores[teamB.cor] || "transparent",
              height: 80,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#FFF",
                paddingVertical: 20,
                paddingHorizontal: 40,
                borderRadius: 22,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {teamB.liga}
                {" - "}
                <Text
                  style={{
                    color: mapeamentoDeCores[teamB.cor],
                    textTransform: "uppercase",
                  }}
                >
                  {teamB.cor}
                </Text>
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              padding: 10,
            }}
          >
            <Text>Pontos: {getTotal(scoreB, "pontos")}</Text>
            <Text>Faltas: {getTotal(scoreB, "faltas")}</Text>
          </View>

          <FlatList
            style={styles.flatlist}
            data={Object.keys(teamB?.jogadores || {}).map((key) => ({
              id: key,
              ...teamB.jogadores[key],
            }))}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderPlayer(item, "B")}
          />
        </View>

        {/* Botão Encerrar Jogo */}
        <TouchableOpacity
          style={styles.encerrarJogoButton}
          onPress={encerrarPartida}
        >
          <Text style={styles.encerrarJogoButtonText}>Encerrar Jogo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reverterAcaoButton}
          onPress={reverterUltimaAcao}
        >
          <FontAwesomeIcon
            style={styles.reverterAcaoTexto}
            icon={faArrowRotateLeft}
          />
        </TouchableOpacity>

        {mensagemTemporaria !== "" && (
          <View style={styles.mensagemTemporariaContainer}>
            <Text style={styles.mensagemTemporariaTexto}>
              {mensagemTemporaria}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#000", // Ajuste conforme necessário
  },

  playerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 2,
    // Outros estilos necessários
  },
  playerName: {
    flex: 1, // Isso permite que o texto ocupe o espaço disponível
    marginLeft: 30,
    width: 100, // Espaço entre texto e botões
    // Ajuste o tamanho da fonte se necessário
  },

  encerrarJogoButton: {
    position: "absolute",
    top: 16,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
    borderColor: "#FFF",
    borderWidth: 2,
  },
  teamContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: 3,
    backgroundColor: "black",
  },
  encerrarJogoButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  mensagemTemporariaContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -50 }],
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
  mensagemTemporariaTexto: {
    color: "#FFF",
    textAlign: "center",
  },
  reverterAcaoButton: {
    position: "absolute",
    top: 20,
    backgroundColor: "#FF4343",
    padding: 10,
    borderRadius: 5,
    left: 20,
  },
  reverterAcaoTexto: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default Partida;
