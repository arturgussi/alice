import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
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
    height: 50,
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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default styles;
