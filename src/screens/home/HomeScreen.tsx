import React from 'react';
import {View, Text} from 'react-native';

import styles from './HomeScreen.style';

import BackgroundWrapper from '@components/wrappers/BackgroundWrapper';
import {IconAccount2, IconGraph, IconNewMeasure, IconRegister} from '@assets/SVG';
import HomeMenuButton from '@components/buttons/HomeMenuButton';

const AuthScreen = () => {
  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Olá, Artur</Text>
        </View>
        <View style={styles.buttonContainer}>
          <HomeMenuButton
            text="Gráficos"
            onPress={() => console.log('Gráficos')}>
            <IconGraph size={20} />
          </HomeMenuButton>
          <HomeMenuButton
            text="Cadastrar"
            onPress={() => console.log('Cadastrar')}>
            <IconRegister size={20} />
          </HomeMenuButton>
          <HomeMenuButton
            text="Nova medição"
            onPress={() => console.log('Nova medição')}>
            <IconNewMeasure size={20} />
          </HomeMenuButton>
          <HomeMenuButton text="Perfil" onPress={() => console.log('Perfil')}>
            <IconAccount2 size={20} />
          </HomeMenuButton>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default AuthScreen;
