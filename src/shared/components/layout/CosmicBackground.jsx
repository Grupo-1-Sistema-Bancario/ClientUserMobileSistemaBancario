import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Dimensions, useWindowDimensions } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Circle, Rect } from "react-native-svg";
import { COLORS } from "../../constants/theme";

const STAR_COUNT = 48;

function buildStars(width, height) {
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i += 1) {
    stars.push({
      id: i,
      left: Math.random() * width,
      top: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      opacity: Math.random() * 0.55 + 0.15,
    });
  }
  return stars;
}

const CosmicBackground = () => {
  const { width, height } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const stars = useMemo(
    () => buildStars(width || Dimensions.get("window").width, height || Dimensions.get("window").height),
    [width, height],
  );

  const w = width || 390;
  const h = height || 844;

  const orbFuchsia = w * 0.95;
  const orbCyan = w * 1.1;
  const orbPurple = w * 1.15;

  return (
    <View style={styles.root} pointerEvents="none">
      <View style={[styles.base, { backgroundColor: COLORS.spaceBg }]} />

      <View style={[styles.orbsLayer, { opacity: mounted ? 1 : 0 }]}>
        <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="orbFuchsia" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={COLORS.gradientFrom} stopOpacity="0.45" />
              <Stop offset="45%" stopColor={COLORS.gradientFrom} stopOpacity="0.18" />
              <Stop offset="100%" stopColor={COLORS.gradientFrom} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="orbCyan" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0.35" />
              <Stop offset="50%" stopColor={COLORS.cyan} stopOpacity="0.12" />
              <Stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="orbPurple" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={COLORS.gradientMid} stopOpacity="0.4" />
              <Stop offset="50%" stopColor={COLORS.gradientMid} stopOpacity="0.14" />
              <Stop offset="100%" stopColor={COLORS.gradientMid} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="vignette" cx="50%" cy="40%" r="70%">
              <Stop offset="0%" stopColor={COLORS.spaceBg} stopOpacity="0" />
              <Stop offset="100%" stopColor={COLORS.spaceBg} stopOpacity="0.55" />
            </RadialGradient>
          </Defs>

          <Circle
            cx={w * 0.22}
            cy={h * 0.08}
            r={orbFuchsia / 2}
            fill="url(#orbFuchsia)"
          />

          <Circle
            cx={w * 0.92}
            cy={h * 0.92}
            r={orbCyan / 2}
            fill="url(#orbCyan)"
          />

          <Circle
            cx={w * 0.45}
            cy={h * 0.48}
            r={orbPurple / 2}
            fill="url(#orbPurple)"
          />

          <Rect x={0} y={0} width={w} height={h} fill="url(#vignette)" />
        </Svg>
      </View>

      <View style={styles.starsLayer}>
        {stars.map((s) => (
          <View
            key={s.id}
            style={[
              styles.star,
              {
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                borderRadius: s.size / 2,
                opacity: s.opacity,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  base: {
    ...StyleSheet.absoluteFillObject,
  },
  orbsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  starsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: "absolute",
    backgroundColor: COLORS.text,
  },
});

export default CosmicBackground;
