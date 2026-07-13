import Toast from 'react-native-toast-message';

export const showSuccess = (message) => {
    Toast.show({ type: 'astraSuccess', text1: message });
};

export const showError = (message) => {
    Toast.show({ type: 'astraError', text1: message });
};

export const showInfo = (message) => {
    Toast.show({ type: 'astraInfo', text1: message });
};