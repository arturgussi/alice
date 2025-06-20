import {
  ActivityIndicator,
  Button,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import AccordionButton from '@/components/buttons/AccordionButton';
import LinearScale from '@/components/display/LinearScale';
import ThemedText from '@/components/texts/ThemedText';
import BackgroundWrapper from '@/components/wrappers/BackgroundWrapper';
import LinearGradientWrapper from '@/components/wrappers/LinearGradientWrapper';
import { ThemedColors } from '@/constants/Theme.style';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { useEquipment } from '@/hooks/useEquipment';
import { AppEquipment } from '@/types/models/EquipmentModel';
import { formatCurrency } from '@/Util';

import styles from './HomeScreen.style';

const HomeScreen = () => {
  const { appUser } = useAuth();

  const {
    equipments,
    isLoadingEquipments,
    isErrorEquipments,
    errorEquipments,
    refetchEquipments,
    isFetchingEquipments,
  } = useEquipment();

  const actualDay = new Date();
  const currentYear = actualDay.getFullYear();
  const currentMonth = actualDay.getMonth() + 1;

  const {
    resumoGeral,
    resumoEquipamentos,
    isFetching: isFetchingDashboard,
    refetchAllDashboard,
    statusResumoGeral,
    isError: isErrorDashboard,
    error: errorDashboard,
  } = useDashboard({ year: currentYear, month: currentMonth });

  const isRefreshing = isFetchingEquipments || isFetchingDashboard;
  const combinedRefetch = () => {
    refetchEquipments();
    refetchAllDashboard();
  };

  const renderGastoInfo = (equipamento: AppEquipment) => {
    const summary = resumoEquipamentos?.detalhesPorEquipamento.find(
      d => d.idEquipamento === equipamento.id,
    );
    const valorGasto = summary
      ? formatCurrency(summary.gastoMesAtual)
      : 'Calculando...';
    const consumoKWh = summary?.consumoKwhMesAtual
      ? `${summary.consumoKwhMesAtual.toFixed(3)} kWh`
      : '--- kWh';

    const marca = equipamento.brand || 'Marca desconhecida';
    const modelo = equipamento.model || 'Modelo desconhecido';

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
        <View style={localStyles.column}>
          <View style={localStyles.row}>
            <ThemedText>{marca}</ThemedText>
            <ThemedText style={localStyles.gastoValor}>{valorGasto}</ThemedText>
          </View>
          <View style={localStyles.row}>
            <ThemedText>{modelo}</ThemedText>
            <ThemedText style={localStyles.gastoConsumo}>
              {consumoKWh}
            </ThemedText>
          </View>
        </View>
      </LinearGradientWrapper>
    );
  };

  const renderContent = () => {
    // ESTADO DE CARREGAMENTO: Mostra enquanto qualquer uma das buscas estiver pendente.
    if (isLoadingEquipments || statusResumoGeral === 'pending') {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={ThemedColors.text} />
          <ThemedText style={{ marginTop: 10 }}>
            {appUser?.uid ? 'Buscando dados...' : 'Aguardando autenticação...'}
          </ThemedText>
        </View>
      );
    }

    // ESTADO DE ERRO: Mostra se qualquer uma das buscas falhar.
    if (isErrorEquipments || isErrorDashboard) {
      return (
        <View style={localStyles.errorContainer}>
          <Text style={localStyles.errorText}>
            {isErrorEquipments
              ? `Erro ao carregar equipamentos: ${errorEquipments?.message}`
              : `Erro ao carregar resumo: ${errorDashboard?.message}`}
          </Text>
          <Button
            title="Tentar Novamente"
            onPress={combinedRefetch}
            color={ThemedColors.text}
          />
        </View>
      );
    }

    // Lógica da bandeira e tarifa
    let tariff: number | string | undefined = appUser?.tariff;
    if (tariff === undefined || tariff === null) {
      tariff = 'Sem dados';
    } else {
      tariff = formatCurrency(tariff);
    }
    let actualFlagColor = 'transparent';

    switch (appUser?.actualFlag) {
      case 'Vermelha2':
      case 'Vermelha1':
        actualFlagColor = 'red';
        break;
      case 'Amarela':
        actualFlagColor = 'yellow';
        break;
      case 'Branca':
        actualFlagColor = 'white';
        break;
      default:
        actualFlagColor = 'transparent';
    }

    // Lógica de formatação de data para os rótulos
    const mesesDoAno = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const dataMesAtual = new Date(currentYear, currentMonth - 1, 1);
    const labelMesAtual = `${mesesDoAno[dataMesAtual.getMonth()]}/${dataMesAtual.getFullYear()}`;

    const dataMesAnterior = new Date(currentYear, currentMonth - 2, 1);
    const labelMesAnterior = `${mesesDoAno[dataMesAnterior.getMonth()]}/${dataMesAnterior.getFullYear()}`;

    // ALTERADO: Lógica de cálculo da porcentagem agora é baseada no maior consumo.
    const consumoAtual = resumoGeral?.mesAtual?.consumoKwh ?? 0;
    const consumoAnterior = resumoGeral?.mesAnterior?.consumoKwh ?? 0;

    const maxConsumo = Math.max(consumoAtual, consumoAnterior, 1); // Usa 1 como mínimo para evitar divisão por zero.

    const widthPercentageMesAtual = consumoAtual / maxConsumo;
    const widthPercentageMesAnterior = consumoAnterior / maxConsumo;

    // ESTADO DE SUCESSO: Renderiza a tela completa.
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={combinedRefetch}
          />
        }
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            Olá, {appUser?.displayName || 'Usuário'}
          </Text>

          {/* Seção de Resumo de Consumo */}
          <View style={styles.consumptionContainer}>
            <View>
              <Text style={styles.text}>Consumo mensal</Text>
              <LinearGradientWrapper
                color1={ThemedColors.background_card}
                color2={ThemedColors.background_card2}
                style={styles.containerWapper}
              >
                {/* CORRIGIDO: Ordem das barras ajustada (Mês Atual primeiro) */}
                <LinearScale
                  value={resumoGeral?.mesAtual?.consumoKwh ?? 0}
                  label={labelMesAtual}
                  widthPercentage={widthPercentageMesAtual}
                />
                <LinearScale
                  value={resumoGeral?.mesAnterior?.consumoKwh ?? 0}
                  label={labelMesAnterior}
                  widthPercentage={widthPercentageMesAnterior}
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
                <Text style={styles.consumptionText}>
                  {formatCurrency(resumoGeral?.mesAtual?.gastoReais ?? 0)}
                </Text>
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
                <Text style={styles.consumptionText}>
                  {formatCurrency(resumoGeral?.mesAnterior?.gastoReais ?? 0)}
                </Text>
              </LinearGradientWrapper>
            </View>
            <View>
              <LinearGradientWrapper
                color1={ThemedColors.background_card}
                color2={ThemedColors.background_card2}
                style={[styles.containerWapper, { flexDirection: 'row' }]}
              >
                <Text style={[styles.text, { flex: 1 }]}>R$ kWh hoje</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesomeIcon
                    name={'flag'}
                    size={12}
                    color={actualFlagColor}
                  />
                  <Text
                    style={[
                      styles.consumptionText,
                      { color: ThemedColors.title, marginLeft: 8 },
                    ]}
                  >
                    {tariff}
                  </Text>
                </View>
              </LinearGradientWrapper>
            </View>
          </View>

          {/* Seção de Equipamentos com Accordions */}
          <View style={localStyles.equipmentsSection}>
            <Text style={styles.text}>Equipamentos</Text>
            {!equipments || equipments.length === 0 ? (
              <Text style={localStyles.noEquipmentText}>
                {appUser?.uid
                  ? 'Nenhum equipamento cadastrado.'
                  : 'Faça login para visualizar seus equipamentos.'}
              </Text>
            ) : (
              equipments.map(equipamento => (
                <AccordionButton key={equipamento.id} title={equipamento.name}>
                  {renderGastoInfo(equipamento)}
                </AccordionButton>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  return <BackgroundWrapper>{renderContent()}</BackgroundWrapper>;
};

const localStyles = StyleSheet.create({
  equipmentsSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  column: {
    flex: 1,
    width: '100%',
  },
  row: {
    flex: 1,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
