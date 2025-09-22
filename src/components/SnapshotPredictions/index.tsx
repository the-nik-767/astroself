import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { color, fontFamily, responsiveHeight, responsiveWidth } from '../../constant/theme';
import { useNavigation } from '@react-navigation/native';

interface SnapshotPredictionsProps {
  selectedMemberId?: string;
}

const SnapshotPredictions: React.FC<SnapshotPredictionsProps> = ({ selectedMemberId }) => {
  const navigation = useNavigation<any>();

  const handleCardPress = (cardValue: string) => {
    console.log('cardTitle-->24', cardValue);
    console.log('selectedMemberId-->25', selectedMemberId);
    // Navigate to ChatWithPrompts screen for Snapshot Predictions
    navigation.navigate('ChatWithPrompts', {
      userId: selectedMemberId,
      cardTitles: cardValue,
      tab: 'SnapCast',
    });
  };

  const cards = [
    {
      id: 1,
      title: 'Snapshot Prediction',
      value: 'Snapshot Prediction',
      subtitle: 'Future, Glimpse',
      icon: require('../../assets/icons/GeneralAnalysis/SnapshotPrediction.png'),
    },
    {
      id: 2,
      title: 'Your Predictions',
      value: 'Your Predictions',
      subtitle: '',
      icon: require('../../assets/icons/GeneralAnalysis/SnapshotPrediction.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.cardsGrid}>
          {cards.map(card => (
            <TouchableOpacity 
              key={card.id} 
              style={styles.card} 
              onPress={() => handleCardPress(card.value)}
            >
              <View style={styles.cardIconContainer}>
                <Image source={card.icon} style={styles.cardIcon} />
              </View>
              <Text style={styles.cardText}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'rgba(238, 229, 202, 1)',
    paddingHorizontal: responsiveWidth(3),
    paddingTop: responsiveHeight(1.5),
    borderRadius: 12,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // paddingVertical: responsiveWidth(2),
  },
  card: {
    width: '48%',
    backgroundColor: '#223149',
    borderRadius: 20,
    padding: responsiveWidth(2),
    height: responsiveHeight(18),
    marginBottom: responsiveHeight(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconContainer: {
    // marginBottom: responsiveWidth(2),
  },
  cardIcon: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
  },
  cardText: {
    color: color.themeTextWhite,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    // marginBottom: responsiveWidth(1),
  },
  cardSubtitle: {
    color: color.themeTextWhite,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    // opacity: 0.7,
    textAlign: 'center',
  },
});

export default SnapshotPredictions;
