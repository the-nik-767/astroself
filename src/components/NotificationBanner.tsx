import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationBannerProps {
  onPress: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ onPress }) => {
  const { isNotificationEnabled, isLoading } = useNotifications();
  const [bannerVisible, setBannerVisible] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    if (!isLoading && !isNotificationEnabled) {
      setBannerVisible(true);
      // Slide down animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide up animation
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setBannerVisible(false);
      });
    }
  }, [isLoading, isNotificationEnabled, slideAnim]);

  if (!bannerVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.bannerContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔔</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Enable Notifications</Text>
          <Text style={styles.subtitle}>Stay updated with important alerts</Text>
        </View>
        
        <TouchableOpacity style={styles.enableButton} onPress={onPress}>
          <Text style={styles.enableButtonText}>Enable</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50, // Account for status bar
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  enableButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  enableButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NotificationBanner;
