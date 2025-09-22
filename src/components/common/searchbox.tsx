import {Image, StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import {
  color,
  font,
  responsiveWidth,
} from '../../constant/theme';

const Searchbox = ({
  value,
  onChangeText,
  searchContainerStyle,
  placeholder,
}: any) => {
  return (
    <View style={[styles.searchContainer, searchContainerStyle]}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder || 'Search Customers'}
        placeholderTextColor="#8E8E93"
        value={value}
        onChangeText={onChangeText}
        autoFocus={false}
      />
      <Image source={require('../../assets/icons/search-alt.png')} style={styles.searchIconStyle} />
    </View>
  );
};

export default Searchbox;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: responsiveWidth(4),
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    // height: 44,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: color.lightgray,
  },
  searchInput: {
    flex: 1,
    ...font.body,
    marginRight: 8,
    color: color.black,
    paddingVertical: responsiveWidth(3.5),
  },
  searchIconStyle: {
    height: responsiveWidth(6),
    width: responsiveWidth(6),
    resizeMode: 'contain',
  },
});
