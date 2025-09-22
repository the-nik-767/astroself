import React, { useState } from 'react';
import {
	StyleSheet,
	TextInput,
	View,
	Platform,
	TouchableOpacity,
	Image,
	TextInputProps,
	ViewStyle
} from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { color, responsiveWidth } from '../../constant/theme'; // Adjust this import path as needed
import { icons } from '../../assets'; // Adjust this import path as needed

interface InputBoxProps extends TextInputProps {
	title?: string;
	value?: string;
	showEyeIcon?: boolean;
	icSearch?: boolean;
	secureTextEntry?: boolean;
	inputboxContainer?: ViewStyle;
}

const InputBox: React.FC<InputBoxProps> = (props) => {
	const [isFocus, setIsFocus] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	return (
		<View
			style={[
				styles.inputboxContainer,
				{
					borderColor: isFocus ? color.primary : color.border,
					borderWidth: 1,
					color: color.red
				},
				props.inputboxContainer,
				props.style
			]}
		>
			{props.icSearch && <Image source={icons.ic_search} style={styles.ic_search} />}
			<TextInput
				{...props}
				style={{ color: color.black, width: '90%', height: "100%" }}
				placeholderTextColor={color.gray}
				placeholder={props.title}
				value={props.value}
				onChangeText={props.onChangeText}
				secureTextEntry={props.secureTextEntry ? (showPassword ? false : true) : undefined}
				onBlur={() => setIsFocus(false)}
				onFocus={() => setIsFocus(true)}
			/>
			{props.showEyeIcon && (
				<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
					{showPassword ? (
						<Image style={styles.eyeIcon} source={icons.ic_hidden} />
					) : (
						<Image style={styles.eyeIcon} source={icons.ic_view} />
					)}
				</TouchableOpacity>
			)}
		</View>
	);
};

export { InputBox };

const styles = StyleSheet.create({
	inputboxContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: responsiveWidth('3.5%'),
		backgroundColor: color.white,
		borderRadius: 30,
		marginTop: responsiveWidth('5%'),
		paddingVertical: Platform.OS === 'android' ? 0 : responsiveWidth('4%'),
	},
	eyeIcon: {
		height: 18,
		width: 18,
		marginRight: widthPercentageToDP(3),
		tintColor: color.primary
	},
	ic_search: {
		height: responsiveWidth("6%"),
		width: responsiveWidth("6%"),
		tintColor: color.primary,
	},
});
