import LinearGradientWrapper from '@components/wrappers/LinearGradientWrapper';
import {ThemedColors} from '@constants/Theme.style';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

type LinearScaleProps = {
  value: number;
  month: string;
  year: string;
  widthPercentage: number;
};

const LinearScale = ({
  value,
  month,
  year,
  widthPercentage,
}: LinearScaleProps) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<View>(null);

  // Calcula a largura da tela dinamicamente
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(Dimensions.get('window').width - 90);
      }
    };

    updateWidth();
    Dimensions.addEventListener('change', updateWidth);

    return () => {};
  }, []);

  // Calcula a largura da barra com base na porcentagem e largura do container
  const barWidth = containerWidth * widthPercentage;

  return (
    <View style={styles.container} ref={containerRef}>
      <Text style={styles.text}>
        {month}/{year}
      </Text>
      <View style={styles.linearScaleBackground}>
        <LinearGradientWrapper
          color1={ThemedColors.darkPurple_icon}
          color2={ThemedColors.lightPurple_icon}
          style={[styles.bar, {width: barWidth}]}
          direction="horizontal">
          <View />
        </LinearGradientWrapper>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginRight: Math.min(
              Math.max(0, containerWidth - barWidth - 26), // Limita o máximo que o texto avança
              containerWidth - 46, // Limita o mínimo que o texto recua
            ),
          }}>
          <Text style={styles.textConsumptionValue}>{value} </Text>
          <Text style={[styles.textConsumption]}>kWh</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  linearScaleBackground: {
    backgroundColor: ThemedColors.background,
    height: 20,
    borderRadius: 100,
  },
  bar: {
    height: 20,
    borderRadius: 100,
  },
  textConsumptionValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  textConsumption: {
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
  },
  text: {
    fontSize: 12,
    marginTop: 8,
    color: ThemedColors.text,
  },
});

export default LinearScale;
