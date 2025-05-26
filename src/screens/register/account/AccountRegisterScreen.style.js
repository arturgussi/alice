import { StyleSheet } from 'react-native';

import { ThemedColors } from '@constants/Theme.style';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    height: 80,
    width: 80,
  },
  inputContainer: {
    marginVertical: 8,
  },
  buttonContainer: {
    marginVertical: 14,
  },
  touchableOpacity: {
    height: 36,
    justifyContent: 'center',
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
  },
  login: {
    marginTop: 6,
    textAlign: 'center',
    color: ThemedColors.lightPuerple,
  },
});

export default styles;
