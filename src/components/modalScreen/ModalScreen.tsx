import React, { useEffect, useRef } from 'react';
import { Alert, Modal, StyleSheet, Text, View, Animated, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { color, font, responsiveWidth } from '../../constant/theme';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface DesignDetails {
  description: string;
  designFactor: number;
  designName: string;
  id: number;
  imageUrl: string;
  measurement: string;
}

interface MeasurementDetails {
  height: number;
  squareMeter: number;
  width: number;
}

interface OtherDetails {
  description: string;
  title: string;
}

interface ResponseData {
  designDetails: DesignDetails;
  measurementDetails: MeasurementDetails;
  otherDetails: OtherDetails;
  message: string;
  status: string;
}

interface ModalScreenProps {
  modalVisible: boolean;
  setModalVisible: () => void;
  designDetails: ResponseData;
  measurementData: { id?: number; value: string; measurementName: string }[];
}

const ModalScreen: React.FC<ModalScreenProps> = (props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;
  const userService = serviceFactory.get<UserService>('UserService');
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    if (props.modalVisible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true
        }),
        Animated.timing(translateY, {
          toValue: 50,
          duration: 600,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [props.modalVisible]);

  const handleSubmit = async () => {
    const dats = {
      designId: props.designDetails.designDetails.id,
      measurementData: props.measurementData,
      calculatedData: {
        width: props.designDetails.measurementDetails.width,
        height: props.designDetails.measurementDetails.height,
        squareMeter: props.designDetails.measurementDetails.squareMeter
      }
    };

    const res = await userService.sendprojects(dats);

    if (res) {
      props.setModalVisible();
      // Assuming you have a 'Video' screen in your navigator
      navigation.navigate('Video',props.designDetails.measurementDetails);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={props.modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        props.setModalVisible();
      }}
    >
      <View style={styles.centeredView}>
        <TouchableWithoutFeedback onPress={() => props.setModalVisible()}>
          <View style={styles.blurEffect} />
        </TouchableWithoutFeedback>

        <View style={styles.modalWrapper}>
          <TouchableWithoutFeedback onPress={() => props.setModalVisible()}>
            <Animated.View style={[styles.modalView, { opacity, transform: [{ translateY }] }]}>
              <TouchableOpacity
                onPress={() => props.setModalVisible()}
                style={styles.closeButton}
              />

              <View style={styles.imageContainer}>
                <FastImage
                  source={{
                    uri: props?.designDetails?.designDetails.imageUrl,
                    headers: { Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  style={styles.image}
                />
              </View>

              {props?.designDetails?.otherDetails && (
                <View style={styles.container}>
                  <View style={styles.card}>
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>{props?.designDetails.otherDetails.title}</Text>
                      <Text style={styles.subTitle}>{props?.designDetails.otherDetails.description}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>{t("OkDone")}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: color.transparentGray,
    justifyContent: 'flex-end', // Align content at the bottom
  },
  blurEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalWrapper: {
    width: '100%',
    justifyContent: 'flex-end', // Align modal content at the bottom
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: responsiveWidth(5),
    borderTopRightRadius: responsiveWidth(5),
    padding: responsiveWidth('3'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%', // Full width
  },
  closeButton: {
    width: responsiveWidth('20'),
    height: responsiveWidth('1'),
    backgroundColor: color.gray,
    alignSelf: 'center',
    borderRadius: responsiveWidth(2)
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: responsiveWidth('5')
  },
  image: {
    width: responsiveWidth('33%'),
    height: responsiveWidth('33%')
  },
  container: {
    padding: responsiveWidth('3'),
    alignItems: 'center'
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: responsiveWidth('3'),
    width: responsiveWidth('90%'),
    margin: responsiveWidth('2')
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    ...font.subtitleLarge,
    color: color.black,
    textAlign: 'center'
  },
  subTitle: {
    ...font.label,
    color: color.pink,
    textAlign: 'center',
    marginTop: responsiveWidth('2%')
  },
  button: {
    backgroundColor: color.pink,
    padding: responsiveWidth('3'),
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    marginBottom: responsiveWidth('4')
  },
  buttonText: {
    ...font.button,
    color: color.white,
  }
});

export default ModalScreen;
