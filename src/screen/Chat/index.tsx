// ChatScreen.tsx

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  StatusBar,
  Platform,
  Modal,
  FlatList,
  Alert,
  ImageBackground,
} from 'react-native';
import {font, responsiveHeight, responsiveWidth, fontFamily, color} from '../../constant/theme';
import { MainContainer } from '../../components/common/mainContainer';
import { useProfileData } from '../../hooks/useProfileData';
import CurrentSituation from '../../components/CurrentSituation';
import GeneralAnalysis from '../../components/GeneralAnalysis';
import SnapshotPredictions from '../../components/SnapshotPredictions';
import { useNavigation, useFocusEffect } from '@react-navigation/native';


const ChatScreen = () => {
  const [activeTab, setActiveTab] = useState('Snapshot Predictions');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [hasUserSelectedMember, setHasUserSelectedMember] = useState(false);
  const navigation = useNavigation<any>();

  const { membersData, error, refreshProfileData } = useProfileData();

  // Refresh data every time user comes to this screen
  useFocusEffect(
    React.useCallback(() => {
      console.log('Chat screen focused, refreshing data...');
      if (refreshProfileData) {
        refreshProfileData();
      }
      // Reset user selection flag so primary member is shown again
      setHasUserSelectedMember(false);
      setSelectedMemberId(null);
    }, [refreshProfileData])
  );

  // Show error alert if there's an error
  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK' },
        { text: 'Retry', onPress: refreshProfileData },
      ]);
    }
  }, [error, refreshProfileData]);

  // Set selectedMemberId based on primary member from membersData (only initially)
  useEffect(() => {
    if (
      membersData &&
      Array.isArray(membersData) &&
      membersData.length > 0 &&
      !hasUserSelectedMember && // Only set initial selection if user hasn't manually selected
      !selectedMemberId // Only set if no member is currently selected
    ) {
      // Function to get primary member ID
      const getPrimaryMemberId = () => {
        console.log('Looking for primary member in membersData:', membersData);
        
        // Look for a member with primary_mamber field set to "True"
        const primaryMember = membersData.find(
          (member: any) => {
            console.log('Checking member:', member.full_name, 'primary_mamber:', member.primary_mamber);
            return member.primary_mamber === "True";
          }
        );

        if (primaryMember) {
          console.log('Found primary member:', primaryMember);
          return primaryMember.id || primaryMember._id;
        }

        // If no primary_mamber == "True" found, use first member
        const firstMember = membersData[0];
        console.log('No primary member found, using first member:', firstMember);
        return firstMember?.id || firstMember?._id || null;
      };

      const primaryMemberId = getPrimaryMemberId();
      console.log('Setting initial selection to primary member:', primaryMemberId);
      setSelectedMemberId(primaryMemberId);
    }
  }, [membersData, hasUserSelectedMember]);

  // Navigate to Nakshatra screen
  const handleNakshatraNavigation = () => {
    if (selectedMemberId) {
      navigation.navigate('NakshatraScreen', { userId: selectedMemberId });
    } else {
      Alert.alert('Error', 'Please select a member first');
    }
  };

  return (
    <MainContainer>
      <StatusBar barStyle="light-content" backgroundColor="#202945" />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          {/* <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Image source={icons.Icback} style={styles.backIcon} />
          </TouchableOpacity> */}
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Predictions</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile member dropdown */}
        <View style={styles.profileCardContainer}>
          <Image
            source={require('../../assets/icons/profile-icons.png')}
            style={styles.profileIcon}
          />
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
            >
              <Text style={styles.selectedMemberText}>
                {selectedMemberId
                  ? membersData?.find((m: any) => (m.id || m._id) == selectedMemberId)
                      ?.full_name || 'Select Member'
                  : 'Select Member'}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={isMemberDropdownOpen}
              transparent={true}
              animationType="none"
              onRequestClose={() => setIsMemberDropdownOpen(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setIsMemberDropdownOpen(false)}
              >
                <View style={styles.modalDropdownContainer}>
                  <View style={styles.dropdownContainer}>
                    {membersData && membersData.length > 0 ? (
                      <FlatList
                        data={membersData}
                        keyExtractor={item => (item.id || item._id).toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => {
                              setSelectedMemberId(item.id || item._id);
                              setHasUserSelectedMember(true); // Mark that user has manually selected
                              setIsMemberDropdownOpen(false);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.dropdownItemText}>
                              {item.full_name}
                            </Text>
                          </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={true}
                        bounces={false}
                        keyboardShouldPersistTaps="handled"
                        style={styles.flatListStyle}
                        removeClippedSubviews={false}
                        scrollEventThrottle={16}
                      />
                    ) : (
                      <Text style={styles.noResultsText}>No members found</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
          <Image
            source={require('../../assets/icons/Dropdown.png')}
            style={[
              styles.arrowIcon,
              {
                transform: [
                  { rotate: isMemberDropdownOpen ? '180deg' : '0deg' },
                ],
                marginRight: -responsiveWidth('1.5%'),
              },
            ]}
          />
        </View>

        {/* Greeting Section Card */}
        <ImageBackground
          source={require('../../assets/image/DarkBackground.png')}
          blurRadius={12}
          style={styles.greetingCard}
          imageStyle={styles.greetingCardBgImage}
        >
          <View style={styles.greetingOverlay} />
          <View style={styles.greetingContent}>
            {/* <View style={styles.greetingSection}>
              <Text style={styles.greetingText}>
                Hello{' '}
                <Text style={styles.highlightedName}>
                  {selectedMemberId
                    ? membersData?.find((m: any) => m.id === selectedMemberId)
                        ?.full_name || 'Member'
                    : 'Member'}
                </Text>{' '}
                👋, how can I guide you today?
              </Text>
              <Text style={styles.instructionText}>
                Tap a house to explore deeper insights
              </Text>
            </View> */}

            {/* Separator Line */}
            {/* <View style={styles.separatorLine} /> */}

            {/* User Details */}
            <View style={styles.userDetailsContainer}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date of Birth</Text>
                <Text style={styles.detailValue}>
                  {selectedMemberId &&
                  membersData?.find((m: any) => (m.id || m._id) == selectedMemberId)
                    ?.birth_data
                    ? (() => {
                        const member = membersData.find(
                          (m: any) => (m.id || m._id) == selectedMemberId,
                        );
                        const { day, month, year } = member.birth_data;
                        return new Date(
                          year,
                          month - 1,
                          day,
                        ).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        });
                      })()
                    : 'Not Available'}
                </Text>
              </View>
              <View style={styles.detailSeparator} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Place of Birth</Text>
                <Text style={styles.detailValue}>
                  {selectedMemberId &&
                  membersData?.find((m: any) => (m.id || m._id) == selectedMemberId)
                    ?.birthplace
                    ? membersData.find((m: any) => (m.id || m._id) == selectedMemberId)
                        .birthplace
                    : 'Not Available'}
                </Text>
              </View>
            </View>

            {/* Nakshatra & Dasha Button */}
            <TouchableOpacity
              style={styles.nakshatraButton}
              onPress={handleNakshatraNavigation}
              activeOpacity={0.8}
            >
              <Text style={styles.nakshatraButtonText}>Nakshatra & Dasha</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Analysis Tabs */}
        <ImageBackground
          source={require('../../assets/image/DarkBackground.png')}
          blurRadius={12}
          style={styles.tabsContainer}
          imageStyle={styles.tabsBgImage}
        >
          <View style={styles.tabsOverlay} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
            style={styles.tabsScrollView}
          >
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'Snapshot Predictions' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('Snapshot Predictions')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Snapshot Predictions' && styles.activeTabText,
                ]}
              >
                SnapCast
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'Current Situation' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('Current Situation')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Current Situation' && styles.activeTabText,
                ]}
              >
                LifeNow
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'General Analysis' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('General Analysis')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'General Analysis' && styles.activeTabText,
                ]}
              >
                LifeView
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </ImageBackground>

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>
          {activeTab === 'Snapshot Predictions' ? (
            <SnapshotPredictions selectedMemberId={selectedMemberId || ''} />
          ) : activeTab === 'Current Situation' ? (
            <CurrentSituation selectedMemberId={selectedMemberId || ''} />
          ) : (
            <GeneralAnalysis selectedMemberId={selectedMemberId || ''} />
          )}
        </View>
        {/* {activeTab === 'General Analysis' ? (
          <GeneralAnalysis selectedMemberId={selectedMemberId} />
        )} */}
        {/* {activeTab === 'General Analysis' && (
          <GeneralAnalysis selectedMemberId={selectedMemberId} />
        )} */}
      </ScrollView>
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202945',
  },
  header: {
    alignItems: 'center',
    // paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    marginTop:
      Platform.OS === 'android'
        ? responsiveHeight('0.5%')
        : responsiveWidth('13%'),
    // marginBottom: responsiveWidth('5%'),
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  headerTitle: {
    color: color.themeTextWhite,
    fontSize: 24,
    fontFamily: fontFamily.regular,
  },
  headerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  profileCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 49, 73, 0.9)',
    borderRadius: 10,
    padding: responsiveWidth('2'),
    marginTop: responsiveWidth('3'),
    // marginHorizontal: responsiveWidth('3'),
    marginBottom: 24,
    borderWidth: 2,
    borderColor: color.themeBorderDropdown,
    position: 'relative',
    zIndex: 99999,
  },
  dropdownWrapper: {
    zIndex: 999,
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(4),
    paddingBottom: responsiveHeight(15), // Space for bottom navigation
  },
  profileIcon: {
    width: responsiveWidth('7%'),
    height: responsiveWidth('7%'),
    // marginLeft: responsiveWidth('1'),
    marginRight: responsiveWidth('3'),
  },
  input: {
    backgroundColor: '#223149',
    color: '#fff',
    fontSize: 16,
    fontFamily: fontFamily.regular,
    borderColor: '#496CA8',
  },
  selectedMemberText: {
    color: color.themeTextWhite,
    // ...font.input,
    // fontWeight: '500',
    fontSize: 16,
    fontFamily: fontFamily.regular,
  },
  arrowIcon: {
    width: responsiveWidth('7%'),
    height: responsiveWidth('7%'),
    resizeMode: 'contain',

    tintColor: color.themeTextWhite,
    // transform: [{ rotate: '270deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop:
      Platform.OS === 'ios' ? responsiveWidth('42') : responsiveWidth('29'),
  },
  modalDropdownContainer: {
    width: '90%',
    maxWidth: responsiveWidth('90'),
    alignSelf: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#223149',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#496CA8',
    maxHeight: 200,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  flatListStyle: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#496CA8',
  },
  dropdownItemText: {
    color: color.themeTextWhite,
    fontSize: 16,
    fontFamily: fontFamily.regular,
  },
  noResultsText: {
    color: color.themeTextWhite,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    textAlign: 'center',
    paddingVertical: 10,
  },
  greetingCard: {
    borderRadius: 16,
    padding: responsiveWidth('2%'),
    paddingVertical: responsiveWidth('3%'),
    // marginHorizontal: responsiveWidth('1'),
    marginBottom: 24,
    borderWidth: 0.2,
    borderColor: '#EEE5CA',
    overflow: 'hidden',
  },
  greetingCardBgImage: {
    borderRadius: 16,
    opacity: 0.7,
  },
  greetingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  greetingContent: {
    position: 'relative',
    zIndex: 1,
  },
  greetingSection: {
    marginBottom: responsiveHeight(1),
  },
  greetingText: {
    color: color.themeTextWhite,
    ...font.body,
    marginBottom: responsiveHeight(0.5),
    lineHeight: 24,
  },
  highlightedName: {
    color: '#F2994A',
    fontWeight: '600',
  },
  instructionText: {
    color: '#F6EFD9',
    ...font.bodySmall,
    opacity: 0.8,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#F6EFD9',
    opacity: 0.3,
    // marginVertical: responsiveHeight(1.5),
  },
  userDetailsContainer: {
    flexDirection: 'row',
    // marginBottom: responsiveHeight(2),
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    color: color.themeTextWhite,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    // fontWeight: '400',
    marginBottom: responsiveHeight(0.5),
  },
  detailValue: {
    color: color.themeTextWhite,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    // textTransform: 'capitalize',
    textAlign: 'center',
    // fontWeight: '500',
  },
  detailSeparator: {
    width: 1,
    backgroundColor: '#F6EFD9',
    opacity: 0.3,
    marginHorizontal: responsiveWidth(2),
  },
  nakshatraButton: {
    backgroundColor: '#DF8A5D',
    borderRadius: 10,
    width: responsiveWidth('40%'),
    // flex: 1,
    // marginHorizontal: responsiveWidth('20'),
    paddingVertical: 14,
    // paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: responsiveHeight(1),
  },
  nakshatraButtonText: {
    color: color.themeTextWhite,
    fontSize: 12,
    fontFamily: fontFamily.regular,
    fontWeight: '600',
    lineHeight: 18, // 150% of 12px = 18px
    letterSpacing: 0.6,
    // paddingHorizontal: responsiveWidth('2%'),
    textAlign: 'center',
  },
  tabsContainer: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: color.themeBorderDropdown,
    overflow: 'hidden',
    marginBottom: responsiveHeight(2),
    // marginHorizontal: responsiveWidth(3),
  },
  tabsBgImage: {
    borderRadius: 10,
    opacity: 0.7,
  },
  tabsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(32, 41, 69, 0.7)',
  },
  tabsScrollView: {
    position: 'relative',
    zIndex: 1,
  },
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(2),
  },
  tab: {
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: responsiveWidth(30),
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#F2994A',
  },
  tabText: {
    color: color.themeTextWhite,
    // ...font.button,
    fontSize: 16,
    // fontWeight: '500',
    fontFamily: fontFamily.regular,
    lineHeight: 27,
    letterSpacing: -0.45,
    // textAlign: 'center',
  },
  activeTabText: {
    color: '#F2994A',
    fontFamily: fontFamily.regular,
    // ...font.button,
    fontSize: 16,
    // fontWeight: '500',
    lineHeight: 27,
    letterSpacing: -0.45,
    textAlign: 'center',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#223149',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF',
    opacity: 0.1,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.5),
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: responsiveHeight(0.5),
  },
  navText: {
    color: '#FFFFFF',
    ...font.captionSmall,
  },
  activeNavText: {
    color: '#DF8A5D',
    fontWeight: '600',
  },
  tabContentContainer: {
    flex: 1,
    paddingTop: responsiveHeight(1),
  },
});

export default ChatScreen;
