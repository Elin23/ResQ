<<<<<<< HEAD
export { default } from "@/src/features/auth/screens/CreateNewPasswordScreen";
=======
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
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/AppText";
import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { FONTS } from "@/src/constants/theme";

type FormErrors = {
  password?: string;
  confirmPassword?: string;
  general?: string;
};

type PasswordRequirement = {
  id: string;
  label: string;
  isValid: boolean;
};

export default function CreateNewPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    phone?: string;
    code?: string;
  }>();

  const { width, height } = useWindowDimensions();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const illustrationOpacity = useRef(new Animated.Value(0)).current;
  const illustrationScale = useRef(new Animated.Value(0.88)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const requirementsOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const isTablet = width >= 600;
  const isCompact = height < 740;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.16, 120)
    : Math.max(24, width * 0.065);

  const contentWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 440,
  );

  const titleSize = isTablet ? 36 : Math.max(28, Math.min(width * 0.074, 32));

  const subtitleSize = isTablet ? 18 : Math.max(14, Math.min(width * 0.04, 16));

  const illustrationSize = isTablet ? 176 : isCompact ? 120 : 148;
  const buttonHeight = isTablet ? 64 : 58;

  const passwordRequirements = useMemo<PasswordRequirement[]>(
    () => [
      {
        id: "length",
        label: "8 أحرف على الأقل",
        isValid: password.length >= 8,
      },
      {
        id: "uppercase",
        label: "يحتوي على حرف كبير",
        isValid: /[A-Z]/.test(password),
      },
      {
        id: "number",
        label: "يحتوي على رقم",
        isValid: /\d/.test(password),
      },
      {
        id: "lowercase",
        label: "يحتوي على حرف صغير",
        isValid: /[a-z]/.test(password),
      },
    ],
    [password],
  );

  const doPasswordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.stagger(70, [
        Animated.spring(illustrationScale, {
          toValue: 1,
          friction: 8,
          tension: 55,
          useNativeDriver: true,
        }),
        Animated.timing(illustrationOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(requirementsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    return () => {
      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }

      screenOpacity.stopAnimation();
      illustrationOpacity.stopAnimation();
      illustrationScale.stopAnimation();
      headerOpacity.stopAnimation();
      formOpacity.stopAnimation();
      requirementsOpacity.stopAnimation();
      buttonOpacity.stopAnimation();
    };
  }, [
    buttonOpacity,
    formOpacity,
    headerOpacity,
    illustrationOpacity,
    illustrationScale,
    requirementsOpacity,
    screenOpacity,
  ]);

  const validatePassword = (value: string) => {
    if (!value) {
      return "يرجى إدخال كلمة المرور الجديدة";
    }

    if (value.length < 8) {
      return "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل";
    }

    if (!/[A-Z]/.test(value)) {
      return "يجب أن تحتوي كلمة المرور على حرف إنجليزي كبير";
    }

    if (!/[a-z]/.test(value)) {
      return "يجب أن تحتوي كلمة المرور على حرف إنجليزي صغير";
    }

    if (!/\d/.test(value)) {
      return "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل";
    }

    return undefined;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      return "يرجى تأكيد كلمة المرور";
    }

    if (value !== password) {
      return "كلمتا المرور غير متطابقتين";
    }

    return undefined;
  };

  const validateForm = () => {
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    setErrors({
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    return !passwordError && !confirmPasswordError;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    setErrors((current) => ({
      ...current,
      password: undefined,
      confirmPassword:
        confirmPassword && value !== confirmPassword
          ? "كلمتا المرور غير متطابقتين"
          : undefined,
      general: undefined,
    }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    setErrors((current) => ({
      ...current,
      confirmPassword: undefined,
      general: undefined,
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

  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword) {
      return;
    }

    setErrors((current) => ({
      ...current,
      confirmPassword: validateConfirmPassword(confirmPassword),
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

    router.replace("/forgot-password" as never);
  };

  const navigateToSuccess = () => {
    if (isNavigating) {
      return;
    }

    setIsNavigating(true);

    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 180,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();

    navigationTimer.current = setTimeout(() => {
      router.replace("/password-reset-success" as never);
    }, 180);
  };

  const handleSavePassword = async () => {
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

      const resetPayload = {
        phone: params.phone ?? "",
        code: params.code ?? "",
        newPassword: password,
      };

      await new Promise((resolve) => setTimeout(resolve, 700));

      void resetPayload;
      navigateToSuccess();
    } catch {
      setErrors({
        general:
          "تعذر حفظ كلمة المرور الجديدة. تحقق من اتصالك بالإنترنت ثم حاول مجددًا.",
      });
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
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
                paddingTop: isCompact ? 10 : 18,
                paddingBottom: isCompact ? 96 : 120,
              },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator
            bounces
            overScrollMode="always"
            nestedScrollEnabled
            onScrollBeginDrag={Keyboard.dismiss}
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
                    transform: [{ scale: illustrationScale }],
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
                    styles.iconCard,
                    {
                      width: illustrationSize * 0.68,
                      height: illustrationSize * 0.68,
                      borderRadius: illustrationSize * 0.14,
                    },
                  ]}
                >
                  <View style={styles.shieldWrapper}>
                    <Ionicons
                      name="shield"
                      size={illustrationSize * 0.32}
                      color="#FF8644"
                    />

                    <View style={styles.keyIcon}>
                      <Ionicons
                        name="key-outline"
                        size={illustrationSize * 0.16}
                        color="#603116"
                      />
                    </View>
                  </View>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.header,
                  {
                    opacity: headerOpacity,
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
                  إنشاء كلمة مرور جديدة
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
                  أنشئ كلمة مرور قوية وجديدة لحماية حسابك.
                </AppText>
              </Animated.View>

              <Animated.View style={[styles.form, { opacity: formOpacity }]}>
                <Input
                  label="كلمة المرور الجديدة"
                  required
                  value={password}
                  onChangeText={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="أدخل كلمة المرور الجديدة"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  returnKeyType="next"
                  password
                  iconSize={22}
                  error={errors.password}
                  disabled={isSubmitting || isNavigating}
                  containerStyle={styles.passwordInput}
                />

                <Input
                  label="تأكيد كلمة المرور"
                  required
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  onBlur={handleConfirmPasswordBlur}
                  onSubmitEditing={handleSavePassword}
                  placeholder="أعد إدخال كلمة المرور"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  returnKeyType="done"
                  password
                  iconSize={22}
                  error={errors.confirmPassword}
                  disabled={isSubmitting || isNavigating}
                  containerStyle={styles.confirmPasswordInput}
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
              </Animated.View>

              <Animated.View
                style={[
                  styles.requirementsCard,
                  {
                    opacity: requirementsOpacity,
                  },
                ]}
              >
                <View style={styles.requirementsHeader}>
                  <View style={styles.requirementsTitleIcon}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={20}
                      color="#4C3B34"
                    />
                  </View>

                  <AppText style={styles.requirementsTitle}>
                    متطلبات كلمة المرور
                  </AppText>
                </View>

                <View style={styles.requirementsList}>
                  {passwordRequirements.map((requirement) => (
                    <View key={requirement.id} style={styles.requirementRow}>
                      <Ionicons
                        name={
                          requirement.isValid
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        size={20}
                        color={requirement.isValid ? "#13853A" : "#9B8174"}
                      />

                      <AppText
                        style={[
                          styles.requirementText,
                          requirement.isValid && styles.validRequirementText,
                        ]}
                      >
                        {requirement.label}
                      </AppText>
                    </View>
                  ))}

                  {confirmPassword.length > 0 ? (
                    <View style={styles.requirementRow}>
                      <Ionicons
                        name={
                          doPasswordsMatch
                            ? "checkmark-circle"
                            : "close-circle-outline"
                        }
                        size={20}
                        color={doPasswordsMatch ? "#13853A" : "#BE4E2C"}
                      />

                      <AppText
                        style={[
                          styles.requirementText,
                          doPasswordsMatch
                            ? styles.validRequirementText
                            : styles.invalidRequirementText,
                        ]}
                      >
                        كلمتا المرور متطابقتان
                      </AppText>
                    </View>
                  ) : null}
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  styles.buttonContainer,
                  {
                    opacity: buttonOpacity,
                  },
                ]}
              >
                <Button
                  title="حفظ كلمة المرور"
                  onPress={handleSavePassword}
                  variant="custom"
                  size="large"
                  icon="lock-closed-outline"
                  iconPosition="end"
                  iconSize={22}
                  loading={isSubmitting}
                  loadingText="جاري حفظ كلمة المرور..."
                  disabled={isNavigating}
                  fullWidth
                  backgroundColor="#FF8849"
                  borderColor="#FF8849"
                  borderWidth={0}
                  textColor="#603016"
                  radius={17}
                  style={[
                    styles.saveButton,
                    {
                      height: buttonHeight,
                      minHeight: buttonHeight,
                    },
                  ]}
                  textStyle={styles.saveButtonText}
                />
              </Animated.View>
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
  topBar: {
    width: "100%",
    height: 58,
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
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    width: "100%",
    alignItems: "center",
  },
  content: {
    alignSelf: "center",
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
  iconCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECC4B2",
    shadowColor: "#9B694E",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 13,
    elevation: 4,
  },
  shieldWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  keyIcon: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
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
  subtitle: {
    maxWidth: 390,
    marginTop: 6,
    fontFamily: FONTS.regular,
    color: "#72645D",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  passwordInput: {
    marginBottom: 8,
  },
  confirmPasswordInput: {
    marginBottom: 4,
  },
  generalError: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
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
  requirementsCard: {
    width: "100%",
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE8E5",
    shadowColor: "#79675E",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  requirementsHeader: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 7,
    marginBottom: 14,
  },
  requirementsTitleIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#FFF1E9",
  },
  requirementsTitle: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#342B27",
    textAlign: "right",
  },
  requirementsList: {
    width: "100%",
    gap: 11,
  },
  requirementRow: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 9,
  },
  requirementText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 21,
    color: "#695A53",
    textAlign: "right",
  },
  validRequirementText: {
    color: "#13853A",
  },
  invalidRequirementText: {
    color: "#BE4E2C",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 30,
  },
  saveButton: {
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
  saveButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: "#603016",
    textAlign: "center",
  },
});
>>>>>>> 5f4a354c8632b09b2c8785d2eebd30ffed989cf6
