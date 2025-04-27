import React, {useRef} from 'react';
import {Text, FlatList, TouchableOpacity, StyleSheet, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import {ThemedColors} from '@constants/Theme.style';

interface ThemedDropdownModalProps {
  value?: string;
  placeholder?: string;
  onValueSelected: (selectedValue: string) => void;
  options: string[];
}

const ThemedDropdownModal = ({
  value,
  placeholder,
  onValueSelected,
  options,
}: ThemedDropdownModalProps) => {
  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const handleSelectValue = (selectedValue: string) => {
    onValueSelected(selectedValue);
    modalizeRef.current?.close();
  };

  // Função para renderizar cada item da lista
  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={stylesModal.item}
      onPress={() => handleSelectValue(item)}>
      <Text style={stylesModal.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity onPress={onOpen}>
        <View style={styles.textView}>
          {value ? (
            <Text style={styles.text}>{value}</Text>
          ) : (
            <Text style={styles.placeholder}>{placeholder}</Text>
          )}
        </View>
      </TouchableOpacity>

      <Portal>
        <Modalize ref={modalizeRef} adjustToContentHeight>
          <FlatList
            style={stylesModal.portal}
            nestedScrollEnabled={true}
            scrollEnabled={false}
            data={options}
            renderItem={renderItem}
            keyExtractor={item => item}
            ListFooterComponent={<View />}
          />
        </Modalize>
      </Portal>
    </View>
  );
};

const stylesModal = StyleSheet.create({
  portal: {
    backgroundColor: ThemedColors.background,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});

const styles = StyleSheet.create({
  textView: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: ThemedColors.placeholder,
    paddingLeft: 20,
    paddingRight: 40,
  },
  text: {
    height: 52,
    fontWeight: '400',
    fontSize: 14,
    color: 'white',
    textAlignVertical: 'center',
  },
  placeholder: {
    height: 52,
    fontWeight: '400',
    fontSize: 14,
    color: ThemedColors.placeholder,
    textAlignVertical: 'center',
  },
});

export default ThemedDropdownModal;
