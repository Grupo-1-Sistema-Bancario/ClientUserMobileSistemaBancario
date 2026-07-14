import { useState, useEffect } from "react";
import { Animated, StyleSheet } from "react-native";

/**
 * Contenedor de pantalla con animación de entrada equivalente a
 * `.animate-fadeIn` del web (opacity 0→1 + translateY -6→0).
 */
const Screen = ({ children, style }) => {
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(-6));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[styles.flex, { opacity, transform: [{ translateY }] }, style]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "transparent",
  },
});

export default Screen;
