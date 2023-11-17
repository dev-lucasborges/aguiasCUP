import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E67330",
  },
  text: {
    fontSize: 16,
    color: 'blue',
  },
  button: {
    width: "90%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    marginTop: 10,
    marginBottom: 10
  },
  bgColorWhite: {
    backgroundColor: '#FFF',
    color: '#000'
  },
  bgColorDark: {
    backgroundColor: '#060610',
    color: '#FFF'
  },
  GoBackButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent:"center",
    borderRadius: 50,
    marginStart: 30,
    marginTop: 30
  },
  boardText: {
    fontSize: 50,
    marginStart: 10,
    marginEnd: 10,
    fontWeight: "bold",
    marginTop: -20
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 50
  },
  blue:{
    backgroundColor: "blue"
  },
  red:{
    backgroundColor: "red"
  },
  safeMargin: {
    padding: 20,
  }
  
});

export default styles;
