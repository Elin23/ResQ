import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
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

type NavigationPath = "/choose-account" | "/login" | "/(tabs)";

export default function WelcomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.72)).current;
  const logoTranslateY = useRef(new Animated.Value(-18)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const sloganTranslateY = useRef(new Animated.Value(12)).current;

  const panelOpacity = useRef(new Animated.Value(0)).current;
  const panelTranslateY = useRef(new Animated.Value(90)).current;
  const panelScale = useRef(new Animated.Value(0.96)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(22)).current;

  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const descriptionTranslateY = useRef(new Animated.Value(18)).current;

  const createButtonOpacity = useRef(new Animated.Value(0)).current;
  const createButtonTranslateY = useRef(new Animated.Value(24)).current;

  const loginButtonOpacity = useRef(new Animated.Value(0)).current;
  const loginButtonTranslateY = useRef(new Animated.Value(24)).current;

  const guestOpacity = useRef(new Animated.Value(0)).current;
  const guestTranslateY = useRef(new Animated.Value(18)).current;

  const termsOpacity = useRef(new Animated.Value(0)).current;

  const glowScale = useRef(new Animated.Value(0.9)).current;
  const glowOpacity = useRef(new Animated.Value(0.12)).current;

  const shimmerTranslateX = useRef(new Animated.Value(-180)).current;

  const isCompact = height < 720;
  const isTablet = width >= 600;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.16, 110)
    : Math.max(24, width * 0.065);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const illustrationSize = isTablet
    ? 185
    : Math.min(width * 0.34, isCompact ? 118 : 150);

  const panelTopMargin = isCompact ? 20 : 34;

  const titleSize = isTablet ? 34 : Math.max(27, Math.min(width * 0.072, 31));

  const descriptionSize = isTablet
    ? 18
    : Math.max(14, Math.min(width * 0.04, 16));

  const buttonHeight = isTablet ? 64 : isCompact ? 56 : 62;

  useEffect(() => {
    const logoFloatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -7,
          duration: 1700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
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
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.2,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 0.9,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.12,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(1500),
        Animated.timing(shimmerTranslateX, {
          toValue: 420,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerTranslateX, {
          toValue: -180,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.delay(1700),
      ]),
    );

    Animated.timing(screenOpacity, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 55,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(sloganOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sloganTranslateY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(panelOpacity, {
          toValue: 1,
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(panelTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 48,
          useNativeDriver: true,
        }),
        Animated.spring(panelScale, {
          toValue: 1,
          friction: 8,
          tension: 55,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(90, [
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(titleTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(descriptionOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(descriptionTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(createButtonOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(createButtonTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(loginButtonOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(loginButtonTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(guestOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(guestTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(termsOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      logoFloatingAnimation.start();
      glowAnimation.start();
      shimmerAnimation.start();
    });

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      logoFloatingAnimation.stop();
      glowAnimation.stop();
      shimmerAnimation.stop();

      screenOpacity.stopAnimation();
      logoOpacity.stopAnimation();
      logoScale.stopAnimation();
      logoTranslateY.stopAnimation();
      logoFloat.stopAnimation();
      sloganOpacity.stopAnimation();
      sloganTranslateY.stopAnimation();
      panelOpacity.stopAnimation();
      panelTranslateY.stopAnimation();
      panelScale.stopAnimation();
      titleOpacity.stopAnimation();
      titleTranslateY.stopAnimation();
      descriptionOpacity.stopAnimation();
      descriptionTranslateY.stopAnimation();
      createButtonOpacity.stopAnimation();
      createButtonTranslateY.stopAnimation();
      loginButtonOpacity.stopAnimation();
      loginButtonTranslateY.stopAnimation();
      guestOpacity.stopAnimation();
      guestTranslateY.stopAnimation();
      termsOpacity.stopAnimation();
      glowScale.stopAnimation();
      glowOpacity.stopAnimation();
      shimmerTranslateX.stopAnimation();
    };
  }, [
    createButtonOpacity,
    createButtonTranslateY,
    descriptionOpacity,
    descriptionTranslateY,
    glowOpacity,
    glowScale,
    guestOpacity,
    guestTranslateY,
    loginButtonOpacity,
    loginButtonTranslateY,
    logoFloat,
    logoOpacity,
    logoScale,
    logoTranslateY,
    panelOpacity,
    panelScale,
    panelTranslateY,
    screenOpacity,
    shimmerTranslateX,
    sloganOpacity,
    sloganTranslateY,
    termsOpacity,
    titleOpacity,
    titleTranslateY,
  ]);

  const navigateWithFade = (path: NavigationPath) => {
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 220,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    navigationTimer.current = setTimeout(() => {
      router.push(path as never);
    }, 220);
  };

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
        <Animated.View
          pointerEvents="none"
          style={[
            styles.topGlow,
            {
              width: width * 1.05,
              height: width * 1.05,
              borderRadius: width,
              top: -width * 0.56,
              left: -width * 0.03,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.sideGlow,
            {
              width: width * 0.75,
              height: width * 0.75,
              borderRadius: width,
              right: -width * 0.58,
              top: height * 0.15,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              minHeight: height,
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View
            style={[
              styles.heroSection,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: isCompact ? 24 : 42,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  width: illustrationSize * 1.35,
                  height: illustrationSize * 1.35,
                  opacity: logoOpacity,
                  transform: [
                    { translateY: logoTranslateY },
                    { translateY: logoFloat },
                    { scale: logoScale },
                  ],
                },
              ]}
            >
              <View
                style={[
                  styles.logoHalo,
                  {
                    width: illustrationSize * 1.18,
                    height: illustrationSize * 1.18,
                    borderRadius: illustrationSize,
                  },
                ]}
              />

              <Image
                source={require("../assets/images/resq-dog.png")}
                resizeMode="contain"
                style={[
                  styles.logoImage,
                  {
                    width: illustrationSize,
                    height: illustrationSize,
                  },
                ]}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.sloganRow,
                {
                  opacity: sloganOpacity,
                  transform: [{ translateY: sloganTranslateY }],
                },
              ]}
            >
              <Ionicons name="heart-half-outline" size={19} color="#B95415" />

              <AppText style={styles.slogan}>معاً لانقاذ الارواح</AppText>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.panel,
              {
                width: "100%",
                marginTop: panelTopMargin,
                paddingHorizontal: horizontalPadding,
                paddingTop: isCompact ? 34 : 42,
                paddingBottom: isCompact ? 24 : 34,
                opacity: panelOpacity,
                transform: [
                  { translateY: panelTranslateY },
                  { scale: panelScale },
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.titleContainer,
                {
                  opacity: titleOpacity,
                  transform: [{ translateY: titleTranslateY }],
                },
              ]}
            >
              <View style={styles.titleRow}>
                <View style={styles.brandRow}>
                  <Ionicons
                    name="paw"
                    size={titleSize * 0.68}
                    color="#222222"
                  />

                  <View style={styles.brandNameRow}>
                    <AppText
                      style={[
                        styles.brandAccent,
                        {
                          fontSize: titleSize,
                          lineHeight: titleSize * 1.35,
                        },
                      ]}
                    >
                      Q
                    </AppText>

                    <AppText
                      style={[
                        styles.brandText,
                        {
                          fontSize: titleSize,
                          lineHeight: titleSize * 1.35,
                        },
                      ]}
                    >
                      Res
                    </AppText>
                  </View>
                </View>

                <AppText
                  style={[
                    styles.welcomeTitle,
                    {
                      fontSize: titleSize,
                      lineHeight: titleSize * 1.4,
                    },
                  ]}
                >
                  مرحباً بك في
                </AppText>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.descriptionContainer,
                {
                  width: contentWidth,
                  opacity: descriptionOpacity,
                  transform: [{ translateY: descriptionTranslateY }],
                },
              ]}
            >
              <AppText
                style={[
                  styles.description,
                  {
                    fontSize: descriptionSize,
                    lineHeight: descriptionSize * 1.8,
                  },
                ]}
              >
                ساهم في إنقاذ الحيوانات، تابع البلاغات، وانضم إلى مجتمع يهتم
                بالحياة.
              </AppText>
            </Animated.View>

            <View
              style={[
                styles.actions,
                {
                  width: contentWidth,
                  marginTop: isCompact ? 38 : 66,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.fullWidth,
                  {
                    opacity: createButtonOpacity,
                    transform: [{ translateY: createButtonTranslateY }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.primaryButtonWrapper,
                    {
                      height: buttonHeight,
                    },
                  ]}
                >
                  <Button
                    title="إنشاء حساب"
                    onPress={() => navigateWithFade("/choose-account")}
                    variant="custom"
                    size="large"
                    icon="person-add-outline"
                    iconPosition="end"
                    iconSize={23}
                    disabled={isNavigating}
                    fullWidth
                    backgroundColor="#FF8849"
                    borderColor="#FF8849"
                    borderWidth={0}
                    textColor="#5F2B12"
                    radius={17}
                    style={[
                      styles.primaryButton,
                      {
                        height: buttonHeight,
                        minHeight: buttonHeight,
                      },
                    ]}
                    textStyle={styles.primaryButtonText}
                  />

                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.buttonShimmer,
                      {
                        transform: [
                          { translateX: shimmerTranslateX },
                          { rotate: "18deg" },
                        ],
                      },
                    ]}
                  />
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.fullWidth,
                  {
                    opacity: loginButtonOpacity,
                    transform: [{ translateY: loginButtonTranslateY }],
                  },
                ]}
              >
                <Button
                  title="تسجيل الدخول"
                  onPress={() => navigateWithFade("/login")}
                  variant="custom"
                  size="large"
                  icon="log-in-outline"
                  iconPosition="end"
                  iconSize={23}
                  disabled={isNavigating}
                  fullWidth
                  backgroundColor="#FAFAFE"
                  borderColor="#FFD0BA"
                  borderWidth={1.5}
                  textColor="#FF7945"
                  radius={17}
                  style={[
                    styles.secondaryButton,
                    {
                      height: buttonHeight,
                      minHeight: buttonHeight,
                    },
                  ]}
                  textStyle={styles.secondaryButtonText}
                />
              </Animated.View>

              <Animated.View
                style={[
                  styles.guestContainer,
                  {
                    opacity: guestOpacity,
                    transform: [{ translateY: guestTranslateY }],
                  },
                ]}
              >
                <Button
                  title="المتابعة كزائر"
                  onPress={() => navigateWithFade("/(tabs)")}
                  variant="text"
                  size="small"
                  icon="arrow-forward-outline"
                  iconPosition="end"
                  iconSize={18}
                  disabled={isNavigating}
                  fullWidth={false}
                  textColor="#554842"
                  radius={14}
                  style={styles.guestButton}
                  textStyle={styles.guestText}
                />
              </Animated.View>
            </View>

            <Animated.View
              style={[
                styles.termsContainer,
                {
                  width: contentWidth,
                  opacity: termsOpacity,
                },
              ]}
            >
              <AppText style={styles.termsText}>
                باستمرارك فإنك توافق على
              </AppText>

              <Pressable
                accessibilityRole="link"
                accessibilityLabel="عرض الشروط"
                onPress={() => router.push("/terms-and-conditions" as never)}
                style={({ pressed, hovered }) => [
                  styles.inlineLink,
                  hovered && styles.inlineLinkHovered,
                  pressed && styles.inlineLinkPressed,
                ]}
              >
                <AppText style={styles.termsLink}>الشروط</AppText>
              </Pressable>

              <AppText style={styles.termsText}>و</AppText>

              <Pressable
                accessibilityRole="link"
                accessibilityLabel="عرض سياسة الخصوصية"
                onPress={() => router.push("/privacy-policy" as never)}
                style={({ pressed, hovered }) => [
                  styles.inlineLink,
                  hovered && styles.inlineLinkHovered,
                  pressed && styles.inlineLinkPressed,
                ]}
              >
                <AppText style={styles.termsLink}>سياسة الخصوصية</AppText>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF9F6",
  },
  screen: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#FFF9F6",
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
  },
  topGlow: {
    position: "absolute",
    backgroundColor: "#FFB38D",
  },
  sideGlow: {
    position: "absolute",
    backgroundColor: "#FF8A52",
  },
  heroSection: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoHalo: {
    position: "absolute",
    backgroundColor: "#FFF0E8",
    borderWidth: 1,
    borderColor: "#FFE3D6",
    shadowColor: "#D77844",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
  logoImage: {
    zIndex: 2,
  },
  sloganRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 8,
  },
  slogan: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    lineHeight: 24,
    color: "#B35418",
    textAlign: "center",
  },
  panel: {
    flex: 1,
    minHeight: 500,
    alignItems: "center",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    backgroundColor: "#FAFAFE",
    borderTopWidth: 1,
    borderColor: "#F4E8E1",
    shadowColor: "#7D5540",
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
  },
  titleRow: {
    direction: "ltr",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  welcomeTitle: {
    fontFamily: FONTS.bold,
    color: "#252525",
    textAlign: "center",
    writingDirection: "rtl",
  },
  brandRow: {
    direction: "ltr",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  brandNameRow: {
    direction: "ltr",
    flexDirection: "row-reverse",
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
    color: "#FF7E47",
    textAlign: "center",
    includeFontPadding: false,
  },
  descriptionContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  description: {
    fontFamily: FONTS.regular,
    color: "#675A54",
    textAlign: "center",
  },
  actions: {
    alignItems: "center",
    gap: 16,
  },
  fullWidth: {
    width: "100%",
  },
  primaryButtonWrapper: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: 17,
    shadowColor: "#E66F30",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.23,
    shadowRadius: 14,
    elevation: 7,
  },
  primaryButton: {
    direction: "ltr",
    width: "100%",
    paddingVertical: 0,
  },
  buttonShimmer: {
    position: "absolute",
    top: "-45%",
    width: 70,
    height: "190%",
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  secondaryButton: {
    direction: "ltr",
    width: "100%",
    paddingVertical: 0,
  },
  primaryButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 17,
    color: "#5F2B12",
    textAlign: "center",
  },
  secondaryButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 17,
    color: "#FF7945",
    textAlign: "center",
  },
  guestContainer: {
    alignItems: "center",
    marginTop: 4,
  },
  guestButton: {
    direction: "ltr",
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  guestText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: "#554842",
    textAlign: "center",
  },
  termsContainer: {
    marginTop: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 4,
    rowGap: 2,
  },
  termsText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 19,
    color: "#958882",
    textAlign: "center",
  },
  termsLink: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    lineHeight: 19,
    color: "#A94D17",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  inlineLink: {
    borderRadius: 5,
  },
  inlineLinkHovered: {
    backgroundColor: "#FFF0E8",
  },
  inlineLinkPressed: {
    opacity: 0.55,
  },
});
