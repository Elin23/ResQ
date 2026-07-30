<<<<<<< HEAD
export { default } from "@/src/features/auth/screens/LoginScreen";
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
  email?: string;
  password?: string;
  general?: string;
};

type NavigationPath = "/forgot-password" | "/register" | "/(tabs)";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(18)).current;

  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(18)).current;

  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(24)).current;

  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(20)).current;

  const glowScale = useRef(new Animated.Value(0.92)).current;
  const glowOpacity = useRef(new Animated.Value(0.1)).current;

  const isTablet = width >= 600;
  const isCompact = height < 740;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.15, 120)
    : Math.max(20, width * 0.055);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const titleSize = isTablet ? 38 : Math.max(29, Math.min(width * 0.08, 34));

  const subtitleSize = isTablet ? 18 : Math.max(14, Math.min(width * 0.04, 16));

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
          Animated.timing(headerOpacity, {
            toValue: 1,
            duration: 420,
            useNativeDriver: true,
          }),
          Animated.timing(headerTranslateY, {
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
            toValue: 0.17,
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
            toValue: 0.1,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    entranceAnimation.start();
    glowAnimation.start();

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      entranceAnimation.stop();
      glowAnimation.stop();

      screenOpacity.stopAnimation();
      screenTranslateY.stopAnimation();
      headerOpacity.stopAnimation();
      headerTranslateY.stopAnimation();
      formOpacity.stopAnimation();
      formTranslateY.stopAnimation();
      footerOpacity.stopAnimation();
      footerTranslateY.stopAnimation();
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
    headerOpacity,
    headerTranslateY,
    screenOpacity,
    screenTranslateY,
  ]);

  const validateEmail = (value: string) => {
    const normalizedEmail = value.trim();

    if (!normalizedEmail) {
      return "يرجى إدخال البريد الإلكتروني";
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      return "يرجى إدخال بريد إلكتروني صحيح";
    }

    return undefined;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return "يرجى إدخال كلمة المرور";
    }

    if (value.length < 6) {
      return "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل";
    }

    return undefined;
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const navigateWithFade = (path: NavigationPath) => {
    if (isNavigating || isSubmitting) {
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
      router.push(path as never);
    }, 200);
  };

  const handleBack = () => {
    if (isNavigating || isSubmitting) {
      return;
    }

    Keyboard.dismiss();

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/welcome" as never);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (errors.email || errors.general) {
      setErrors((current) => ({
        ...current,
        email: undefined,
        general: undefined,
      }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (errors.password || errors.general) {
      setErrors((current) => ({
        ...current,
        password: undefined,
        general: undefined,
      }));
    }
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      return;
    }

    setErrors((current) => ({
      ...current,
      email: validateEmail(email),
    }));
  };

  const handlePasswordBlur = () => {
    if (!password) {
      return;
    }

    setErrors((current) => ({
      ...current,
      password: validatePassword(password),
    }));
  };

  const handleLogin = async () => {
    if (isSubmitting || isNavigating) {
      return;
    }

    Keyboard.dismiss();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await new Promise((resolve) => setTimeout(resolve, 900));

      router.replace("/(tabs)" as never);
    } catch {
      setErrors({
        general:
          "تعذر تسجيل الدخول. تحقق من بياناتك واتصالك بالإنترنت ثم حاول مجددًا.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  top: -width * 0.7,
                  right: -width * 0.26,
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
                  width: width * 1.12,
                  height: width * 1.12,
                  borderRadius: width,
                  bottom: -width * 0.82,
                  left: -width * 0.35,
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
                accessibilityLabel="العودة"
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
                  paddingTop: isCompact ? 10 : 24,
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
                        lineHeight: titleSize * 1.35,
                      },
                    ]}
                  >
                    تسجيل الدخول
                  </AppText>

                  <AppText
                    style={[
                      styles.subtitle,
                      {
                        fontSize: subtitleSize,
                        lineHeight: subtitleSize * 1.75,
                      },
                    ]}
                  >
                    مرحبًا بعودتك، أدخل بياناتك للمتابعة إلى حسابك.
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
                    label="البريد الإلكتروني"
                    required
                    value={email}
                    onChangeText={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder="example@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    returnKeyType="next"
                    icon="mail-outline"
                    iconSize={22}
                    error={errors.email}
                    disabled={isSubmitting || isNavigating}
                    containerStyle={styles.emailInput}
                  />

                  <Input
                    label="كلمة المرور"
                    required
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    onSubmitEditing={handleLogin}
                    placeholder="أدخل كلمة المرور"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    returnKeyType="done"
                    password
                    iconSize={22}
                    error={errors.password}
                    disabled={isSubmitting || isNavigating}
                    containerStyle={styles.passwordInput}
                  />

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="نسيت كلمة المرور"
                    disabled={isSubmitting || isNavigating}
                    onPress={() => navigateWithFade("/forgot-password")}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.forgotPasswordButton,
                      pressed && styles.linkPressed,
                    ]}
                  >
                    <AppText style={styles.forgotPasswordText}>
                      نسيت كلمة المرور؟
                    </AppText>
                  </Pressable>

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
                    title="تسجيل الدخول"
                    onPress={handleLogin}
                    variant="custom"
                    size="large"
                    icon="log-in-outline"
                    iconPosition="end"
                    iconSize={23}
                    loading={isSubmitting}
                    loadingText="جاري تسجيل الدخول..."
                    disabled={isNavigating}
                    fullWidth
                    backgroundColor="#FF8849"
                    borderColor="#FF8849"
                    borderWidth={0}
                    textColor="#5F2B12"
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
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />

                    <AppText style={styles.dividerText}>أو</AppText>

                    <View style={styles.dividerLine} />
                  </View>

                  <Button
                    title="المتابعة كزائر"
                    onPress={() => navigateWithFade("/(tabs)")}
                    variant="custom"
                    size="large"
                    icon="people-outline"
                    iconPosition="end"
                    iconSize={22}
                    disabled={isSubmitting || isNavigating}
                    fullWidth
                    backgroundColor="#FAFAFE"
                    borderColor="#2B8A4B"
                    borderWidth={1.5}
                    textColor="#24723E"
                    radius={17}
                    style={[
                      styles.guestButton,
                      {
                        height: buttonHeight,
                        minHeight: buttonHeight,
                      },
                    ]}
                    textStyle={styles.guestButtonText}
                  />

                  <View style={styles.registerRow}>
                    <AppText style={styles.registerPrompt}>
                      ليس لديك حساب؟
                    </AppText>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="إنشاء حساب جديد"
                      disabled={isSubmitting || isNavigating}
                      onPress={() => navigateWithFade("/register")}
                      hitSlop={8}
                      style={({ pressed }) => [
                        styles.registerButton,
                        pressed && styles.linkPressed,
                      ]}
                    >
                      <AppText style={styles.registerText}>إنشاء حساب</AppText>
                    </Pressable>
                  </View>
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
    backgroundColor: "#FFF9F6",
  },
  keyboardView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#FFF9F6",
  },
  topGlow: {
    position: "absolute",
    backgroundColor: "#FFB58E",
  },
  bottomGlow: {
    position: "absolute",
    backgroundColor: "#BDE5C9",
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
    justifyContent: "center",
  },
  content: {
    alignSelf: "center",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  iconHalo: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#FFF0E8",
    borderWidth: 1,
    borderColor: "#FFDCCC",
    shadowColor: "#D77844",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  title: {
    fontFamily: FONTS.bold,
    color: "#252525",
    textAlign: "center",
  },
  subtitle: {
    maxWidth: 360,
    marginTop: 6,
    fontFamily: FONTS.regular,
    color: "#6E615B",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  emailInput: {
    marginBottom: 10,
  },
  passwordInput: {
    marginBottom: 4,
  },
  forgotPasswordButton: {
    alignSelf: "flex-start",
    minHeight: 36,
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 8,
  },
  forgotPasswordText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#A94D17",
    textAlign: "right",
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
    fontSize: 17,
    color: "#5F2B12",
    textAlign: "center",
  },
  footer: {
    width: "100%",
  },
  divider: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
    marginVertical: 26,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#EADFD9",
  },
  dividerText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#A79891",
    textAlign: "center",
  },
  guestButton: {
    direction: "ltr",
    width: "100%",
    paddingVertical: 0,
  },
  guestButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: "#24723E",
    textAlign: "center",
  },
  registerRow: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 24,
    paddingBottom: 4,
  },
  registerPrompt: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#5F5550",
    textAlign: "center",
  },
  registerButton: {
    minHeight: 34,
    justifyContent: "center",
    borderRadius: 7,
  },
  registerText: {
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
