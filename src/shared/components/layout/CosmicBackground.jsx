import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/theme";

const STAR_COUNT = 26;

function buildStars() {
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i += 1) {
    stars.push({
      id: i,
      left: Math.random() * 100, // porcentaje, se adapta sin useWindowDimensions
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.15,
    });
  }
  return stars;
}

/**
 * Fondo espacial LIGERO (sin react-native-svg). Reemplaza la versión con
 * <Svg> a pantalla completa, que en la Nueva Arquitectura se recomponía en
 * cada frame/transición y podía congelar el hilo de UI (ANR).
 *
 * - Base sólida + orbes como círculos con degradado hasta transparente.
 * - pointerEvents "none" en el estilo => nunca captura toques.
 * - Sin zIndex => siempre queda detrás del navegador por orden de render.
 */
const CosmicBackground = () => {
  const stars = useMemo(() => buildStars(), []);

  return (
    <View style={styles.root}>
      <View style={styles.base} />

      {/* Orbe fucsia (arriba-izquierda) */}
      <LinearGradient
        colors={["rgba(216,27,96,0.35)", "rgba(216,27,96,0)"]}
        style={[styles.orb, styles.orbFuchsia]}
      />
      {/* Orbe púrpura (centro) */}
      <LinearGradient
        colors={["rgba(123,47,190,0.30)", "rgba(123,47,190,0)"]}
        style={[styles.orb, styles.orbPurple]}
      />
      {/* Orbe cian (abajo-derecha) */}
      <LinearGradient
        colors={["rgba(0,191,165,0.28)", "rgba(0,191,165,0)"]}
        style={[styles.orb, styles.orbCyan]}
      />

      {/* Viñeta sutil */}
      <LinearGradient
        colors={["rgba(13,10,20,0)", "rgba(13,10,20,0.55)"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Estrellas (vistas baratas, posición en %) */}
      {stars.map((s) => (
        <View
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: s.size / 2,
            opacity: s.opacity,
            backgroundColor: COLORS.text,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    overflow: "hidden",
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.spaceBg,
  },
  orb: {
    position: "absolute",
    borderRadius: 9999,
  },
  orbFuchsia: {
    width: 360,
    height: 360,
    top: -120,
    left: -80,
  },
  orbPurple: {
    width: 420,
    height: 420,
    top: "35%",
    left: "10%",
  },
  orbCyan: {
    width: 380,
    height: 380,
    bottom: -120,
    right: -90,
  },
});

export default CosmicBackground;
