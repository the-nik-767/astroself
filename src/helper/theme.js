import SafeArea from 'react-native-safe-area';

/** Theme Methods */
class ScreenHelper {
  async getScreenSafeArea() {
    return SafeArea.getSafeAreaInsetsForRootView()
      .then((result) => {
        return result.safeAreaInsets;
      })
      .catch(() => {
        return { top: 0, bottom: 0, left: 0, right: 0 };
      });
  }
  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
      : null;
  }

  isPotrait(orientation) {
    if (
      orientation === 'PORTRAIT' ||
      orientation === 'PORTRAITUPSIDEDOWN' ||
      orientation === 'UNKNOWN' ||
      !orientation
    ) {
      return true;
    } else {
      return false;
    }
  }
}

const screenHelper = new ScreenHelper();
Object.freeze(screenHelper);
export default screenHelper;
