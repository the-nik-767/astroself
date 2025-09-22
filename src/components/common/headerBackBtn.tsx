import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacityProps,
	TextStyle,
	ViewStyle,
	View,
	Image,
	Platform,
	TouchableOpacity
} from 'react-native';
import { color, font, responsiveWidth } from '../../constant/theme';
import { icons } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface ButtonProps extends TouchableOpacityProps {
	title: string;
	subTitle?: string;
	onPress?: () => void;
	Customcontainer?: ViewStyle;
	titleStyle?: TextStyle;
}

const HeaderBackBtn: React.FC<ButtonProps> = ({ title, Customcontainer, titleStyle, subTitle }) => {
	const navigation = useNavigation();
	const { t } = useTranslation();
	return (
		<View style={[styles.container, Customcontainer]}>
			<TouchableOpacity
				onPress={() => {
					navigation.goBack();
				}}
			>
				<Image source={icons.icBcak} style={styles.ic_logo} />
			</TouchableOpacity>
			<View style={{marginVertical:responsiveWidth('2')}}>
				<Text style={[styles.titleStyle, titleStyle]}>{t(title)}</Text>
				{subTitle && <Text style={[styles.titleStylesub, titleStyle]}>{t(subTitle)}</Text>}
			</View>

			{/* <Image source={icons.ic_user} style={styles.ic_logo_profile} /> */}
		</View>
	);
};

export { HeaderBackBtn };

const styles = StyleSheet.create({
	container: {
		backgroundColor: color.white,
		marginTop: Platform.OS === 'ios' ? responsiveWidth('10%') : responsiveWidth('0%'),
		marginLeft: responsiveWidth('5'),
		flexDirection: 'row',
		// justifyContent: 'space-between',
		alignItems: 'center'
	},
	titleStyle: {
		color: color.black,
		...font.subtitle,
		fontWeight: '700',
		marginLeft: responsiveWidth('3')
	},
	titleStylesub: {
		color: color.pink,
		...font.caption,
		marginLeft: responsiveWidth('3')
	},
	ic_logo: {
		width: responsiveWidth('6%'),
		height: responsiveWidth('6%'),
		resizeMode: 'contain',
		tintColor: color.pink,
		marginVertical: responsiveWidth('4')
	},
	ic_logo_profile: {
		width: responsiveWidth('7%'),
		height: responsiveWidth('7%'),
		resizeMode: 'contain',
		borderRadius: 50,
		marginRight: responsiveWidth('3')
	}
});
