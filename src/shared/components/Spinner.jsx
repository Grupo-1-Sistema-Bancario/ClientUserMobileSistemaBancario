import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Polyline, Polygon, Circle } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    easing,
    useAnimatedStyle
} from 'react-native-reanimated';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const Spinner = () => {
    const bodyTranslationY = useSharedValue(0);
    const bodyRotation = useSharedValue(0);
    const lineOffset = useSharedValue(-18);
    const outside1Offset = useSharedValue(105);
    const outside2Offset = useSharedValue(168);
    const outside3Offset = useSharedValue(192);
    const wheelSpinOffset = useSharedValue(-15.71);
    const wheelSpinRotation = useSharedValue(0);

    useEffect(() => {
        const DURATION = 3000;

        bodyTranslationY.value = withRepeat(
            withTiming(1, { duration: DURATION * 0.0625, easing: easing.bezier(0.33, 0, 0.67, 0) }),
            -1,
            true
        );
        bodyRotation.value = withRepeat(
            withTiming(-0.75, { duration: DURATION * 0.0625, easing: easing.bezier(0.33, 0, 0.67, 0) }),
            -1,
            true
        );

        lineOffset.value = withRepeat(withTiming(78, { duration: DURATION, easing: easing.linear }), -1, false);
        outside1Offset.value = withRepeat(withTiming(-105, { duration: DURATION, easing: easing.linear }), -1, false);
        outside2Offset.value = withRepeat(withTiming(-42, { duration: DURATION, easing: easing.linear }), -1, false);
        outside3Offset.value = withRepeat(withTiming(-18, { duration: DURATION, easing: easing.linear }), -1, false);
        wheelSpinOffset.value = withRepeat(withTiming(15.71, { duration: DURATION, easing: easing.linear }), -1, false);
        wheelSpinRotation.value = withRepeat(withTiming(-1440, { duration: DURATION, easing: easing.linear }), -1, false);
    }, []);

    const bodyAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: bodyTranslationY.value }, { rotate: `${bodyRotation.value}deg` }],
    }));

    const lineAnimatedProps = useAnimatedProps(() => ({ strokeDashoffset: lineOffset.value }));
    const out1AnimatedProps = useAnimatedProps(() => ({ strokeDashoffset: outside1Offset.value }));
    const out2AnimatedProps = useAnimatedProps(() => ({ strokeDashoffset: outside2Offset.value }));
    const out3AnimatedProps = useAnimatedProps(() => ({ strokeDashoffset: outside3Offset.value }));
    const wheelAnimatedProps = useAnimatedProps(() => ({
        strokeDashoffset: wheelSpinOffset.value,
        transform: [{ rotate: `${wheelSpinRotation.value}deg` }]
    }));

    return (
        <View style={styles.container}>
            <Svg width="240" height="120" viewBox="0 0 48 24" aria-label="Cargando..." role="img">
                <G fill="none" stroke="#A855F7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" transform="translate(0,2)">
                    <AnimatedG style={bodyAnimatedStyle} originX={17} originY={11}>
                        <G strokeDasharray="105 105">
                            <AnimatedPolyline animatedProps={out1AnimatedProps} points="2 17,1 17,1 11,5 9,7 1,39 1,39 6" />
                            <AnimatedPolyline animatedProps={out2AnimatedProps} points="39 12,39 17,31.5 17" />
                            <AnimatedPolyline animatedProps={out3AnimatedProps} points="22.5 17,11 17" />
                            <Polyline points="6.5 4,8 4,8 9,5 9" />
                            <Polygon points="10 4,10 9,14 9,14 4" />
                        </G>
                        <AnimatedPolyline animatedProps={lineAnimatedProps} points="43 8,31 8" strokeDasharray="10 2 10 2 10 2 10 2 10 2 10 26" stroke="#D8B4FE" />
                        <AnimatedPolyline animatedProps={lineAnimatedProps} points="47 10,31 10" strokeDasharray="14 2 14 2 14 2 14 2 14 18" stroke="#D8B4FE" />
                    </AnimatedG>
                    <G strokeDasharray="15.71 15.71">
                        <AnimatedG style={bodyAnimatedStyle} originX={6.5} originY={17}><AnimatedCircle animatedProps={wheelAnimatedProps} r="2.5" cx="6.5" cy="17" originX={6.5} originY={17} /></AnimatedG>
                        <AnimatedG style={bodyAnimatedStyle} originX={27} originY={17}><AnimatedCircle animatedProps={wheelAnimatedProps} r="2.5" cx="27" cy="17" originX={27} originY={17} /></AnimatedG>
                    </G>
                </G>
            </Svg>
            <Text style={styles.loadingText}>Cargando...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(22, 25, 37, 0.7)', // Usamos tu color base oscuro con opacidad
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    loadingText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 4,
        textTransform: 'uppercase',
        marginTop: 16,
    },
});