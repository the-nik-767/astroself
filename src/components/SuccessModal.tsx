import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Frame from '../assets/svgs/Frame.svg';
import { color, font } from '../constant/theme';

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    message?: string;
}

const SuccessModal = ({ visible, onClose, message = "Success!" }: SuccessModalProps) => {
    return (
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Frame style={styles.frame} />

            <View style={styles.buttonContainer}>
              <Text style={styles.title}>Successfully registered</Text>
              <Text style={styles.description}>
                you have successfully registered, you can access the dashboard
                and other features
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonText}>Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        width: '85%',
    },
    message: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    frame: {
        marginTop: 5,
        marginBottom: -20,
    },
    title: {
        ...font.h5,
        textAlign: 'center',
        color: color.black,
        marginTop: 20,
       
    },
    description: {
        ...font.body,
        textAlign: 'center',
        color: color.gray,
        marginTop: 8,
        marginHorizontal: 20,
        textDecorationLine: 'none',
        textDecorationStyle: 'solid',
    },
    buttonContainer: {
        marginVertical: 20,
        // marginHorizontal: 20,
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: '#0047AF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SuccessModal; 