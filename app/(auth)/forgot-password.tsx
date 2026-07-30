<<<<<<< HEAD
export { default } from "@/src/features/auth/screens/ForgotPasswordScreen";
=======
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/AppText";
import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { FONTS } from "@/src/constants/theme";

type FormErrors = {
  phone?: string;
  general?: string;
};

const SYRIAN_PHONE_PATTERN = /^9\d{8}$/;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(18)).current;

  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const illustrationScale = useRef(new Animated.Value(0.78)).current;
  const illustrationTranslateY = useRef(new Animated.Value(20)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(18)).current;

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(24)).current;

  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(18)).current;

  const lockFloat = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.9)).current;
  const glowOpacity = useRef(new Animated.Value(0.09)).current;

  const isTablet = width >= 600;
  const isCompact = height < 720;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.16, 120)
    : Math.max(24, width * 0.07);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const titleSize = isTablet ? 36 : Math.max(28, Math.min(width * 0.075, 32));

  const descriptionSize = isTablet
    ? 18
    : Math.max(14, Math.min(width * 0.04, 16));

  const illustrationSize = isTablet
    ? 190
    : Math.min(width * 0.46, isCompact ? 145 : 175);

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
      Animated.stagger(90, [
        Animated.parallel([
          Animated.timing(illustrationOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(illustrationScale, {
            toValue: 1,
            friction: 7,
            tension: 50,
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
          Animated.timing(formOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(formTranslateY, {
            toValue: 0,
            duration: 460,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(footerOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(footerTranslateY, {
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
        Animated.timing(lockFloat, {
          toValue: -7,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(lockFloat, {
          toValue: 0,
          duration: 1600,
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
            toValue: 0.16,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 0.9,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.09,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    entranceAnimation.start(() => {
      floatingAnimation.start();
    });

    glowAnimation.start();

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      entranceAnimation.stop();
      floatingAnimation.stop();
      glowAnimation.stop();

      screenOpacity.stopAnimation();
      screenTranslateY.stopAnimation();
      illustrationOpacity.stopAnimation();
      illustrationScale.stopAnimation();
      illustrationTranslateY.stopAnimation();
      titleOpacity.stopAnimation();
      titleTranslateY.stopAnimation();
      formOpacity.stopAnimation();
      formTranslateY.stopAnimation();
      footerOpacity.stopAnimation();
      footerTranslateY.stopAnimation();
      lockFloat.stopAnimation();
      glowScale.stopAnimation();
      glowOpacity.stopAnimation();
    };
  }, [
    footerOpacity,
    footerTranslateY,
    formOpacity,
    formTranslateY,
    glowOpacity,
    glowScale,
    illustrationOpacity,
    illustrationScale,
    illustrationTranslateY,
    lockFloat,
    screenOpacity,
    screenTranslateY,
    titleOpacity,
    titleTranslateY,
  ]);

  const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.startsWith("09")) {
      return digits.slice(1);
    }

    return digits;
  };

  const validatePhone = (value: string) => {
    const normalizedPhone = normalizePhone(value);

    if (!normalizedPhone) {
      return "يرجى إدخال رقم الهاتف";
    }

    if (!/^9\d{8}$/.test(normalizedPhone)) {
      return "يرجى إدخال رقم هاتف صحيح مثل 09XXXXXXXX";
    }

    return undefined;
  };

  const handlePhoneChange = (value: string) => {
    const normalizedPhone = normalizePhone(value);

    setPhone(normalizedPhone);

    if (errors.phone || errors.general) {
      setErrors((current) => ({
        ...current,
        phone: undefined,
        general: undefined,
      }));
    }
  };

  const handlePhoneBlur = () => {
    if (!phone) {
      return;
    }

    setErrors((current) => ({
      ...current,
      phone: validatePhone(phone),
    }));
  };

  const handleBack = () => {
    if (isSubmitting || isNavigating) {
      return;
    }

    Keyboard.dismiss();

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/login" as never);
  };

  const navigateToLogin = () => {
    if (isSubmitting || isNavigating) {
      return;
    }

    Keyboard.dismiss();
    setIsNavigating(true);

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    navigationTimer.current = setTimeout(() => {
      router.replace("/login" as never);
    }, 200);
  };

  const handleSendCode = () => {
    if (isNavigating) {
      return;
    }

    const phoneError = validatePhone(phone);

    if (phoneError) {
      setErrors({
        phone: phoneError,
      });
      return;
    }

    Keyboard.dismiss();
    setErrors({});
    setIsNavigating(true);

    const normalizedPhone = normalizePhone(phone);

    router.push({
      pathname: "/verify-reset-code",
      params: {
        phone: `+963${normalizedPhone}`,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
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
                disabled={isSubmitting || isNavigating}
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
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={[
                styles.scrollContent,
                {
                  paddingHorizontal: horizontalPadding,
                  paddingTop: isCompact ? 4 : 14,
                  paddingBottom: isCompact ? 24 : 34,
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
                        { translateY: lockFloat },
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
                      styles.lockShackle,
                      {
                        width: illustrationSize * 0.44,
                        height: illustrationSize * 0.45,
                        borderRadius: illustrationSize * 0.22,
                        borderWidth: Math.max(8, illustrationSize * 0.06),
                        top: illustrationSize * 0.13,
                      },
                    ]}
                  />

                  <View
                    style={[
                      styles.lockBody,
                      {
                        width: illustrationSize * 0.62,
                        height: illustrationSize * 0.48,
                        borderRadius: illustrationSize * 0.1,
                        bottom: illustrationSize * 0.14,
                      },
                    ]}
                  >
                    <View style={styles.keyholeCircle} />

                    <View style={styles.keyholeStem} />
                  </View>

                  <View
                    style={[
                      styles.passwordBadge,
                      {
                        left: illustrationSize * 0.02,
                        bottom: illustrationSize * 0.08,
                      },
                    ]}
                  >
                    <AppText style={styles.passwordStars}>* * * *</AppText>
                  </View>

                  <View
                    style={[
                      styles.refreshBadge,
                      {
                        right: illustrationSize * 0.01,
                        bottom: illustrationSize * 0.03,
                      },
                    ]}
                  >
                    <Ionicons
                      name="refresh-outline"
                      size={illustrationSize * 0.25}
                      color="#603117"
                    />
                  </View>

                  <View
                    style={[
                      styles.sparkleOne,
                      {
                        top: illustrationSize * 0.2,
                        right: illustrationSize * 0.02,
                      },
                    ]}
                  >
                    <Ionicons name="sparkles" size={18} color="#F2A13B" />
                  </View>

                  <View
                    style={[
                      styles.sparkleTwo,
                      {
                        top: illustrationSize * 0.34,
                        left: illustrationSize * 0.02,
                      },
                    ]}
                  >
                    <Ionicons name="star" size={13} color="#F2A13B" />
                  </View>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.header,
                    {
                      opacity: titleOpacity,
                      transform: [{ translateY: titleTranslateY }],
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.title,
                      {
                        fontSize: titleSize,
                        lineHeight: titleSize * 1.35,
                      },
                    ]}
                  >
                    نسيت كلمة المرور؟
                  </AppText>

                  <AppText
                    style={[
                      styles.description,
                      {
                        fontSize: descriptionSize,
                        lineHeight: descriptionSize * 1.75,
                      },
                    ]}
                  >
                    أدخل رقم هاتفك المسجل وسنرسل إليك رمز تحقق لإعادة تعيين كلمة
                    المرور.
                  </AppText>
                </Animated.View>

                <Animated.View
                  style={[
                    styles.form,
                    {
                      opacity: formOpacity,
                      transform: [{ translateY: formTranslateY }],
                    },
                  ]}
                >
                  <Input
                    label="رقم الهاتف"
                    required
                    value={phone}
                    onChangeText={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    onSubmitEditing={handleSendCode}
                    placeholder="9XX XXX XXX"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    returnKeyType="send"
                    icon="call-outline"
                    iconSize={22}
                    prefix="+963"
                    prefixWidth={88}
                    maxLength={9}
                    error={errors.phone}
                    disabled={isSubmitting || isNavigating}
                    containerStyle={styles.phoneInput}
                  />

                  {errors.general ? (
                    <View style={styles.generalError}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color="#B74424"
                      />

                      <AppText style={styles.generalErrorText}>
                        {errors.general}
                      </AppText>
                    </View>
                  ) : null}

                  <Button
                    title="إرسال رمز التحقق"
                    onPress={handleSendCode}
                    variant="custom"
                    size="large"
                    icon="send-outline"
                    iconPosition="end"
                    iconSize={22}
                    disabled={isNavigating}
                    fullWidth
                    backgroundColor="#FF8849"
                    borderColor="#FF8849"
                    borderWidth={0}
                    textColor="#603016"
                    radius={16}
                    style={[
                      styles.submitButton,
                      {
                        height: buttonHeight,
                        minHeight: buttonHeight,
                      },
                    ]}
                    textStyle={styles.submitButtonText}
                  />
                </Animated.View>

                <Animated.View
                  style={[
                    styles.footer,
                    {
                      opacity: footerOpacity,
                      transform: [{ translateY: footerTranslateY }],
                    },
                  ]}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="العودة إلى تسجيل الدخول"
                    disabled={isSubmitting || isNavigating}
                    onPress={navigateToLogin}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.loginLink,
                      pressed && styles.linkPressed,
                    ]}
                  >
                    <AppText style={styles.loginLinkText}>تسجيل الدخول</AppText>
                  </Pressable>
                  <AppText style={styles.footerText}>
                    تذكرت كلمة المرور؟
                  </AppText>
                </Animated.View>
              </View>
            </ScrollView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBFAFE",
  },
  keyboardView: {
    flex: 1,
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
    marginBottom: 22,
  },
  illustrationHalo: {
    position: "absolute",
    backgroundColor: "#FFF7F0",
  },
  lockShackle: {
    position: "absolute",
    borderColor: "#F2A23C",
    backgroundColor: "transparent",
  },
  lockBody: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF8F1",
    borderWidth: 2,
    borderColor: "#6B3C20",
    shadowColor: "#9D6136",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  keyholeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#6B4329",
  },
  keyholeStem: {
    width: 8,
    height: 25,
    marginTop: -3,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: "#6B4329",
  },
  passwordBadge: {
    position: "absolute",
    minWidth: 92,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#FFF9F4",
    borderWidth: 2,
    borderColor: "#6D3D20",
    paddingHorizontal: 12,
  },
  passwordStars: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: "#EE9A31",
    letterSpacing: 1,
    textAlign: "center",
  },
  refreshBadge: {
    position: "absolute",
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: "#FFAA3F",
    borderWidth: 2,
    borderColor: "#6A391C",
  },
  sparkleOne: {
    position: "absolute",
  },
  sparkleTwo: {
    position: "absolute",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 26,
  },
  title: {
    fontFamily: FONTS.bold,
    color: "#232323",
    textAlign: "center",
  },
  description: {
    maxWidth: 390,
    marginTop: 7,
    fontFamily: FONTS.regular,
    color: "#72645D",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  phoneInput: {
    marginBottom: 6,
  },
  generalError: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: "#FFF0EA",
    borderWidth: 1,
    borderColor: "#F3C5B5",
  },
  generalErrorText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 20,
    color: "#9D3A20",
    textAlign: "right",
  },
  submitButton: {
    direction: "ltr",
    width: "100%",
    marginTop: 6,
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
  submitButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: "#603016",
    textAlign: "center",
  },
  footer: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 72,
    paddingBottom: 4,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#71645E",
    textAlign: "center",
  },
  loginLink: {
    minHeight: 34,
    justifyContent: "center",
    borderRadius: 7,
  },
  loginLinkText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#A94D17",
    textAlign: "center",
  },
  linkPressed: {
    opacity: 0.55,
    transform: [{ scale: 0.96 }],
  },
});
>>>>>>> 5f4a354c8632b09b2c8785d2eebd30ffed989cf6
