import { ThemedColors } from '@/constants/Theme.style';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

type Style = {
  container: ViewStyle;
  scrollView: ViewStyle;
  spacer: ViewStyle;
  inputContainer: ViewStyle;
  buttonContainer: ViewStyle;
  text: TextStyle;
  modalOverlay: ViewStyle;
  centeredModalContentView: ViewStyle;
  pageTitle: TextStyle;
  toggleContainer: ViewStyle;
  pickerContainer: ViewStyle;
  picker: TextStyle;
};

const styles: Style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  scrollView: {
    flex: 1,
  },
  spacer: { flex: 1 },
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
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    padding: 10,
    backgroundColor: ThemedColors.background_card,
    borderRadius: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: ThemedColors.text,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
  },
  picker: { height: 50, color: ThemedColors.text },
});

export default styles;
