import {
  ActivityIndicator,
  Button,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AccordionButton from '@/components/buttons/AccordionButton';
import LinearScale from '@/components/display/LinearScale';
import BackgroundWrapper from '@/components/wrappers/BackgroundWrapper';
import LinearGradientWrapper from '@/components/wrappers/LinearGradientWrapper';
import { ThemedColors } from '@/constants/Theme.style';
import { useAuth } from '@/hooks/useAuth';
import { useEquipment } from '@/hooks/useEquipment';
import { AppEquipment } from '@/types/models/EquipmentModel';

import styles from './HomeScreen.style';

const HomeScreen = () => {
  const { appUser } = useAuth();
  const tariff = appUser?.tariff;

  const {
    equipments,
    isLoading: isLoadingEquipments,
    isError: isErrorEquipments,
    error: errorEquipments,
    refetchEquipments,
    isFetching,
  } = useEquipment();

  const renderGastoInfo = (equipamento: AppEquipment) => {
    const valorGastoPlaceholder = (Math.random() * 100)
      .toFixed(2)
      .replace('.', ',');
    const consumoKWhPlaceholder = Math.floor(Math.random() * 1000);

    return (
      <LinearGradientWrapper
        color1={
          ThemedColors.background_submenu1 || ThemedColors.background_card
        }
        color2={
          ThemedColors.background_submenu2 || ThemedColors.background_card2
        }
        style={styles.containerWapper}
      >
        <View style={localStyles.gastoRow}>
          <Text
            style={localStyles.gastoValor}
          >{`R$${valorGastoPlaceholder}`}</Text>
          <Text
            style={localStyles.gastoConsumo}
          >{`${consumoKWhPlaceholder}kWh`}</Text>
        </View>
      </LinearGradientWrapper>
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetchEquipments} />
      }
    >
      <BackgroundWrapper>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>
              Olá, {appUser?.displayName || 'Usuário'}
            </Text>
          </View>

          <View style={styles.consumptionContainer}>
            <View>
              <Text style={styles.text}>Consumo mensal</Text>
              <LinearGradientWrapper
                color1={ThemedColors.background_card}
                color2={ThemedColors.background_card2}
                style={styles.containerWapper}
              >
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
                style={[styles.containerWapper, { flexDirection: 'row' }]}
              >
                <Text style={[styles.text, { flex: 1 }]}>
                  Consumo{'\n'}atual
                </Text>
                <Text style={styles.consumptionText}>R$67,34</Text>
              </LinearGradientWrapper>
            </View>
            <View>
              <LinearGradientWrapper
                color1={ThemedColors.background_card}
                color2={ThemedColors.background_card2}
                style={[styles.containerWapper, { flexDirection: 'row' }]}
              >
                <Text style={[styles.text, { flex: 1 }]}>
                  Consumo no{'\n'}último mês
                </Text>
                <Text style={styles.consumptionText}>R$132,21</Text>
              </LinearGradientWrapper>
            </View>
            <View>
              <LinearGradientWrapper
                color1={ThemedColors.background_card}
                color2={ThemedColors.background_card2}
                style={[styles.containerWapper, { flexDirection: 'row' }]}
              >
                <Text style={[styles.text, { flex: 1 }]}>R$ kWh hoje</Text>
                <Text
                  style={[
                    styles.consumptionText,
                    { color: ThemedColors.title },
                  ]}
                >
                  {tariff === undefined ? 'Sem dados' : `R${tariff.toFixed(2)}`}
                </Text>
              </LinearGradientWrapper>
            </View>
          </View>

          {/* Seção de Equipamentos com Accordions */}
          <View style={localStyles.equipmentsSection}>
            <Text style={styles.text}>Equipamentos</Text>
            {isLoadingEquipments && (
              <ActivityIndicator
                size="large"
                color={ThemedColors.text}
                style={{ marginTop: 20 }}
              />
            )}
            {isErrorEquipments && (
              <View style={localStyles.errorContainer}>
                <Text style={localStyles.errorText}>
                  Erro ao carregar equipamentos: {errorEquipments?.message}
                </Text>
                <Button
                  title="Tentar Novamente"
                  onPress={() => refetchEquipments()}
                  color={ThemedColors.text}
                />
              </View>
            )}
            {!isLoadingEquipments &&
              !isErrorEquipments &&
              (!equipments || equipments.length === 0) && (
                <Text style={localStyles.noEquipmentText}>
                  {appUser?.uid
                    ? 'Nenhum equipamento cadastrado.'
                    : 'Faça login para visualizar seus equipamentos.'}
                </Text>
              )}
            {!isLoadingEquipments &&
              !isErrorEquipments &&
              equipments &&
              equipments.length > 0 &&
              equipments.map(equipamento => (
                <AccordionButton key={equipamento.id} title={equipamento.name}>
                  {renderGastoInfo(equipamento)}
                </AccordionButton>
              ))}
          </View>
        </View>
      </BackgroundWrapper>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  equipmentsSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  gastoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  gastoValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ThemedColors.text,
  },
  gastoConsumo: {
    fontSize: 14,
    color: ThemedColors.text,
  },
  noEquipmentText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    fontStyle: 'italic',
    color: ThemedColors.text,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
