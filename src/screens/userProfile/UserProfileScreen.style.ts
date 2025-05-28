import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

type Style = {
  container: ViewStyle;
  inputContainer: ViewStyle;
  buttonContainer: ViewStyle;
  text: TextStyle;
  modalOverlay: ViewStyle;
  centeredModalContentView: ViewStyle;
};

const styles: Style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  inputContainer: {
    marginVertical: 8,
  },
  buttonContainer: {
    marginVertical: 14,
  },
  text: {
    marginTop: 10,
    marginBottom: 24,
    fontSize: 18,
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  centeredModalContentView: {},
});

export default styles;
