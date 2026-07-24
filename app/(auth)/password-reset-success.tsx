import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/AppText";
import Button from "@/src/components/Button";
import { FONTS } from "@/src/constants/theme";

type NavigationPath = "/login" | "/welcome";

export default function PasswordResetSuccessScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(18)).current;

  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const illustrationScale = useRef(new Animated.Value(0.78)).current;
  const illustrationTranslateY = useRef(new Animated.Value(22)).current;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(18)).current;

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(22)).current;

  const actionsOpacity = useRef(new Animated.Value(0)).current;
  const actionsTranslateY = useRef(new Animated.Value(20)).current;

  const shieldFloat = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.92)).current;
  const glowOpacity = useRef(new Animated.Value(0.08)).current;
  const successScale = useRef(new Animated.Value(0.82)).current;

  const isTablet = width >= 600;
  const isCompact = height < 720;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.16, 120)
    : Math.max(24, width * 0.065);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const titleSize = isTablet ? 36 : Math.max(27, Math.min(width * 0.073, 32));

  const descriptionSize = isTablet
    ? 18
    : Math.max(14, Math.min(width * 0.04, 16));

  const illustrationSize = isTablet
    ? 210
    : Math.min(width * 0.52, isCompact ? 160 : 190);

  const buttonHeight = isTablet ? 64 : 58;

  useEffect(() => {
    const entranceAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(screenOpacity, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(screenTranslateY, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(100, [
        Animated.parallel([
          Animated.timing(illustrationOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(illustrationScale, {
            toValue: 1,
            friction: 7,
            tension: 52,
            useNativeDriver: true,
          }),
          Animated.timing(illustrationTranslateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(headerOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 460,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(cardTranslateY, {
            toValue: 0,
            duration: 460,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(actionsOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(actionsTranslateY, {
            toValue: 0,
            duration: 460,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]);

    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shieldFloat, {
          toValue: -7,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shieldFloat, {
          toValue: 0,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1.08,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.15,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 0.92,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.08,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    const successPulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(successScale, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(successScale, {
          toValue: 0.82,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    entranceAnimation.start(() => {
      floatingAnimation.start();
      successPulseAnimation.start();
    });

    glowAnimation.start();

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      entranceAnimation.stop();
      floatingAnimation.stop();
      glowAnimation.stop();
      successPulseAnimation.stop();

      screenOpacity.stopAnimation();
      screenTranslateY.stopAnimation();
      illustrationOpacity.stopAnimation();
      illustrationScale.stopAnimation();
      illustrationTranslateY.stopAnimation();
      headerOpacity.stopAnimation();
      headerTranslateY.stopAnimation();
      cardOpacity.stopAnimation();
      cardTranslateY.stopAnimation();
      actionsOpacity.stopAnimation();
      actionsTranslateY.stopAnimation();
      shieldFloat.stopAnimation();
      glowScale.stopAnimation();
      glowOpacity.stopAnimation();
      successScale.stopAnimation();
    };
  }, [
    actionsOpacity,
    actionsTranslateY,
    cardOpacity,
    cardTranslateY,
    glowOpacity,
    glowScale,
    headerOpacity,
    headerTranslateY,
    illustrationOpacity,
    illustrationScale,
    illustrationTranslateY,
    screenOpacity,
    screenTranslateY,
    shieldFloat,
    successScale,
  ]);

  const navigateWithFade = (path: NavigationPath) => {
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    navigationTimer.current = setTimeout(() => {
      router.replace(path as never);
    }, 200);
  };

  const handleBack = () => {
    if (isNavigating) {
      return;
    }

    navigateWithFade("/login");
  };

  const handleLogin = () => {
    navigateWithFade("/login");
  };

  const handleHome = () => {
    navigateWithFade("/welcome");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <Animated.View
        style={[
          styles.screen,
          {
            opacity: screenOpacity,
            transform: [{ translateY: screenTranslateY }],
          },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.topGlow,
            {
              width: width * 1.08,
              height: width * 1.08,
              borderRadius: width,
              top: -width * 0.78,
              right: -width * 0.3,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.bottomGlow,
            {
              width: width * 1.18,
              height: width * 1.18,
              borderRadius: width,
              bottom: -width * 0.88,
              left: -width * 0.4,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <View
          style={[
            styles.topBar,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="العودة إلى تسجيل الدخول"
            disabled={isNavigating}
            hitSlop={10}
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="arrow-back-outline" size={25} color="#332D2A" />
          </Pressable>

          <View style={styles.topBarSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
              paddingTop: isCompact ? 4 : 12,
              paddingBottom: isCompact ? 24 : 36,
            },
          ]}
        >
          <View
            style={[
              styles.content,
              {
                width: contentWidth,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.illustrationContainer,
                {
                  width: illustrationSize,
                  height: illustrationSize,
                  opacity: illustrationOpacity,
                  transform: [
                    { translateY: illustrationTranslateY },
                    { translateY: shieldFloat },
                    { scale: illustrationScale },
                  ],
                },
              ]}
            >
              <View
                style={[
                  styles.illustrationHalo,
                  {
                    width: illustrationSize,
                    height: illustrationSize,
                    borderRadius: illustrationSize / 2,
                  },
                ]}
              />

              <View
                style={[
                  styles.shield,
                  {
                    width: illustrationSize * 0.62,
                    height: illustrationSize * 0.72,
                    borderTopLeftRadius: illustrationSize * 0.28,
                    borderTopRightRadius: illustrationSize * 0.28,
                    borderBottomLeftRadius: illustrationSize * 0.32,
                    borderBottomRightRadius: illustrationSize * 0.32,
                  },
                ]}
              >
                <View style={styles.shieldLeft} />

                <View style={styles.shieldRight} />

                <View style={styles.shieldInner}>
                  <Animated.View
                    style={[
                      styles.successCircle,
                      {
                        transform: [{ scale: successScale }],
                      },
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={illustrationSize * 0.3}
                      color="#247C3E"
                    />
                  </Animated.View>
                </View>
              </View>

              <View
                style={[
                  styles.lockBadge,
                  {
                    right: illustrationSize * 0.06,
                    top: illustrationSize * 0.17,
                  },
                ]}
              >
                <View style={styles.lockShackle} />

                <View style={styles.lockBody}>
                  <Ionicons name="key-outline" size={18} color="#6B371A" />
                </View>
              </View>

              <View style={styles.sparkleOne}>
                <Ionicons name="sparkles" size={18} color="#F0A13C" />
              </View>

              <View style={styles.sparkleTwo}>
                <Ionicons name="star" size={11} color="#F0A13C" />
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.header,
                {
                  opacity: headerOpacity,
                  transform: [{ translateY: headerTranslateY }],
                },
              ]}
            >
              <AppText
                style={[
                  styles.title,
                  {
                    fontSize: titleSize,
                    lineHeight: titleSize * 1.4,
                  },
                ]}
              >
                تم تغيير كلمة المرور بنجاح
              </AppText>

              <AppText
                style={[
                  styles.description,
                  {
                    fontSize: descriptionSize,
                    lineHeight: descriptionSize * 1.8,
                  },
                ]}
              >
                تم تحديث كلمة مرور حسابك بنجاح. يمكنك الآن تسجيل الدخول باستخدام
                كلمة المرور الجديدة.
              </AppText>
            </Animated.View>

            <Animated.View
              style={[
                styles.statusCard,
                {
                  opacity: cardOpacity,
                  transform: [{ translateY: cardTranslateY }],
                },
              ]}
            >
              <View style={styles.statusRow}>
                <View style={styles.statusIcon}>
                  <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                </View>

                <AppText style={styles.statusText}>تم تأمين حسابك</AppText>
              </View>

              <View style={styles.statusDivider} />

              <View style={styles.statusRow}>
                <View style={styles.statusIcon}>
                  <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                </View>

                <AppText style={styles.statusText}>
                  يمكنك تسجيل الدخول الآن
                </AppText>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.actions,
                {
                  opacity: actionsOpacity,
                  transform: [{ translateY: actionsTranslateY }],
                },
              ]}
            >
              <Button
                title="الانتقال إلى تسجيل الدخول"
                onPress={handleLogin}
                variant="custom"
                size="large"
                icon="log-in-outline"
                iconPosition="end"
                iconSize={23}
                disabled={isNavigating}
                fullWidth
                backgroundColor="#FF8849"
                borderColor="#FF8849"
                borderWidth={0}
                textColor="#603016"
                radius={17}
                style={[
                  styles.loginButton,
                  {
                    height: buttonHeight,
                    minHeight: buttonHeight,
                  },
                ]}
                textStyle={styles.loginButtonText}
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="العودة إلى الصفحة الرئيسية"
                disabled={isNavigating}
                onPress={handleHome}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.homeButton,
                  pressed && styles.homeButtonPressed,
                ]}
              >
                <Ionicons name="home-outline" size={18} color="#A94D17" />

                <AppText style={styles.homeButtonText}>
                  العودة إلى الصفحة الرئيسية
                </AppText>
              </Pressable>
            </Animated.View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBFAFE",
  },
  screen: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#FBFAFE",
  },
  topGlow: {
    position: "absolute",
    backgroundColor: "#FFE1D2",
  },
  bottomGlow: {
    position: "absolute",
    backgroundColor: "#DDEFE2",
  },
  topBar: {
    width: "100%",
    minHeight: 58,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  topBarSpacer: {
    width: 46,
    height: 46,
  },
  backButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: "#EFEFF1",
  },
  backButtonPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.94 }],
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
  },
  content: {
    flexGrow: 1,
    alignSelf: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  illustrationContainer: {
    position: "relative",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  illustrationHalo: {
    position: "absolute",
    backgroundColor: "#FFF4EE",
  },
  shield: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#6D391B",
    backgroundColor: "#FFF6EF",
    shadowColor: "#8E5531",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 5,
  },
  shieldLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    backgroundColor: "#FFF8F4",
  },
  shieldRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    backgroundColor: "#FFF0E8",
  },
  shieldInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  successCircle: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 38,
    backgroundColor: "#B9E5B8",
    borderWidth: 2,
    borderColor: "#2A7E3E",
  },
  lockBadge: {
    position: "absolute",
    width: 55,
    height: 62,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  lockShackle: {
    position: "absolute",
    top: 0,
    width: 29,
    height: 31,
    borderWidth: 4,
    borderColor: "#6D391B",
    borderBottomWidth: 0,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "transparent",
  },
  lockBody: {
    width: 52,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: "#FFB557",
    borderWidth: 2,
    borderColor: "#6D391B",
  },
  sparkleOne: {
    position: "absolute",
    top: "16%",
    left: "10%",
  },
  sparkleTwo: {
    position: "absolute",
    right: "7%",
    bottom: "18%",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    maxWidth: 410,
    fontFamily: FONTS.bold,
    color: "#232323",
    textAlign: "center",
  },
  description: {
    maxWidth: 400,
    marginTop: 8,
    fontFamily: FONTS.regular,
    color: "#72645D",
    textAlign: "center",
  },
  statusCard: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8BEAA",
    shadowColor: "#79675E",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  statusRow: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  statusIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#07882C",
  },
  statusText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 15,
    lineHeight: 24,
    color: "#302925",
    textAlign: "left",
  },
  statusDivider: {
    width: "100%",
    height: 1,
    marginVertical: 14,
    backgroundColor: "#EEE8E5",
  },
  actions: {
    width: "100%",
    marginTop: 46,
    alignItems: "center",
  },
  loginButton: {
    direction: "ltr",
    width: "100%",
    paddingVertical: 0,
    shadowColor: "#E66F30",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.22,
    shadowRadius: 13,
    elevation: 7,
  },
  loginButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: "#603016",
    textAlign: "center",
  },
  homeButton: {
    minHeight: 44,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 18,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  homeButtonPressed: {
    opacity: 0.55,
    transform: [{ scale: 0.96 }],
  },
  homeButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#A94D17",
    textAlign: "center",
  },
});
