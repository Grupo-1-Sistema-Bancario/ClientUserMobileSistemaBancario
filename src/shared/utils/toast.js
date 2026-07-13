let Toast = null;

export const setToast = (toast) => {
  Toast = toast;
};

export const showToast = (options) => {
  if (Toast && typeof Toast.show === 'function') {
    Toast.show(options);
  } else {
    console.warn('Toast not available:', options);
  }
};

export const showSuccess = (text1, text2) => showToast({ type: 'success', text1, text2 });
export const showError = (text1, text2) => showToast({ type: 'error', text1, text2 });