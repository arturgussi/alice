import { ThemedColors } from '@constants/Theme.style';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
  },
  flatListcontainer: {
    flex: 1,
    justifyContent: 'start',
  },
  meterContainer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: ThemedColors.placeholder,
  },
  buttonContainer: {
    marginVertical: 14,
  },
  text: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '400',
  },
});

export default styles;
