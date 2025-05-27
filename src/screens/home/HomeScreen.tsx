/* eslint-disable func-call-spacing */
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  Text,
  View,
} from 'react-native';

import AccordionButton from '@components/buttons/AccordionButton';
import LinearScale from '@components/display/LinearScale';
import BackgroundWrapper from '@components/wrappers/BackgroundWrapper';
import LinearGradientWrapper from '@components/wrappers/LinearGradientWrapper';
import { ThemedColors } from '@constants/Theme.style';
import { useAuth } from 'src/navigation/routes/AppNavigator';

import styles from './HomeScreen.style';

import ThemedText from '@/components/texts/ThemedText';
import { fetchEquipments } from '@/services/api/EquipmentService';
import { Equipment } from '@/types/ApiTypes';

const HomeScreen = () => {
  const { user } = useAuth();
  const userId = user?.uid;

  const {
    data: equipments,
    isLoading,
    isError,
    error,
    refetch,
  }: UseQueryResult<Equipment[], Error> = useQuery<
    Equipment[],
    Error,
    Equipment[],
    (string | undefined)[]
  >({
    // Tipagem explícita (opcional, pode ser inferida)
    // queryKey, queryFn, enabled, etc., são todas propriedades deste objeto de opções:
    queryKey: ['equipmentsHome', userId], // A chave da query
    queryFn: async () => {
      // A função que busca os dados
      if (!userId) {
        // Não deveria chegar aqui se 'enabled' estiver funcionando, mas é uma segurança
        console.warn(
          '[useQuery] queryFn chamada sem userId, retornando array vazio.',
        );
        return [];
      }
      return fetchEquipments(userId);
    },
    enabled: !!userId, // A query só será executada se userId for truthy
    // Você pode adicionar outras opções do React Query aqui, como:
    // staleTime: 5 * 60 * 1000, // 5 minutos
    // cacheTime: 10 * 60 * 1000, // 10 minutos
  });

  const renderGastoInfo = (equipamento: Equipment) => {
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
        // style={[screenStyles.containerWapper, localStyles.accordionContentContainer]}
      >
        <View
        // style={localStyles.gastoRow}
        >
          <Text
          // style={localStyles.gastoValor}
          >{`R$${valorGastoPlaceholder}`}</Text>
          <Text
          // style={localStyles.gastoConsumo}
          >{`${consumoKWhPlaceholder}kWh`}</Text>
        </View>
      </LinearGradientWrapper>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <BackgroundWrapper>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Olá, {user?.displayName}</Text>
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
                  R$0,57
                </Text>
              </LinearGradientWrapper>
            </View>
          </View>

          <View style={styles.consumptionContainer}>
            <Text style={styles.text}>Equipamentos</Text>
            <LinearGradientWrapper
              color1={ThemedColors.background_card}
              color2={ThemedColors.background_card2}
              style={[styles.containerWapper, { flexDirection: 'row' }]}
            >
              {isLoading && (
                <ActivityIndicator
                  size="large"
                  // color={ThemedColors.primary}
                  style={{ marginTop: 20 }}
                />
              )}
              {isError && (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                  <Text style={{ color: 'red' }}>
                    Erro ao carregar equipamentos: {error?.message}
                  </Text>
                  <Button
                    title="Tentar Novamente"
                    onPress={() => refetch()}
                    // color={ThemedColors.primary}
                  />
                </View>
              )}
              {/* Verifica se 'equipments' não é undefined antes de checar o length e mapear */}
              {!isLoading &&
                !isError &&
                equipments &&
                equipments.length === 0 && (
                  <ThemedText>Nenhum equipamento encontrado.</ThemedText>
                )}
              {!isLoading &&
                !isError &&
                equipments &&
                equipments.length > 0 &&
                equipments.map(equipamento => (
                  <AccordionButton
                    key={equipamento.id}
                    title={equipamento.name}
                  >
                    {renderGastoInfo(equipamento)}
                  </AccordionButton>
                ))}
            </LinearGradientWrapper>
          </View>
        </View>
      </BackgroundWrapper>
    </ScrollView>
  );
};

export default HomeScreen;
