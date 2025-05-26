import { StyleSheet } from 'react-native';

import { ThemedColors } from '@constants/Theme.style';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  consumptionContainer: {
    gap: 10,
  },
  containerWapper: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'rgba(210,210,210,1)',
  },
  text: {
    fontSize: 16,
    color: ThemedColors.text,
  },
  consumptionText: {
    color: ThemedColors.purple,
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default styles;
