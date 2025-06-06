import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { ThemedColors } from '@/constants/Theme.style';
import { useEquipment } from '@/hooks/useEquipment';
import { AppEquipment } from '@/types/models/EquipmentModel';
import { EquipmentStackParamList } from '@/types/navigation/NavigationTypes';
import PrimaryButton from '@components/buttons/ThemedButton';
import ThemedText from '@components/texts/ThemedText';
import BackgroundWrapper from '@components/wrappers/BackgroundWrapper';

type EquipmentManagementNavigationProp = NativeStackNavigationProp<
  EquipmentStackParamList,
  'EquipmentManagementScreen'
>;

// Componente para renderizar cada item da lista
const EquipmentListItem: React.FC<{
  item: AppEquipment;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}> = ({ item, onEdit, onDelete, isDeleting }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
        <ThemedText style={styles.itemDetails}>
          {item.brand || 'Sem marca'} - {item.model || 'Sem modelo'}
        </ThemedText>
      </View>
      <View style={styles.itemActions}>
        {isDeleting ? (
          <ActivityIndicator color={'red'} />
        ) : (
          <>
            <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
              <FontAwesomeIcon
                name="pencil"
                size={20}
                color={ThemedColors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
              <FontAwesomeIcon name="trash" size={20} color={'red'} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const EquipmentManagementScreen: React.FC = () => {
  const navigation = useNavigation<EquipmentManagementNavigationProp>();

  const {
    equipments,
    isLoadingEquipments,
    isErrorEquipments,
    errorEquipments,
    refetchEquipments,
    deleteEquipment,
    isDeletingEquipment,
  } = useEquipment();

  // Função para confirmar e deletar um equipamento
  const handleDeletePress = (equipmentId: string, equipmentName: string) => {
    Alert.alert(
      'Deletar Equipamento',
      `Tem certeza que deseja deletar o equipamento "${equipmentName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            deleteEquipment(
              { equipmentId },
              {
                onSuccess: () => {
                  Alert.alert('Sucesso', 'Equipamento deletado.');
                },
                onError: error => {
                  Alert.alert('Erro ao Deletar', error.message);
                },
              },
            );
          },
        },
      ],
    );
  };

  // Função para renderizar o conteúdo principal da tela
  const renderContent = () => {
    if (isLoadingEquipments) {
      return (
        <ActivityIndicator
          size="large"
          color={ThemedColors.text}
          style={styles.centered}
        />
      );
    }

    if (isErrorEquipments) {
      return (
        <View style={styles.centered}>
          <ThemedText style={styles.errorText}>
            Erro ao carregar equipamentos: {errorEquipments?.message}
          </ThemedText>
          <Button
            title="Tentar Novamente"
            onPress={() => refetchEquipments()}
            color={ThemedColors.text}
          />
        </View>
      );
    }

    return (
      <FlatList
        data={equipments || []}
        renderItem={({ item }) => (
          <EquipmentListItem
            item={item}
            onDelete={() => handleDeletePress(item.id, item.name)}
            onEdit={() =>
              navigation.navigate('EquipmentFormScreen', {
                equipment: item,
              })
            }
            isDeleting={isDeletingEquipment}
          />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.centered}>
            <ThemedText style={styles.emptyText}>
              Você ainda não possui equipamentos cadastrados.
            </ThemedText>
          </View>
        }
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <ThemedText style={styles.screenTitle}>Meus Equipamentos</ThemedText>

        <PrimaryButton
          title="Adicionar Novo Equipamento"
          onPress={() => navigation.navigate('EquipmentFormScreen', {})}
          style={styles.addButton}
        />

        {renderContent()}
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: ThemedColors.text,
  },
  addButton: {
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    color: ThemedColors.text,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: ThemedColors.background_card,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: ThemedColors.text,
  },
  itemDetails: {
    fontSize: 14,
    color: ThemedColors.text,
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  separator: {
    height: 12,
  },
});

export default EquipmentManagementScreen;
