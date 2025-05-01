import {ThemedColors} from '@constants/Theme.style';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  containerWapper: {
    borderRadius: 10,
    padding: 16,
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
});

export default styles;
