import { useState, useCallback } from 'react';
import {
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Coordinates } from '../types/weather';

export type LocationStatus =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'denied_forever'
  | 'error';

export interface LocationState {
  coordinates: Coordinates | null;
  status: LocationStatus;
  errorMessage: string | null;
}

// Hook quản lý quyền và lấy vị trí GPS
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coordinates: null,
    status: 'idle',
    errorMessage: null,
  });

  // Xin quyền vị trí trên Android
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Quyền truy cập vị trí',
          message:
            'Ứng dụng cần quyền vị trí để hiển thị thời tiết tại nơi bạn đang đứng.',
          buttonNeutral: 'Hỏi lại sau',
          buttonNegative: 'Từ chối',
          buttonPositive: 'Cho phép',
        },
      );

      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        setState(prev => ({
          ...prev,
          status: 'denied_forever',
          errorMessage:
            'Bạn đã từ chối quyền vị trí vĩnh viễn. Vui lòng mở cài đặt để bật lại.',
        }));
        return false;
      }

      // Bị từ chối nhưng có thể hỏi lại
      setState(prev => ({
        ...prev,
        status: 'denied',
        errorMessage: 'Quyền vị trí bị từ chối. Hãy cho phép để xem thời tiết tại vị trí của bạn.',
      }));
      return false;
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: 'Không thể xin quyền vị trí',
      }));
      return false;
    }
  };

  // Lấy tọa độ GPS hiện tại
  const getCurrentLocation = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'requesting', errorMessage: null }));

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setState({
          coordinates: { latitude, longitude },
          status: 'granted',
          errorMessage: null,
        });
      },
      error => {
        let message = 'Không thể lấy vị trí';
        if (error.code === 1) {
          message = 'Quyền vị trí bị từ chối';
        } else if (error.code === 2) {
          message =
            'GPS không khả dụng. Hãy bật định vị và thử lại, hoặc mở Google Maps một lần để kích hoạt.';
        } else if (error.code === 3) {
          message =
            'Hết thời gian lấy vị trí. Hãy thử lại hoặc mở Google Maps để kích hoạt GPS.';
        }

        setState(prev => ({
          ...prev,
          status: 'error',
          errorMessage: message,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);

  // Mở cài đặt ứng dụng để người dùng bật quyền thủ công
  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return {
    ...state,
    getCurrentLocation,
    openSettings,
  };
}
