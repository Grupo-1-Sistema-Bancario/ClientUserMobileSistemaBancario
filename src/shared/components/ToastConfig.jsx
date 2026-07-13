import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const toastConfig = {
  astraSuccess: ({ text1 }) => (
    <View style={[styles.toastBase, { borderColor: '#F1D302' }]}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
  astraError: ({ text1 }) => (
    <View style={[styles.toastBase, { borderColor: '#C1292E' }]}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
  astraInfo: ({ text1 }) => (
    <View style={[styles.toastBase, { borderColor: '#F1D302' }]}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastBase: {
    width: '90%',
    backgroundColor: '#161925', 
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
    top: 20,
  },
  toastText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});