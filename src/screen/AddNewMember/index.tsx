// BasicDeatil.tsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Modal,
  FlatList,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainContainer } from '../../components/common/mainContainer';
import Toast from 'react-native-toast-message';
import { responsiveWidth, fontFamily, color } from '../../constant/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../../services/user/user.service';
import serviceFactory from '../../services/serviceFactory';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  HomeScreen: undefined;
  ContinueWithOtp: undefined;
};

type BasicDeatilNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

const GOOGLE_MAPS_API_KEY = 'AIzaSyCRiOhv-8F7NUHE22gm9zres6rVFwlkXEE';

interface Place {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface DropdownItem {
  label: string;
  value: string;
  place_id: string;
}

const AddNewMember = () => {
  const navigation = useNavigation<BasicDeatilNavigationProp>();
  const userService = serviceFactory.get<UserService>('UserService');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showPredictionTypeModal, setShowPredictionTypeModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [iosTempDate, setIosTempDate] = useState<Date | null>(null);
  const [iosTempTime, setIosTempTime] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [isPlaceDropdownOpen, setIsPlaceDropdownOpen] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];
  const predictionTypeOptions = ["Bullet","Paragraph"];

  // Search places using Google Places API
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setPlaces([]);
      return;
    }

    try {
      const autoRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query,
        )}&key=${GOOGLE_MAPS_API_KEY}&types=geocode`,
      );

      const autoData = await autoRes.json();

      if (autoData.status === 'OK') {
        setPlaces(autoData.predictions); // 👉 Show list to user
      } else {
        setPlaces([]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setPlaces([]);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchPlaces(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Convert places to dropdown format
  const getDropdownData = (): DropdownItem[] => {
    return places.map(place => ({
      label: place.structured_formatting.secondary_text
        ? `${place.structured_formatting.main_text}, ${place.structured_formatting.secondary_text}`
        : place.structured_formatting.main_text,
      value: place.structured_formatting.main_text,
      place_id: place.place_id,
    }));
  };

  // Filter places based on search
  const filteredPlaces = getDropdownData().filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('Please enter your first name'),
    lastName: Yup.string().trim().required('Please enter your last name'),
    gender: Yup.string().required('Please select your gender'),
    predictionType: Yup.string().required('Please select prediction type'),
    dateOfBirth: Yup.string().required('Please select your date of birth'),
    timeOfBirth: Yup.string().required('Please select your time of birth'),
    placeOfBirth: Yup.object()
      .shape({
        lat: Yup.number().required('Please enter your latitude'),
        lng: Yup.number().required('Please enter your longitude'),
      })
      .required('Please enter your place of birth'),
    placeOfBirthDisplay: Yup.string()
      .trim()
      .required('Please select your place of birth'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      gender: '',
      predictionType: '',
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: null,
      placeOfBirthDisplay: '',
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        helpers.setSubmitting(true);

        // Get current user data to extract userId
        const userDataString = await AsyncStorage.getItem('USER_DATA');
        if (!userDataString) {
          throw new Error('User data not found. Please login again.');
        }

        const userData = JSON.parse(userDataString);
        const userId = userData._id || userData.user_id;

        if (!userId) {
          throw new Error('User ID not found. Please login again.');
        }

        // Parse date and time from form values
        // The form stores formatted strings, so we need to parse them back to Date objects
        let dateObj: Date;
        let timeObj: Date;

        // Check if we have the actual Date objects stored in state
        if (selectedDate && selectedTime) {
          dateObj = selectedDate;
          timeObj = selectedTime;
        } else {
          // Fallback: try to parse the formatted strings
          // formatDate returns "Oct 10, 2010" format
          // formatTime returns "11:59 PM" format
          try {
            dateObj = new Date(values.dateOfBirth);
            timeObj = new Date(`1970-01-01 ${values.timeOfBirth}`);
          } catch (error) {
            throw new Error(
              'Invalid date or time format. Please select date and time again.',
            );
          }
        }

        // Validate that we have valid dates
        if (isNaN(dateObj.getTime()) || isNaN(timeObj.getTime())) {
          throw new Error(
            'Invalid date or time. Please select valid date and time.',
          );
        }

        // Extract coordinates from placeOfBirth
        const placeOfBirth = values.placeOfBirth as {
          lat: number;
          lng: number;
        } | null;
        const lat = placeOfBirth?.lat || 0;
        const lng = placeOfBirth?.lng || 0;

        // Prepare birth data for API
        const birthData = {
          userId,
          first_name: values.firstName,
          last_name: values.lastName,
          gender: values.gender.toLowerCase(),
          prediction_type: values.predictionType,
          birthplace: values.placeOfBirthDisplay,
          day: dateObj.getDate(),
          month: dateObj.getMonth() + 1, // getMonth() returns 0-11
          year: dateObj.getFullYear(),
          hour: timeObj.getHours(),
          min: timeObj.getMinutes(),
          what_do_you_do: 'study',
          marital_status: 'single',
          children: 'no',
          health_issues_if_any: '-',
          main_source_of_finances: '-',
          lat: lat || 0,
          lon: lng || 0,
          tzone: 5.5, // Default timezone for India, you might want to make this dynamic
        };

        console.log('Form values:', values);
        console.log('Selected date:', selectedDate);
        console.log('Selected time:', selectedTime);
        console.log('Parsed date object:', dateObj);
        console.log('Parsed time object:', timeObj);
        console.log('Submitting birth data:', birthData);

        // Call the API to create birth data
        const response = await userService.createBirthData(birthData);

        console.log('Birth data creation response:', response);

        Toast.show({
          type: 'success',
          text1: 'Member Added Successfully',
          text2: 'New member has been added to your account.',
          position: 'top',
          topOffset: 60,
          visibilityTime: 3000,
        });

        // Navigate to next screen or go back
        navigation.goBack();
      } catch (error: any) {
        console.error('Error submitting birth data:', error);
        const errorMessage = error?.message || 'Something went wrong.';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
          position: 'top',
          topOffset: 60,
          visibilityTime: 3000,
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handlePlaceSelect = async (item: DropdownItem) => {
    console.log('item-->123', item);

    const placeId = item.place_id;

    // 2. Place Details request
    const detailsRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`,
    );

    const detailsData = await detailsRes.json();

    console.log('detailsData-->123', detailsData);

    const location = detailsData.result?.geometry?.location;

    console.log('location-->123', location);

    // Store the location object in formik
    formik.setFieldValue('placeOfBirth', location);

    // Also store the display name for the dropdown
    formik.setFieldValue('placeOfBirthDisplay', item.label);

    setSearchQuery('');
    setPlaces([]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : -84}
      enabled
    >
      <MainContainer>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerWrap}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Image
                source={require('../../assets/icons/back.png')}
                style={styles.backIcon}
              />
            </TouchableOpacity>
            <View style={styles.backIconWrap}>

            <Text style={styles.topBarText}>Add New Member</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* First Name */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor={color.themeTextWhite}
                value={formik.values.firstName}
                onChangeText={formik.handleChange('firstName')}
                onBlur={formik.handleBlur('firstName')}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <Text style={styles.errorText}>{formik.errors.firstName}</Text>
              )}
            </View>

            {/* Last Name */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor={color.themeTextWhite}
                value={formik.values.lastName}
                onChangeText={formik.handleChange('lastName')}
                onBlur={formik.handleBlur('lastName')}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <Text style={styles.errorText}>{formik.errors.lastName}</Text>
              )}
            </View>

            {/* Gender */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowGenderModal(true)}
              >
                <Text
                  style={[
                    styles.inputText,
                    !formik.values.gender && styles.placeholderText,
                  ]}
                >
                  {formik.values.gender || 'Gender'}
                </Text>
                <Image
                  source={require('../../assets/icons/Dropdown.png')}
                  style={[styles.dropdownIcon, { marginRight: responsiveWidth('0') }]}
                />
              </TouchableOpacity>
              {formik.touched.gender && formik.errors.gender && (
                <Text style={styles.errorText}>{formik.errors.gender}</Text>
              )}
            </View>

            {/* Prediction Type */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowPredictionTypeModal(true)}
              >
                <Text
                  style={[
                    styles.inputText,
                    !formik.values.predictionType && styles.placeholderText,
                  ]}
                >
                  {formik.values.predictionType || 'Prediction Type'}
                </Text>
                <Image
                  source={require('../../assets/icons/Dropdown.png')}
                  style={[styles.dropdownIcon, { marginRight: responsiveWidth('0') }]}
                />
              </TouchableOpacity>
              {formik.touched.predictionType && formik.errors.predictionType && (
                <Text style={styles.errorText}>{formik.errors.predictionType}</Text>
              )}
            </View>

            {/* Date of Birth */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={[
                    styles.inputText,
                    !formik.values.dateOfBirth && styles.placeholderText,
                  ]}
                >
                  {formik.values.dateOfBirth || 'Date of Birth'}
                </Text>
                <Image
                  source={require('../../assets/icons/date-pikar.png')}
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>
              {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                <Text style={styles.errorText}>
                  {formik.errors.dateOfBirth}
                </Text>
              )}
            </View>

            {/* Time of Birth */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowTimePicker(true)}
              >
                <Text
                  style={[
                    styles.inputText,
                    !formik.values.timeOfBirth && styles.placeholderText,
                  ]}
                >
                  {formik.values.timeOfBirth || 'Time of Birth'}
                </Text>
                <Image
                  source={require('../../assets/icons/time_piker.png')}
                  style={styles.clockIcon}
                />
              </TouchableOpacity>
              {formik.touched.timeOfBirth && formik.errors.timeOfBirth && (
                <Text style={styles.errorText}>
                  {formik.errors.timeOfBirth}
                </Text>
              )}
            </View>

            {/* Place of Birth */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.input}
                onPress={() => {
                  setIsPlaceDropdownOpen(!isPlaceDropdownOpen);
                  if (!isPlaceDropdownOpen && searchQuery.trim()) {
                    searchPlaces(searchQuery);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.inputContent}>
                  <Image
                    source={require('../../assets/icons/location.png')}
                    style={styles.dropdownIcon}
                  />
                  <Text
                    style={[
                      styles.inputText,
                      !formik.values.placeOfBirthDisplay &&
                        styles.placeholderText,
                    ]}
                  >
                    {formik.values.placeOfBirthDisplay || 'Place of Birth'}
                  </Text>
                </View>
                <Image
                  source={require('../../assets/icons/Dropdown.png')}
                  style={[
                    styles.dropdownIcon,
                    {
                      transform: [
                        { rotate: isPlaceDropdownOpen ? '180deg' : '0deg' },
                      ],
                      marginLeft: -responsiveWidth('5'),
                    },
                  ]}
                />
              </TouchableOpacity>

              {/* Custom Place Dropdown */}
              {isPlaceDropdownOpen && (
                <View style={styles.dropdownListContainer}>
                  <View style={styles.dropdownHeader}>
                    <TextInput
                      style={styles.dropdownSearchInput}
                      placeholder="Search places..."
                      placeholderTextColor={color.themeTextWhite}
                      value={searchQuery}
                      onChangeText={text => {
                        setSearchQuery(text);
                        if (text.trim()) {
                          searchPlaces(text);
                        }
                      }}
                      autoFocus
                    />
                  </View>

                  <ScrollView
                    style={styles.dropdownList}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    {filteredPlaces.map((item, index) => (
                      <TouchableOpacity
                        key={item.value}
                        style={[
                          styles.dropdownItem,
                          index === filteredPlaces.length - 1 && {
                            borderBottomWidth: 0,
                          },
                        ]}
                        onPress={() => {
                          handlePlaceSelect(item);
                          setIsPlaceDropdownOpen(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownItemText}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {formik.touched.placeOfBirth && formik.errors.placeOfBirth && (
                <Text style={styles.errorText}>
                  {formik.errors.placeOfBirth}
                </Text>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={formik.handleSubmit}
              disabled={formik.isSubmitting}
            >
              <Text style={styles.saveButtonText}>
                {formik.isSubmitting ? 'Saving...' : 'Add New Member'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </MainContainer>

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => setShowGenderModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <FlatList
              data={genderOptions}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    formik.setFieldValue('gender', item);
                    setShowGenderModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={styles.modalSeparator} />
              )}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Prediction Type Selection Modal */}
      <Modal
        visible={showPredictionTypeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPredictionTypeModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => setShowPredictionTypeModal(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <FlatList
              data={predictionTypeOptions}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    formik.setFieldValue('predictionType', item);
                    setShowPredictionTypeModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={styles.modalSeparator} />
              )}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Native Date Picker */}
      {showDatePicker && Platform.OS !== 'ios' && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event: any, date?: Date) => {
            // Android returns an event type: 'dismissed' | 'set'
            setShowDatePicker(false);
            if (event?.type === 'set' && date) {
              setSelectedDate(date);
              formik.setFieldValue('dateOfBirth', formatDate(date));
            }
          }}
          themeVariant="dark"
        />
      )}
      {showDatePicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                <Text style={styles.modalTitle}>Select Date of Birth</Text>
              </View>
              <DateTimePicker
                value={iosTempDate || selectedDate || new Date()}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(event: any, date?: Date) => {
                  if (date) setIosTempDate(date);
                }}
                themeVariant="dark"
                style={{ alignSelf: 'stretch' }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowDatePicker(false);
                    setIosTempDate(null);
                  }}
                >
                  <Text style={styles.modalItemText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const finalDate = iosTempDate || selectedDate || new Date();
                    setSelectedDate(finalDate);
                    formik.setFieldValue('dateOfBirth', formatDate(finalDate));
                    setShowDatePicker(false);
                    setIosTempDate(null);
                  }}
                >
                  <Text style={styles.modalItemText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Native Time Picker */}
      {showTimePicker && Platform.OS !== 'ios' && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          display="default"
          is24Hour={false}
          onChange={(event: any, time?: Date) => {
            setShowTimePicker(false);
            if (event?.type === 'set' && time) {
              setSelectedTime(time);
              formik.setFieldValue('timeOfBirth', formatTime(time));
            }
          }}
          themeVariant="dark"
        />
      )}
      {showTimePicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
                <Text style={styles.modalTitle}>Select Time of Birth</Text>
              </View>
              <DateTimePicker
                value={iosTempTime || selectedTime || new Date()}
                mode="time"
                display="spinner"
                is24Hour={false}
                onChange={(event: any, time?: Date) => {
                  if (time) setIosTempTime(time);
                }}
                themeVariant="dark"
                style={{ alignSelf: 'stretch' }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowTimePicker(false);
                    setIosTempTime(null);
                  }}
                >
                  <Text style={styles.modalItemText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const finalTime = iosTempTime || selectedTime || new Date();
                    setSelectedTime(finalTime);
                    formik.setFieldValue('timeOfBirth', formatTime(finalTime));
                    setShowTimePicker(false);
                    setIosTempTime(null);
                  }}
                >
                  <Text style={styles.modalItemText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: {
    padding: 8,
    marginRight: 16,
  },
  backIcon: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  topBarText: {
    fontSize: 24,
    fontFamily: fontFamily.regular,
    // fontWeight: '600',
    color: '#F6EFD9',
  },
  backIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerTitle: {
    color: '#F6EFD9',
    // color: 'rgba(238, 229, 202, 1)',
    fontSize: 24,
    // fontWeight: '700',
    fontFamily: fontFamily.regular,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(34, 49, 73, 1)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: responsiveWidth('2.5'),
    borderWidth: 2,
    // fontWeight: '500',
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: color.themeTextWhite,
    borderColor: '#rgba(73, 108, 168, 1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputText: {
    color: color.themeTextWhite,
    fontSize: 16,
    fontFamily: fontFamily.regular,

    // fontWeight: '500',
    flex: 1,
  },
  placeholderText: {
    color: color.themeTextWhite,
  },
  dropdownIcon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    marginRight: responsiveWidth('2'),
    resizeMode: 'contain',
    tintColor: color.themeTextWhite,
  },
  calendarIcon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    resizeMode: 'contain',
    tintColor: color.themeTextWhite,
  },
  clockIcon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    resizeMode: 'contain',
    tintColor: color.themeTextWhite,
  },
  saveButton: {
    backgroundColor: 'rgba(223, 138, 93, 1)',
    borderRadius: 10,
    paddingVertical: responsiveWidth('2.5'),
    alignItems: 'center',
    marginTop: responsiveWidth('3%'),
    marginBottom: responsiveWidth('20%'),
  },
  saveButtonText: {
    color: color.themeTextWhite,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.6,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '600',
    fontFamily: fontFamily.regular,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
    fontFamily: fontFamily.regular,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#34495E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingBottom: 16,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5DADE2',
    marginVertical: 12,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fontFamily.regular,
  },
  modalItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.regular,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#5DADE2',
    marginHorizontal: 20,
  },
  dropdownContainer: {
    position: 'relative',
  },
  searchInput: {
    backgroundColor: 'rgba(34, 49, 73, 1)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: responsiveWidth('3'),
    borderWidth: 2,
    borderColor: '#rgba(73, 108, 168, 1)',
    color: 'rgba(166, 168, 166, 1)',
    fontSize: 16,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(34, 49, 73, 1)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#rgba(73, 108, 168, 1)',
    marginTop: 4,
  },
  dropdownListContainer: {
    backgroundColor: 'rgba(34, 49, 73, 1)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#rgba(73, 108, 168, 1)',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: 4,
    maxHeight: 250,
    overflow: 'hidden',
  },
  dropdownHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownList: {
    maxHeight: 200, // Adjust as needed
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(73, 108, 168, 0.3)',
  },
  dropdownSelectedItem: {
    padding: 16,
    backgroundColor: 'rgba(73, 108, 168, 0.1)',
  },
  dropdownItemText: {
    color: 'white',
    fontSize: 16,
    fontFamily: fontFamily.regular,
  },
  dropdownPlaceholder: {
    color: 'white',
    fontSize: 16,
    fontFamily: fontFamily.regular,
    marginLeft: responsiveWidth('2'),
  },
  dropdownSelectedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.regular,
    fontWeight: '500',
    textAlign: 'left',
    backgroundColor: 'transparent',
    lineHeight: 24,
    letterSpacing: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
    shadowColor: 'transparent',
    textShadowColor: 'transparent',
  },
  dropdownInputSearch: {
    backgroundColor: 'rgba(34, 49, 73, 1)',
    color: 'white',
    fontSize: 16,
    fontFamily: fontFamily.regular,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(73, 108, 168, 0.3)',
  },
  dropdownSearchInput: {
    backgroundColor: 'rgba(34, 49, 73, 1)',
    color: 'white',
    fontSize: 16,
    fontFamily: fontFamily.regular,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(73, 108, 168, 0.3)',
  },
  datePickerContainer: {
    paddingHorizontal: 20,
  },
  dateOption: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  dateOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.regular,
  },
  timePickerContainer: {
    paddingHorizontal: 20,
  },
  timeOption: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  timeOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.regular,
  },
});

export default AddNewMember;
