import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { ThemedColors } from '@/constants/Theme.style';

type Style = {
  container: ViewStyle;
  scrollViewContent: ViewStyle;
  spacer: ViewStyle;
  inputContainer: ViewStyle;
  buttonContainer: ViewStyle;
  text: TextStyle;
  modalOverlay: ViewStyle;
  centeredModalContentView: ViewStyle;
  pageTitle: TextStyle;
  sectionTitle: TextStyle;
  passwordInstruction: TextStyle;
  toggleContainer: ViewStyle;
  pickerContainer: ViewStyle;
  picker: TextStyle;
};

const createStyles = (): Style =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    spacer: {
      flex: 1,
    },
    inputContainer: {
      marginVertical: 8,
    },
    buttonContainer: {
      marginTop: 20,
    },
    text: {
      marginTop: 10,
      marginBottom: 24,
      fontSize: 18,
      fontWeight: '400',
      color: ThemedColors.text,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    centeredModalContentView: {},
    pageTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
      color: ThemedColors.text,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: ThemedColors.text,
      marginTop: 24,
      marginBottom: 12,
    },
    passwordInstruction: {
      fontSize: 13,
      color: ThemedColors.text,
      textAlign: 'center',
      marginVertical: 8,
    },

    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 15,
      padding: 12,
      paddingLeft: 16,
      backgroundColor: ThemedColors.background_card,
      borderRadius: 8,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: ThemedColors.placeholder,
      borderRadius: 15,
      justifyContent: 'center',
      marginBottom: 6,
    },
    picker: {
      color: ThemedColors.text || 'white',
      fontSize: 14,
      fontWeight: '400',
      height: 52,
    },
  });

const styles = createStyles();

export default styles;
