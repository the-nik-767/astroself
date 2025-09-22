import crashlytics from '@react-native-firebase/crashlytics';

class CrashlyticsService {
  /**
   * Log a custom event to Crashlytics
   * @param message - The message to log
   * @param data - Additional data to include
   */
  static log(message: string, data?: Record<string, any>) {
    try {
      crashlytics().log(message);
      if (data) {
        Object.keys(data).forEach(key => {
          crashlytics().setAttribute(key, String(data[key]));
        });
      }
    } catch (error) {
      console.warn('Failed to log to Crashlytics:', error);
    }
  }

  /**
   * Set a custom attribute for the user
   * @param key - The attribute key
   * @param value - The attribute value
   */
  static setAttribute(key: string, value: string) {
    try {
      crashlytics().setAttribute(key, value);
    } catch (error) {
      console.warn('Failed to set Crashlytics attribute:', error);
    }
  }

  /**
   * Set user identifier
   * @param userId - The user ID
   */
  static setUserId(userId: string) {
    try {
      crashlytics().setUserId(userId);
    } catch (error) {
      console.warn('Failed to set Crashlytics user ID:', error);
    }
  }

  /**
   * Record a non-fatal error
   * @param error - The error to record
   */
  static recordError(error: Error) {
    try {
      crashlytics().recordError(error);
    } catch (err) {
      console.warn('Failed to record error in Crashlytics:', err);
    }
  }

  /**
   * Test crash (only use for testing!)
   * WARNING: This will crash your app!
   */
  static testCrash() {
    try {
      crashlytics().crash();
    } catch (error) {
      console.warn('Failed to test crash:', error);
    }
  }

  /**
   * Check if Crashlytics is enabled
   * @returns Promise<boolean>
   */
  static async isEnabled(): Promise<boolean> {
    try {
      return await crashlytics().isCrashlyticsCollectionEnabled();
    } catch (error) {
      console.warn('Failed to check Crashlytics status:', error);
      return false;
    }
  }

  /**
   * Enable or disable Crashlytics collection
   * @param enabled - Whether to enable collection
   */
  static async setEnabled(enabled: boolean) {
    try {
      await crashlytics().setCrashlyticsCollectionEnabled(enabled);
    } catch (error) {
      console.warn('Failed to set Crashlytics collection:', error);
    }
  }
}

export default CrashlyticsService;
