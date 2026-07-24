import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/AppText";
import Button from "@/src/components/Button";
import { FONTS } from "@/src/constants/theme";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 45;

type VerificationError = {
  code?: string;
  general?: string;
};

type VerificationStatus = "idle" | "verifying" | "success" | "error";

export default function VerifyResetCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phone?: string;
  }>();

  const { width, height } = useWindowDimensions();

  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<VerificationError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");

  const codeInputRef = useRef<TextInput>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verificationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeBoxScales = useRef(
    Array.from({ length: CODE_LENGTH }, () => new Animated.Value(1)),
  ).current;

  const screenOpacity = useRef(new Animated.Value(1)).current;

  const isTablet = width >= 600;
  const isCompact = height < 740;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.16, 120)
    : Math.max(24, width * 0.06);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const titleSize = isTablet ? 36 : Math.max(28, Math.min(width * 0.074, 32));

  const descriptionSize = isTablet
    ? 18
    : Math.max(14, Math.min(width * 0.04, 16));

  const illustrationSize = isTablet ? 190 : isCompact ? 145 : 172;
  const buttonHeight = isTablet ? 64 : 58;

  const codeGap = isTablet ? 12 : Math.max(7, Math.min(width * 0.022, 10));

  const codeBoxSize = Math.min(
    isTablet ? 66 : 58,
    (contentWidth - codeGap * (CODE_LENGTH - 1)) / CODE_LENGTH,
  );

  const normalizedPhone = useMemo(() => {
    const value = Array.isArray(params.phone) ? params.phone[0] : params.phone;

    return value || "+963 9XX XXX XXX";
  }, [params.phone]);

  const maskedPhone = useMemo(() => {
    const digits = normalizedPhone.replace(/\D/g, "");

    if (digits.length < 8) {
      return normalizedPhone;
    }

    const countryCode = digits.startsWith("963") ? "+963" : "";
    const localNumber = digits.startsWith("963") ? digits.slice(3) : digits;

    if (localNumber.length < 5) {
      return normalizedPhone;
    }

    const firstPart = localNumber.slice(0, 2);
    const lastPart = localNumber.slice(-2);

    return `${countryCode} ${firstPart} XXX XX${lastPart}`;
  }, [normalizedPhone]);

  useEffect(() => {
    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      if (verificationTimer.current) {
        clearTimeout(verificationTimer.current);
      }

      screenOpacity.stopAnimation();

      codeBoxScales.forEach((scale) => {
        scale.stopAnimation();
      });
    };
  }, [codeBoxScales, screenOpacity]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendSeconds((current) => {
        if (current <= 0) {
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(resendSeconds / 60);
    const seconds = resendSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, [resendSeconds]);

  const validateCode = (value: string) => {
    if (!value) {
      return "يرجى إدخال رمز التحقق";
    }

    if (value.length !== CODE_LENGTH) {
      return "يجب أن يتكون رمز التحقق من 6 أرقام";
    }

    if (!/^\d{6}$/.test(value)) {
      return "رمز التحقق يجب أن يحتوي على أرقام فقط";
    }

    return undefined;
  };

  const resetCodeBoxAnimations = () => {
    codeBoxScales.forEach((scale) => {
      scale.stopAnimation();
      scale.setValue(1);
    });
  };

  const animateVerificationResult = (status: "success" | "error") =>
    new Promise<void>((resolve) => {
      setVerificationStatus(status);

      const animations = codeBoxScales.map((scale) =>
        Animated.sequence([
          Animated.spring(scale, {
            toValue: 1.1,
            friction: 5,
            tension: 120,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 6,
            tension: 100,
            useNativeDriver: true,
          }),
        ]),
      );

      Animated.stagger(75, animations).start(() => resolve());
    });

  const handleCodeChange = (value: string) => {
    if (isSubmitting || isNavigating) {
      return;
    }

    const normalizedCode = value.replace(/\D/g, "").slice(0, CODE_LENGTH);

    setCode(normalizedCode);
    setVerificationStatus("idle");
    resetCodeBoxAnimations();

    if (errors.code || errors.general) {
      setErrors({});
    }
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

    router.replace("/forgot-password" as never);
  };

  const handleChangePhone = () => {
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
      router.replace("/forgot-password" as never);
    }, 200);
  };

  const handleResendCode = async () => {
    if (resendSeconds > 0 || isSubmitting || isNavigating) {
      return;
    }

    try {
      setErrors({});
      setResendSeconds(RESEND_SECONDS);

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch {
      setErrors({
        general:
          "تعذر إعادة إرسال الرمز. تحقق من اتصالك بالإنترنت ثم حاول مجددًا.",
      });
      setResendSeconds(0);
    }
  };

  const handleVerifyCode = async () => {
    if (isSubmitting || isNavigating) {
      return;
    }

    Keyboard.dismiss();

    const codeError = validateCode(code);

    if (codeError) {
      setVerificationStatus("error");
      setErrors({
        code: codeError,
      });
      await animateVerificationResult("error");
      return;
    }

    try {
      setIsSubmitting(true);
      setVerificationStatus("verifying");
      setErrors({});

      await new Promise((resolve) => setTimeout(resolve, 700));

      const isCodeCorrect = true;

      if (!isCodeCorrect) {
        setErrors({
          code: "رمز التحقق غير صحيح. تحقق من الرمز وحاول مجددًا.",
        });
        await animateVerificationResult("error");
        return;
      }

      await animateVerificationResult("success");

      verificationTimer.current = setTimeout(() => {
        setIsNavigating(true);
        router.push({
          pathname: "/create-new-password",
          params: {
            phone: normalizedPhone,
            code,
          },
        } as never);
      }, 850);
    } catch {
      setErrors({
        general:
          "تعذر التحقق من الرمز. تأكد من الرمز واتصالك بالإنترنت ثم حاول مجددًا.",
      });
      await animateVerificationResult("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.screen, { opacity: screenOpacity }]}>
          <View
            pointerEvents="none"
            style={[
              styles.topGlow,
              {
                width: width * 1.08,
                height: width * 1.08,
                borderRadius: width,
                top: -width * 0.78,
                right: -width * 0.3,
                opacity: 0.1,
              },
            ]}
          />

          <View
            pointerEvents="none"
            style={[
              styles.bottomGlow,
              {
                width: width * 1.18,
                height: width * 1.18,
                borderRadius: width,
                bottom: -width * 0.88,
                left: -width * 0.4,
                opacity: 0.1,
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
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: isCompact ? 0 : 8,
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
              <View
                style={[
                  styles.illustrationContainer,
                  {
                    width: illustrationSize,
                    height: illustrationSize,
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
                    styles.phoneCard,
                    {
                      width: illustrationSize * 0.5,
                      height: illustrationSize * 0.8,
                      borderRadius: illustrationSize * 0.08,
                    },
                  ]}
                >
                  <View style={styles.phoneSpeaker} />

                  <View style={styles.phoneScreen}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={illustrationSize * 0.26}
                      color="#E97835"
                    />

                    <View style={styles.screenKey}>
                      <Ionicons
                        name="key-outline"
                        size={illustrationSize * 0.13}
                        color="#693619"
                      />
                    </View>
                  </View>

                  <View style={styles.phoneHomeIndicator} />
                </View>

                <View style={styles.codeBubble}>
                  <Ionicons name="key" size={18} color="#6D381B" />
                </View>

                <View style={styles.sparkleOne}>
                  <Ionicons name="sparkles" size={18} color="#EF9A36" />
                </View>
              </View>

              <View style={styles.header}>
                <AppText
                  style={[
                    styles.title,
                    {
                      fontSize: titleSize,
                      lineHeight: titleSize * 1.35,
                    },
                  ]}
                >
                  أدخل رمز التحقق
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
                  أرسلنا رمزًا مكوّنًا من 6 أرقام إلى رقم الهاتف التالي:
                </AppText>
              </View>

              <View style={styles.form}>
                <View style={styles.phoneInfoCard}>
                  <View style={styles.phoneInfoIcon}>
                    <Ionicons
                      name="phone-portrait-outline"
                      size={24}
                      color="#402E27"
                    />
                  </View>

                  <AppText style={styles.phoneNumber}>{maskedPhone}</AppText>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="تغيير رقم الهاتف"
                    disabled={isSubmitting || isNavigating}
                    onPress={handleChangePhone}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.changePhoneButton,
                      pressed && styles.linkPressed,
                    ]}
                  >
                    <AppText style={styles.changePhoneText}>تغيير</AppText>
                  </Pressable>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="إدخال رمز التحقق"
                  onPress={() => codeInputRef.current?.focus()}
                  style={[
                    styles.codeBoxes,
                    {
                      gap: codeGap,
                    },
                  ]}
                >
                  {Array.from({ length: CODE_LENGTH }).map((_, index) => {
                    const digit = code[index] ?? "";
                    const isActive =
                      index === code.length ||
                      (code.length === CODE_LENGTH &&
                        index === CODE_LENGTH - 1);

                    return (
                      <Animated.View
                        key={index}
                        style={[
                          styles.codeBox,
                          {
                            width: codeBoxSize,
                            height: codeBoxSize * 1.18,
                            borderRadius: Math.min(14, codeBoxSize * 0.25),
                          },
                          digit && styles.filledCodeBox,
                          isActive &&
                            verificationStatus === "idle" &&
                            styles.activeCodeBox,
                          verificationStatus === "success" &&
                            styles.successCodeBox,
                          verificationStatus === "error" && styles.errorCodeBox,
                          { transform: [{ scale: codeBoxScales[index] }] },
                        ]}
                      >
                        <AppText
                          style={[
                            styles.codeDigit,
                            {
                              fontSize: Math.min(24, codeBoxSize * 0.43),
                            },
                          ]}
                        >
                          {digit}
                        </AppText>
                      </Animated.View>
                    );
                  })}

                  <TextInput
                    ref={codeInputRef}
                    value={code}
                    onChangeText={handleCodeChange}
                    onSubmitEditing={handleVerifyCode}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    autoComplete="sms-otp"
                    maxLength={CODE_LENGTH}
                    returnKeyType="done"
                    caretHidden
                    editable={
                      !isSubmitting &&
                      !isNavigating &&
                      verificationStatus !== "success"
                    }
                    style={styles.hiddenCodeInput}
                  />
                </Pressable>

                {verificationStatus === "success" ? (
                  <Animated.View style={styles.successMessage}>
                    <Ionicons
                      name="checkmark-circle"
                      size={19}
                      color="#13853A"
                    />

                    <AppText style={styles.successMessageText}>
                      تم التحقق من الرمز بنجاح
                    </AppText>
                  </Animated.View>
                ) : null}

                {errors.code ? (
                  <View style={styles.codeError}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={18}
                      color="#B74424"
                    />

                    <AppText style={styles.codeErrorText}>
                      {errors.code}
                    </AppText>
                  </View>
                ) : null}

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
                  title="تحقق من الرمز"
                  onPress={handleVerifyCode}
                  variant="custom"
                  size="large"
                  icon="shield-checkmark-outline"
                  iconPosition="end"
                  iconSize={22}
                  loading={isSubmitting}
                  loadingText="جاري التحقق..."
                  disabled={
                    isNavigating ||
                    code.length !== CODE_LENGTH ||
                    verificationStatus === "success"
                  }
                  fullWidth
                  backgroundColor={
                    code.length === CODE_LENGTH ? "#FF8849" : "#AFAFB2"
                  }
                  borderColor={
                    code.length === CODE_LENGTH ? "#FF8849" : "#AFAFB2"
                  }
                  borderWidth={0}
                  textColor={
                    code.length === CODE_LENGTH ? "#603016" : "#FFFFFF"
                  }
                  radius={16}
                  style={[
                    styles.verifyButton,
                    {
                      height: buttonHeight,
                      minHeight: buttonHeight,
                    },
                  ]}
                  textStyle={[
                    styles.verifyButtonText,
                    code.length !== CODE_LENGTH && styles.disabledButtonText,
                  ]}
                />
              </View>

              <View style={styles.footer}>
                <AppText style={styles.resendQuestion}>لم يصلك الرمز؟</AppText>

                {resendSeconds > 0 ? (
                  <AppText style={styles.resendTimer}>
                    يمكنك إعادة الإرسال خلال {formattedTimer}
                  </AppText>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="إعادة إرسال رمز التحقق"
                    disabled={isSubmitting || isNavigating}
                    onPress={handleResendCode}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.resendButton,
                      pressed && styles.linkPressed,
                    ]}
                  >
                    <AppText style={styles.resendButtonText}>
                      إعادة إرسال رمز التحقق
                    </AppText>
                  </Pressable>
                )}

                <View style={styles.helpMessage}>
                  <Ionicons
                    name="information-circle-outline"
                    size={17}
                    color="#258442"
                  />

                  <AppText style={styles.helpMessageText}>
                    لم تستلم الرسالة؟ تأكد من صحة الرقم ومن توفر تغطية الشبكة.
                  </AppText>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
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
    backgroundColor: "#FBFAFE",
  },
  scrollView: {
    flex: 1,
    width: "100%",
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
    marginBottom: 18,
  },
  illustrationHalo: {
    position: "absolute",
    backgroundColor: "#FFF3ED",
  },
  phoneCard: {
    alignItems: "center",
    paddingTop: 7,
    paddingHorizontal: 6,
    paddingBottom: 7,
    backgroundColor: "#FFD8A6",
    borderWidth: 1.5,
    borderColor: "#75411F",
    shadowColor: "#8C512D",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  phoneSpeaker: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#875035",
    marginBottom: 6,
  },
  phoneScreen: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    backgroundColor: "#FFF4E6",
    borderWidth: 1,
    borderColor: "#E6A66A",
  },
  screenKey: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  phoneHomeIndicator: {
    width: 18,
    height: 3,
    marginTop: 6,
    borderRadius: 2,
    backgroundColor: "#8B5435",
  },
  codeBubble: {
    position: "absolute",
    right: "15%",
    top: "36%",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#FFC677",
    borderWidth: 1.5,
    borderColor: "#75411F",
  },
  sparkleOne: {
    position: "absolute",
    left: "12%",
    top: "22%",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
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
  phoneInfoCard: {
    width: "100%",
    minHeight: 72,
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9BDA8",
  },
  phoneInfoIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#FFE2D5",
  },
  phoneNumber: {
    flex: 1,
    marginHorizontal: 10,
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: "#302925",
    textAlign: "center",
    writingDirection: "ltr",
  },
  changePhoneButton: {
    minWidth: 48,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  changePhoneText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#AC4B18",
    textAlign: "center",
  },
  codeBoxes: {
    position: "relative",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 16,
  },
  codeBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.25,
    borderColor: "#E8BDAA",
  },
  filledCodeBox: {
    borderColor: "#DF8555",
    backgroundColor: "#FFF9F6",
  },
  activeCodeBox: {
    borderWidth: 1.8,
    borderColor: "#FF8849",
  },
  successCodeBox: {
    borderWidth: 2,
    borderColor: "#13853A",
    backgroundColor: "#F1FBF4",
  },
  errorCodeBox: {
    borderWidth: 2,
    borderColor: "#C95330",
    backgroundColor: "#FFF3EF",
  },
  codeDigit: {
    fontFamily: FONTS.bold,
    color: "#332B27",
    textAlign: "center",
  },
  hiddenCodeInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  successMessage: {
    width: "100%",
    minHeight: 30,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 12,
  },
  successMessageText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    lineHeight: 20,
    color: "#13853A",
    textAlign: "center",
  },
  codeError: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
  },
  codeErrorText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 20,
    color: "#A53F20",
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
  verifyButton: {
    direction: "ltr",
    width: "100%",
    marginTop: 10,
    paddingVertical: 0,
    shadowColor: "#E66F30",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.18,
    shadowRadius: 13,
    elevation: 6,
  },
  verifyButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: "#603016",
    textAlign: "center",
  },
  disabledButtonText: {
    color: "#FFFFFF",
  },
  footer: {
    width: "100%",
    alignItems: "center",
    marginTop: 25,
  },
  resendQuestion: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#665852",
    textAlign: "center",
  },
  resendTimer: {
    marginTop: 7,
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#B75017",
    textAlign: "center",
  },
  resendButton: {
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  resendButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#B75017",
    textAlign: "center",
  },
  helpMessage: {
    maxWidth: 360,
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 6,
    marginTop: 18,
    paddingHorizontal: 12,
  },
  helpMessageText: {
    flexShrink: 1,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 18,
    color: "#258442",
    textAlign: "center",
  },
  linkPressed: {
    opacity: 0.55,
    transform: [{ scale: 0.96 }],
  },
});
