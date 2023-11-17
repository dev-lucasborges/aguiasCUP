import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import styles from "../../styles"
export default function GoBackButton(props) {
  const navigation = useNavigation()
  const combinedStyles = [styles.GoBackButton, styles[props.bgColor]];

  return (
    <View>
      <TouchableOpacity style={combinedStyles} onPress={() => navigation.goBack()} >
        <FontAwesomeIcon icon={faChevronLeft} />
      </TouchableOpacity>
    </View>
  );
}
