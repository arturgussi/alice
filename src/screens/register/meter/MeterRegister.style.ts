import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

import { ThemedColors } from '@constants/Theme.style';

type Style = {
  container: ViewStyle;
  flatListcontainer: ViewStyle;
  meterContainer: ViewStyle;
  buttonContainer: ViewStyle;
  text: TextStyle;
};

const styles: Style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  flatListcontainer: {
    flex: 1,
    justifyContent: 'flex-start',
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
