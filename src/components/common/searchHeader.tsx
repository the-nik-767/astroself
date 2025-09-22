import React, { useState } from 'react';
import { StyleSheet, TouchableOpacityProps, TextStyle, ViewStyle, View,  } from 'react-native';
import { color,  responsiveWidth } from '../../constant/theme';
import { InputBox } from './inputBox';
import { useTranslation } from 'react-i18next';

interface ButtonProps extends TouchableOpacityProps {
	title?: string;
	onPress?: () => void;
	Customcontainer?: ViewStyle;
	titleStyle?: TextStyle;
}

const SearchHeader: React.FC<ButtonProps> = ({ Customcontainer }) => {
	const [SearchHeader] = useState<string>('');
	const { t } = useTranslation();

	return (
		<View style={[styles.container, Customcontainer]}>
			<InputBox
				title={t('search')}
				inputboxContainer={{
					borderRadius: 10,
					width: responsiveWidth('90%'),
					backgroundColor: color.white
				}}
				icSearch={true}
				value={SearchHeader}
				onChangeText={() => {
					// this.setState({
					//   email: txt,
					// });
				}}
			/>
		</View>
	);
};

export { SearchHeader };

const styles = StyleSheet.create({
	container: {
		marginHorizontal: responsiveWidth('5'),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});
