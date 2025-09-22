import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput, ScrollView, Image } from 'react-native';
import { color, fontFamily, responsiveWidth } from '../../constant/theme';

// Add interface for props
interface DropdownComponentProps {
	languageList: Array<{
		languageName: string;
		languageCode: string;
	}>;
	selectedValue: string;
	onSelectLanguage: (languageCode: string) => void;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ 
	languageList, 
	selectedValue, 
	onSelectLanguage 
}) => {
	const [isFocus, setIsFocus] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchText, setSearchText] = useState('');

	const changeLanguageHandler = (itemValue: string) => {
		onSelectLanguage(itemValue);
		setIsDropdownOpen(false);
		setSearchText('');
	};

	// Filter languages based on search
	const filteredLanguages = languageList.filter(item =>
		item.languageName.toLowerCase().includes(searchText.toLowerCase())
	);

	const selectedLanguage = languageList.find(item => item.languageCode === selectedValue);

	return (
		<View style={styles.container}>
			<TouchableOpacity
				style={[styles.dropdown, isFocus && { borderColor: color.pink }]}
				onPress={() => {
					setIsDropdownOpen(!isDropdownOpen);
					setIsFocus(true);
				}}
				activeOpacity={0.7}
			>
				<Text style={styles.selectedTextStyle}>
					{selectedLanguage ? selectedLanguage.languageName : 'Select item'}
				</Text>
				<View style={styles.dropdownArrow}>
					<Text style={styles.arrowText}>▼</Text>
				</View>
			</TouchableOpacity>

			{/* Custom Dropdown List */}
			{isDropdownOpen && (
				<View style={styles.dropdownListContainer}>
					<View style={styles.dropdownHeader}>
						<TextInput
							style={styles.dropdownSearchInput}
							placeholder="Search..."
							placeholderTextColor="rgba(0, 0, 0, 0.5)"
							value={searchText}
							onChangeText={setSearchText}
							autoFocus
						/>
					</View>
					
					<ScrollView 
						style={styles.dropdownList}
						showsVerticalScrollIndicator={false}
						nestedScrollEnabled={true}
					>
						{filteredLanguages.map((item, index) => (
							<TouchableOpacity
								key={item.languageCode}
								style={[
									styles.dropdownItem,
									selectedValue === item.languageCode && styles.selectedDropdownItem,
									index === filteredLanguages.length - 1 && { borderBottomWidth: 0 }
								]}
								onPress={() => changeLanguageHandler(item.languageCode)}
								activeOpacity={0.7}
							>
								<Text style={[
									styles.dropdownItemText,
									selectedValue === item.languageCode && styles.selectedDropdownItemText
								]}>
									{item.languageName}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>
			)}
		</View>
	);
};

export default DropdownComponent;

const styles = StyleSheet.create({
	container: {
		backgroundColor: color.white,
		margin: responsiveWidth('0'),
		marginTop: responsiveWidth("5"),
		position: 'relative',
	},
	dropdown: {
		height: 50,
		borderColor: color.gray,
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: color.white,
	},
	dropdownArrow: {
		width: 20,
		height: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	arrowText: {
		fontSize: 12,
		fontFamily: fontFamily.regular,
		color: color.gray,
	},
	icon: {
		marginRight: 5
	},
	label: {
		position: 'absolute',
		backgroundColor: color.white,
		left: 22,
		top: 8,
		zIndex: 999,
		paddingHorizontal: 8,
		fontSize: 14,
		fontFamily: fontFamily.regular,
		// color: color.gray,
	},
	placeholderStyle: {
		fontSize: 16,
		fontFamily: fontFamily.regular,

	},
	selectedTextStyle: {
		fontSize: 16,
		color: '#000',
		fontFamily: fontFamily.regular,
		flex: 1,
	},
	iconStyle: {
		width: 20,
		height: 20
	},
	inputSearchStyle: {
		height: 40,
		fontFamily: fontFamily.regular,
		fontSize: 16
	},
	dropdownListContainer: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		backgroundColor: color.white,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: color.gray,
		zIndex: 1000,
		marginTop: 4,
		maxHeight: 250,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
	},
	dropdownHeader: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: color.gray,
	},
	dropdownSearchInput: {
		height: 40,
		fontSize: 16,
		fontFamily: fontFamily.regular,
		color: '#000',
		paddingHorizontal: 8,
	},
	dropdownList: {
		maxHeight: 200,
	},
	dropdownItem: {
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(0, 0, 0, 0.1)',
	},
	selectedDropdownItem: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
	},
	dropdownItemText: {
		fontSize: 16,
		fontFamily: fontFamily.regular,
		color: '#000',
	},
	selectedDropdownItemText: {
		fontWeight: '600',
		fontFamily: fontFamily.regular,
	},
});
