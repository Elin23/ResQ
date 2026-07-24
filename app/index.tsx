import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    Image,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/AppText";
import { FONTS } from "@/src/constants/theme";
import { hasCompletedOnboarding } from "@/src/utils/onboardingStorage";

export default function SplashScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const screenOpacity = useRef(new Animated.Value(0)).current;

  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const illustrationScale = useRef(new Animated.Value(0.65)).current;
  const illustrationTranslateY = useRef(new Animated.Value(30)).current;
  const floatingTranslateY = useRef(new Animated.Value(0)).current;

  const pulseScale = useRef(new Animated.Value(0.7)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslateY = useRef(new Animated.Value(18)).current;
  const brandScale = useRef(new Animated.Value(0.9)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(14)).current;

  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const particleOne = useRef(new Animated.Value(0)).current;
  const particleTwo = useRef(new Animated.Value(0)).current;
  const particleThree = useRef(new Animated.Value(0)).current;

  const isCompact = height < 700;
  const isTablet = width >= 600;

  const illustrationSize = isTablet
    ? Math.min(width * 0.32, 230)
    : Math.min(width * 0.46, isCompact ? 155 : 190);

  const brandFontSize = isTablet
    ? 44
    : Math.max(30, Math.min(width * 0.085, 38));

  const subtitleFontSize = isTablet
    ? 20
    : Math.max(15, Math.min(width * 0.042, 18));

  const loaderWidth = Math.min(width * 0.38, 155);

  useEffect(() => {
    let isMounted = true;

    const navigateFromSplash = async () => {
      const onboardingCompleted = await hasCompletedOnboarding();

      if (!isMounted) {
        return;
      }

      if (onboardingCompleted) {
        router.replace("/login");
        return;
      }

      router.replace("/onboarding");
    };

    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingTranslateY, {
          toValue: -8,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingTranslateY, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, {
            toValue: 1.2,
            duration: 1400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.22,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(pulseOpacity, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 0.7,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    const createParticleAnimation = (
      value: Animated.Value,
      duration: number,
      delay: number,
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );

    const particleAnimationOne = createParticleAnimation(
      particleOne,
      1400,
      200,
    );

    const particleAnimationTwo = createParticleAnimation(
      particleTwo,
      1700,
      500,
    );

    const particleAnimationThree = createParticleAnimation(
      particleThree,
      1200,
      800,
    );

    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(illustrationOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(illustrationScale, {
          toValue: 1,
          friction: 6,
          tension: 55,
          useNativeDriver: true,
        }),
        Animated.timing(illustrationTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(brandScale, {
          toValue: 1,
          friction: 7,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(brandTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(loaderOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      floatingAnimation.start();
      pulseAnimation.start();
      particleAnimationOne.start();
      particleAnimationTwo.start();
      particleAnimationThree.start();
    });

    Animated.timing(progress, {
      toValue: 1,
      duration: 3400,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const navigationTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 350,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          void navigateFromSplash();
        }
      });
    }, 3600);

    return () => {
      isMounted = false;

      clearTimeout(navigationTimer);

      floatingAnimation.stop();
      pulseAnimation.stop();
      particleAnimationOne.stop();
      particleAnimationTwo.stop();
      particleAnimationThree.stop();

      screenOpacity.stopAnimation();
      illustrationOpacity.stopAnimation();
      illustrationScale.stopAnimation();
      illustrationTranslateY.stopAnimation();
      floatingTranslateY.stopAnimation();
      pulseScale.stopAnimation();
      pulseOpacity.stopAnimation();
      brandOpacity.stopAnimation();
      brandTranslateY.stopAnimation();
      brandScale.stopAnimation();
      subtitleOpacity.stopAnimation();
      subtitleTranslateY.stopAnimation();
      loaderOpacity.stopAnimation();
      progress.stopAnimation();
      particleOne.stopAnimation();
      particleTwo.stopAnimation();
      particleThree.stopAnimation();
    };
  }, [
    brandOpacity,
    brandScale,
    brandTranslateY,
    floatingTranslateY,
    illustrationOpacity,
    illustrationScale,
    illustrationTranslateY,
    loaderOpacity,
    particleOne,
    particleThree,
    particleTwo,
    progress,
    pulseOpacity,
    pulseScale,
    router,
    screenOpacity,
    subtitleOpacity,
    subtitleTranslateY,
  ]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, loaderWidth],
  });

  const progressGlowOpacity = progress.interpolate({
    inputRange: [0, 0.2, 0.8, 1],
    outputRange: [0, 1, 1, 0.6],
  });

  const particleOneTranslateY = particleOne.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -14],
  });

  const particleTwoTranslateY = particleTwo.interpolate({
    inputRange: [0, 1],
    outputRange: [8, -18],
  });

  const particleThreeTranslateY = particleThree.interpolate({
    inputRange: [0, 1],
    outputRange: [12, -10],
  });

  const particleOneOpacity = particleOne.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.15, 0.7, 0.15],
  });

  const particleTwoOpacity = particleTwo.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.1, 0.55, 0.1],
  });

  const particleThreeOpacity = particleThree.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.1, 0.65, 0.1],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Animated.View
        style={[
          styles.screen,
          {
            opacity: screenOpacity,
          },
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            styles.leftGlow,
            {
              width: width * 0.8,
              height: width * 0.8,
              borderRadius: width * 0.4,
              left: -width * 0.68,
              top: height * 0.22,
            },
          ]}
        />

        <View
          pointerEvents="none"
          style={[
            styles.topGlow,
            {
              width: width * 0.8,
              height: width * 0.8,
              borderRadius: width * 0.4,
              right: -width * 0.5,
              top: -width * 0.55,
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.particle,
            styles.particleOne,
            {
              opacity: particleOneOpacity,
              transform: [{ translateY: particleOneTranslateY }],
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.particle,
            styles.particleTwo,
            {
              opacity: particleTwoOpacity,
              transform: [{ translateY: particleTwoTranslateY }],
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.particle,
            styles.particleThree,
            {
              opacity: particleThreeOpacity,
              transform: [{ translateY: particleThreeTranslateY }],
            },
          ]}
        />

        <View
          style={[
            styles.content,
            {
              paddingHorizontal: isTablet ? 48 : 24,
            },
          ]}
        >
          <View
            style={[
              styles.illustrationArea,
              {
                width: illustrationSize * 1.55,
                height: illustrationSize * 1.55,
                marginBottom: isCompact ? 30 : height * 0.045,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.pulseCircle,
                {
                  width: illustrationSize * 1.15,
                  height: illustrationSize * 1.15,
                  borderRadius: illustrationSize,
                  opacity: pulseOpacity,
                  transform: [{ scale: pulseScale }],
                },
              ]}
            />

            <View
              style={[
                styles.softCircle,
                {
                  width: illustrationSize * 1.08,
                  height: illustrationSize * 1.08,
                  borderRadius: illustrationSize,
                },
              ]}
            />

            <Animated.View
              style={[
                styles.illustrationContainer,
                {
                  width: illustrationSize,
                  height: illustrationSize,
                  opacity: illustrationOpacity,
                  transform: [
                    { translateY: illustrationTranslateY },
                    { translateY: floatingTranslateY },
                    { scale: illustrationScale },
                  ],
                },
              ]}
            >
              <Image
                source={require("../assets/images/resq-dog.png")}
                resizeMode="contain"
                style={styles.illustration}
              />
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.brandContainer,
              {
                opacity: brandOpacity,
                transform: [
                  { translateY: brandTranslateY },
                  { scale: brandScale },
                ],
              },
            ]}
          >
            <View style={styles.brandRow}>
              <View
                style={[
                  styles.pawContainer,
                  {
                    width: brandFontSize * 0.9,
                    height: brandFontSize * 0.9,
                    borderRadius: brandFontSize * 0.3,
                  },
                ]}
              >
                <Ionicons
                  name="paw"
                  size={brandFontSize * 0.58}
                  color="#222222"
                />
              </View>
              <AppText
                style={[
                  styles.brandAccent,
                  {
                    fontSize: brandFontSize,
                    lineHeight: brandFontSize * 1.2,
                  },
                ]}
              >
                Q
              </AppText>
              <View style={styles.brandNameRow}>
                <AppText
                  style={[
                    styles.brandText,
                    {
                      fontSize: brandFontSize,
                      lineHeight: brandFontSize * 1.2,
                    },
                  ]}
                >
                  Res
                </AppText>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.subtitleContainer,
              {
                opacity: subtitleOpacity,
                transform: [{ translateY: subtitleTranslateY }],
              },
            ]}
          >
            <AppText
              style={[
                styles.subtitle,
                {
                  fontSize: subtitleFontSize,
                  lineHeight: subtitleFontSize * 1.65,
                },
              ]}
            >
              لأن كل حياة تستحق فرصة.
            </AppText>

            <View style={styles.subtitleDecoration}>
              <View style={styles.decorationDot} />
              <View style={styles.decorationLine} />
              <View style={styles.decorationDot} />
            </View>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.loaderSection,
            {
              width: loaderWidth,
              bottom: isCompact ? 22 : 38,
              opacity: loaderOpacity,
            },
          ]}
        >
          <View style={styles.loaderTrack}>
            <Animated.View
              style={[
                styles.loaderFill,
                {
                  width: progressWidth,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.loaderGlow,
                  {
                    opacity: progressGlowOpacity,
                  },
                ]}
              />
            </Animated.View>
          </View>

          <AppText style={styles.loadingText}>جاري التحضير...</AppText>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFE",
  },
  screen: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#FAFAFE",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  leftGlow: {
    position: "absolute",
    backgroundColor: "#FF7946",
    opacity: 0.12,
    shadowColor: "#FF6F3C",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 45,
    elevation: 2,
  },
  topGlow: {
    position: "absolute",
    backgroundColor: "#FFD9CA",
    opacity: 0.18,
  },
  particle: {
    position: "absolute",
    backgroundColor: "#FF7946",
  },
  particleOne: {
    width: 7,
    height: 7,
    borderRadius: 4,
    top: "23%",
    right: "20%",
  },
  particleTwo: {
    width: 5,
    height: 5,
    borderRadius: 3,
    top: "34%",
    left: "18%",
  },
  particleThree: {
    width: 6,
    height: 6,
    borderRadius: 3,
    top: "46%",
    right: "13%",
  },
  illustrationArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulseCircle: {
    position: "absolute",
    backgroundColor: "#FF8050",
  },
  softCircle: {
    position: "absolute",
    backgroundColor: "#FFF0E9",
    borderWidth: 1,
    borderColor: "#FFE1D4",
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  brandContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  pawContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1EB",
    borderWidth: 1,
    borderColor: "#FFE0D3",
  },
  brandNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    fontFamily: FONTS.bold,
    color: "#222222",
    textAlign: "center",
    includeFontPadding: false,
  },
  brandAccent: {
    fontFamily: FONTS.bold,
    color: "#FF7442",
    textAlign: "center",
    includeFontPadding: false,
  },
  subtitleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    color: "#62524B",
    textAlign: "center",
  },
  subtitleDecoration: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 5,
  },
  decorationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FF8253",
  },
  decorationLine: {
    width: 25,
    height: 2,
    borderRadius: 1,
    backgroundColor: "#FFD5C5",
  },
  loaderSection: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
  },
  loaderTrack: {
    width: "100%",
    height: 5,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "#EBEBEF",
  },
  loaderFill: {
    height: "100%",
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "#FF7442",
  },
  loaderGlow: {
    position: "absolute",
    width: 28,
    height: "100%",
    right: 0,
    borderRadius: 999,
    backgroundColor: "#FFB08C",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: "#9B918C",
    textAlign: "center",
  },
});
