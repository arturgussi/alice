import React, {useState} from 'react';
import {View} from 'react-native';

import styles from './PlaceRegisterScreen.style';

import BackgroundWrapper from '@components/wrappers/BackgroundWrapperTitle';
import ThemedTextInput from '@components/inputs/ThemedTextInput';
import ThemedText from '@components/texts/ThemedText';
import PrimaryButton from '@components/buttons/PrimaryButton';

const PlaceRegisterScreen = () => {
  const [placeName, setPlaceName] = useState('');

  const handleRegister = () => {
    console.log('Register', placeName);
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <ThemedText style={styles.text}>Cadastro do local</ThemedText>
        <View style={styles.inputContainer}>
          <ThemedTextInput
            placeholder="Apelido/Nome do local"
            autoCapitalize="none"
            keyboardType="default"
            value={placeName}
            onChangeText={setPlaceName}
          />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton title="Criar conta" onPress={handleRegister} />
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default PlaceRegisterScreen;
