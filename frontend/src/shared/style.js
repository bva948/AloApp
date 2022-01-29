import { StyleSheet, Dimensions} from 'react-native';
const { width } = Dimensions.get('window');
const Style= StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  child: { 
    width, 
    justifyContent: 'center',
  },
  text: { 
    fontSize: width* 0.5, 
    textAlign: 'center' 
  },
});

export default Style;