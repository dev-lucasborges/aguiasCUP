import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../../styles";

export default function Button(props) {
  const combinedStyles = [styles.button, styles[props.bgColor]];
  const textColor = styles[props.bgColor]?.color || styles.text.color;

  return (
    <TouchableOpacity style={combinedStyles} onPress={props.onPress}>
      <Text style={{ fontSize: 17, fontWeight: 600, color: textColor }}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}
