import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const DraggableTeam = ({ team, onSelect }) => {
    const [lastOffset, setLastOffset] = useState({ x: 0, y: 0 });
    const translateX = new Animated.Value(0);
    const translateY = new Animated.Value(0);

    const onGestureEvent = Animated.event(
        [
            {
                nativeEvent: {
                    translationX: translateX,
                    translationY: translateY
                }
            }
        ],
        { useNativeDriver: true }
    );

    const onHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            Animated.spring(translateX, {
                toValue: lastOffset.x + event.nativeEvent.translationX,
                useNativeDriver: true
            }).start();

            Animated.spring(translateY, {
                toValue: lastOffset.y + event.nativeEvent.translationY,
                useNativeDriver: true
            }).start();

            setLastOffset({
                x: lastOffset.x + event.nativeEvent.translationX,
                y: lastOffset.y + event.nativeEvent.translationY
            });

            onSelect(team, { x: translateX, y: translateY });
        }
    };

    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
        >
            <Animated.View
                style={[
                    styles.draggable,
                    {
                        transform: [{ translateX: translateX }, { translateY: translateY }]
                    }
                ]}
            >
                <Text>{team.nome}</Text>
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    draggable: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue',
        margin: 10
    }
});

export default DraggableTeam;
