import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import styles from './HomeScreen.style';

import BackgroundWrapper from '@components/wrappers/BackgroundWrapperTitle';
import {
  IconAccount2,
  IconGraph,
  IconNewMeasure,
  IconRegister,
} from '@assets/SVG';
import HomeMenuButton from '@components/buttons/HomeMenuButton';
import LinearScale from '@components/display/LinearScale';
import LinearGradientWrapper from '@components/wrappers/LinearGradientWrapper';
import {ThemedColors} from '@constants/Theme.style';
import AccordionButton from '@components/buttons/AccordionButton';

const HomeScreen = () => {
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
        <View style={styles.consumptionContainer}>
          <View>
            <Text style={styles.text}>Consumo mensal</Text>
            <LinearGradientWrapper
              color1={ThemedColors.background_card}
              color2={ThemedColors.background_card2}
              style={styles.containerWapper}>
              <LinearScale
                value={10}
                month="outubro"
                year="23"
                widthPercentage={1}
              />
              <LinearScale
                value={0}
                month="novembro"
                year="23"
                widthPercentage={0}
              />
            </LinearGradientWrapper>
          </View>
          <View>
            <LinearGradientWrapper
              color1={ThemedColors.background_card}
              color2={ThemedColors.background_card2}
              style={[styles.containerWapper, {flexDirection: 'row'}]}>
              <Text style={[styles.text, {flex: 1}]}>Consumo{'\n'}atual</Text>
              <Text style={styles.consumptionText}>R$67,34</Text>
            </LinearGradientWrapper>
          </View>
          <View>
            <LinearGradientWrapper
              color1={ThemedColors.background_card}
              color2={ThemedColors.background_card2}
              style={[styles.containerWapper, {flexDirection: 'row'}]}>
              <Text style={[styles.text, {flex: 1}]}>
                Consumo no{'\n'}último mês
              </Text>
              <Text style={styles.consumptionText}>R$132,21</Text>
            </LinearGradientWrapper>
          </View>
          <View>
            <LinearGradientWrapper
              color1={ThemedColors.background_card}
              color2={ThemedColors.background_card2}
              style={[styles.containerWapper, {flexDirection: 'row'}]}>
              <Text style={[styles.text, {flex: 1}]}>R$ kWh hoje</Text>
              <Text
                style={[styles.consumptionText, {color: ThemedColors.title}]}>
                R$0,57
              </Text>
            </LinearGradientWrapper>
          </View>
        </View>
        <View style={styles.consumptionContainer}>
          <Text style={styles.text}>Locais cadastrados</Text>
          <LinearGradientWrapper
            color1={ThemedColors.background_card}
            color2={ThemedColors.background_card2}
            style={[styles.containerWapper, styles.consumptionContainer]}>
            <AccordionButton title="Sala1">
              <LinearGradientWrapper
                color1={ThemedColors.background_submenu1}
                color2={ThemedColors.background_submenu2}
                style={[styles.containerWapper, styles.consumptionContainer]}>
                <Text style={styles.text}>Sala 1</Text>
              </LinearGradientWrapper>
            </AccordionButton>
            <AccordionButton title="Sala2"></AccordionButton>
          </LinearGradientWrapper>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default HomeScreen;
