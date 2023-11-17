import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import GoBackButton from "../components/GoBackButton";

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
    creme: "beige",
  };

  const Circle = ({ color }) => {
    const backgroundColor = mapeamentoDeCores[color] || "gray";
    return (
      <View
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
          backgroundColor,
          margin: 10,
        }}
      />
    );
  };

  useEffect(() => {
    const db = getDatabase();
    const matchRef = ref(db, "torneios/partidas");

    const unsubscribe = onValue(
      matchRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const matches = snapshot.val();
          const liveMatch = Object.values(matches).find(
            (match) => match.aoVivo
          );

          if (liveMatch) {
            ["A", "B"].forEach((teamKey) => {
              const teamStats = liveMatch[teamKey];
              const team = teamKey === "A" ? liveMatch.timeA : liveMatch.timeB;

              if (teamStats && teamStats.jogadores) {
                Object.keys(teamStats.jogadores).forEach((playerKey) => {
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
          console.log("Nenhuma partida encontrada");
        }
      },
      (error) => {
        console.error("Falha ao obter dados:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const calculateTeamStats = (teamData) => {
    return {
      pontos: Object.values(teamData.jogadores || {}).reduce(
        (total, player) => total + (player.pontos || 0),
        0
      ),
      assistencias: Object.values(teamData.jogadores || {}).reduce(
        (total, player) => total + (player.assistencias || 0),
        0
      ),
      faltas: Object.values(teamData.jogadores || {}).reduce(
        (total, player) => total + (player.faltas || 0),
        0
      ),
      rebotes: Object.values(teamData.jogadores || {}).reduce(
        (total, player) => total + (player.rebotes || 0),
        0
      ),
    };
  };

  if (!currentMatch) {
    return (
      <SafeAreaView
        style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
      >
        <Text style={{ marginBottom: 10 }}>
          Aguardando uma partida começar...
        </Text>
      </SafeAreaView>
    );
  }

  const statsA = calculateTeamStats(currentMatch.timeA);
  const statsB = calculateTeamStats(currentMatch.timeB);

  const ProgressBar = ({ value, maxValue, color, backgroundColor }) => {
    const width = (value / maxValue) * 100 + "%";
    return (
      <View
        style={{
          flexDirection: "row",
          height: 13,
          width: "100%",
          backgroundColor: backgroundColor || "#e0e0e0", // cor de fundo padrão se backgroundColor não for fornecido
          borderRadius: 10,
        }}
      >
        <View style={{ width, backgroundColor: color, borderRadius: 10 }} />
      </View>
    );
  };

  const maxStats = {
    pontos: Math.max(statsA.pontos, statsB.pontos),
    assistencias: Math.max(statsA.assistencias, statsB.assistencias),
    rebotes: Math.max(statsA.rebotes, statsB.rebotes),
    faltas: Math.max(statsA.faltas, statsB.faltas),
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E67330" }}>
      <GoBackButton
        onPress={() => navigation.goBack()}
        bgColor="bgColorWhite"
      />

      <View>
        {/* Estatísticas do Time A */}
        <View
          style={{
            backgroundColor: "#FFF",
            color: "#000",
            flexDirection: "row",
            margin: 30,
            padding: 20,
            borderRadius: 22,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              width: 80,
              backgroundColor: "#FF1E1E",
              position: "absolute",
              bottom: 15,
              left: "50%",
              marginLeft: -20,
              alignItems: "center",
              borderRadius: 20,
              paddingVertical: 3,
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold" }}>AO VIVO</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ alignItems: "center" }}>
              <Circle color={currentMatch.timeA.cor} />
              <Text>{currentMatch.timeA.liga}</Text>
              <Text>Time A</Text>
            </View>
            <Text style={{ fontSize: 50, fontWeight: 700 }}>
              {statsA.pontos}
            </Text>
          </View>

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text
              style={{ fontSize: 40, color: "#E67330", fontWeight: "bold" }}
            >
              {" "}
              -{" "}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 50, fontWeight: 700 }}>
              {statsB.pontos}
            </Text>
            <View style={{ alignItems: "center" }}>
              <Circle color={currentMatch.timeB.cor} />
              <Text>{currentMatch.timeB.liga}</Text>
              <Text>Time B</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: "85%",
            backgroundColor: "#FFF",
            marginHorizontal: 30,
            padding: 20,
            borderRadius: 22,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            {" "}
            Pontos
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ width: "10%" }}>{statsA.pontos}</Text>

            <View style={{ width: "60%" }}>
              <ProgressBar
                value={statsA.pontos}
                maxValue={maxStats.pontos}
                color={mapeamentoDeCores[currentMatch.timeA.cor] || "gray"}
                backgroundColor={
                  mapeamentoDeCores[currentMatch.timeB.cor] || "#e0e0e0"
                }
              />
            </View>

            <Text style={{ width: "10%" }}>{statsB.pontos}</Text>
          </View>

          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginVertical: 10,
            }}
          >
            {" "}
            Assistências
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ width: "10%" }}>{statsA.assistencias}</Text>

            <View style={{ width: "60%" }}>
              <ProgressBar
                value={statsA.assistencias}
                maxValue={maxStats.assistencias}
                color={mapeamentoDeCores[currentMatch.timeA.cor] || "gray"}
                backgroundColor={
                  mapeamentoDeCores[currentMatch.timeB.cor] || "#e0e0e0"
                }
              />
            </View>

            <Text style={{ width: "10%" }}>{statsB.assistencias}</Text>
          </View>

          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginVertical: 10,
            }}
          >
            {" "}
            Rebotes
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ width: "10%" }}>{statsA.rebotes}</Text>

            <View style={{ width: "60%" }}>
              <ProgressBar
                value={statsA.rebotes}
                maxValue={maxStats.rebotes}
                color={mapeamentoDeCores[currentMatch.timeA.cor] || "gray"}
                backgroundColor={
                  mapeamentoDeCores[currentMatch.timeB.cor] || "#e0e0e0"
                }
              />
            </View>

            <Text style={{ width: "10%" }}>{statsB.rebotes}</Text>
          </View>

          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginVertical: 10,
            }}
          >
            {" "}
            Faltas
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ width: "10%" }}>{statsA.faltas}</Text>

            <View style={{ width: "60%" }}>
              <ProgressBar
                value={statsA.faltas}
                maxValue={maxStats.faltas}
                color={mapeamentoDeCores[currentMatch.timeA.cor] || "gray"}
                backgroundColor={
                  mapeamentoDeCores[currentMatch.timeB.cor] || "#e0e0e0"
                }
              />
            </View>

            <Text style={{ width: "10%" }}>{statsB.faltas}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Live;
