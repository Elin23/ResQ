import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
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

type FormErrors = {
  fullName?: string;
  email?: string;
  birthDate?: string;
  phone?: string;
  governorate?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

const GOVERNORATES = [
  "دمشق",
  "ريف دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "درعا",
  "السويداء",
  "القنيطرة",
  "دير الزور",
  "الرقة",
  "الحسكة",
];

export default function RegisterUserScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    accountType?: "user" | "volunteer";
  }>();

  const { width } = useWindowDimensions();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [temporaryBirthDate, setTemporaryBirthDate] = useState(
    new Date(2000, 0, 1),
  );
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGovernorates, setShowGovernorates] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedUpdates, setAcceptedUpdates] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const horizontalPadding = Math.max(20, Math.min(width * 0.055, 34));
  const contentWidth = Math.min(width - horizontalPadding * 2, 560);

  const accountTitle =
    params.accountType === "volunteer"
      ? "إنشاء حساب متطوع"
      : "إنشاء حساب مستخدم";

  const maximumBirthDate = useMemo(() => new Date(), []);
  const minimumBirthDate = useMemo(() => new Date(1900, 0, 1), []);

  const formattedBirthDate = useMemo(() => {
    if (!birthDate) {
      return "";
    }

    return new Intl.DateTimeFormat("ar-SY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(birthDate);
  }, [birthDate]);

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    }

    if (/[A-Za-z]/.test(password)) {
      score += 1;
    }

    if (/\d/.test(password)) {
      score += 1;
    }

    return score;
  }, [password]);

  const passwordStrengthLabel =
    passwordStrength === 3
      ? "قوية"
      : passwordStrength === 2
        ? "متوسطة"
        : "ضعيفة";

  const passwordStrengthColor =
    passwordStrength === 3
      ? "#17823A"
      : passwordStrength === 2
        ? "#E38A2E"
        : "#C92335";

  const canSubmit =
    fullName.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    birthDate !== null &&
    phone.length >= 8 &&
    governorate.length > 0 &&
    passwordStrength === 3 &&
    confirmPassword === password &&
    acceptedTerms &&
    !isSubmitting;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/choose-account" as never);
  };

  const openBirthDatePicker = () => {
    const initialDate = birthDate ?? new Date(2000, 0, 1);

    setTemporaryBirthDate(initialDate);
    setShowGovernorates(false);
    setShowBirthDatePicker(true);
  };

  const handleBirthDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowBirthDatePicker(false);

      if (event.type === "set" && selectedDate) {
        setBirthDate(selectedDate);
        setErrors((current) => ({
          ...current,
          birthDate: undefined,
        }));
      }

      return;
    }

    if (selectedDate) {
      setTemporaryBirthDate(selectedDate);
    }
  };

  const confirmBirthDate = () => {
    setBirthDate(temporaryBirthDate);
    setShowBirthDatePicker(false);
    setErrors((current) => ({
      ...current,
      birthDate: undefined,
    }));
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (fullName.trim().length < 3) {
      nextErrors.fullName = "يرجى إدخال الاسم الكامل";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!birthDate) {
      nextErrors.birthDate = "يرجى اختيار تاريخ الميلاد";
    }

    if (phone.length < 8) {
      nextErrors.phone = "يرجى إدخال رقم هاتف صحيح";
    }

    if (!governorate) {
      nextErrors.governorate = "يرجى اختيار المحافظة";
    }

    if (passwordStrength < 3) {
      nextErrors.password =
        "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتحتوي على حرف ورقم";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    if (!acceptedTerms) {
      nextErrors.terms = "يجب الموافقة على شروط الاستخدام وسياسة الخصوصية";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        accountType: params.accountType ?? "user",
        fullName: fullName.trim(),
        email: email.trim(),
        birthDate: birthDate?.toISOString() ?? "",
        phone: `+963${phone}`,
        governorate,
        password,
        acceptedUpdates,
      };

      await new Promise((resolve) => setTimeout(resolve, 900));

      void payload;

      router.push({
        pathname: "/verify-registration-phone",
        params: {
          phone: `+963${phone}`,
          accountType: "user",
        },
      } as never);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (message?: string) => {
    if (!message) {
      return null;
    }

    return <AppText style={styles.errorText}>{message}</AppText>;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screen}>
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
              hitSlop={10}
              onPress={handleBack}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
            >
              <Ionicons
                name="arrow-forward-outline"
                size={25}
                color="#332D2A"
              />
            </Pressable>

            <AppText style={styles.topBarTitle}>{accountTitle}</AppText>

            <View style={styles.topBarSpacer} />
          </View>

          <View
            style={[
              styles.progressArea,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
          >
            <View style={styles.progressLabels}>
              <AppText style={styles.progressTitle}>بيانات الحساب</AppText>
              <AppText style={styles.stepText}>الخطوة 2 من 3</AppText>
            </View>

            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: horizontalPadding,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled
          >
            <View style={[styles.content, { width: contentWidth }]}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionMarker} />
                <AppText style={styles.sectionTitle}>المعلومات الشخصية</AppText>
              </View>

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.fullName && styles.inputContainerError,
                  ]}
                >
                  <Ionicons name="person-outline" size={21} color="#4D514A" />

                  <TextInput
                    value={fullName}
                    onChangeText={(value) => {
                      setFullName(value);
                      setErrors((current) => ({
                        ...current,
                        fullName: undefined,
                      }));
                    }}
                    placeholder="الاسم الكامل"
                    placeholderTextColor="#777B75"
                    textAlign="right"
                    style={styles.input}
                    returnKeyType="next"
                  />
                </View>

                {renderError(errors.fullName)}
              </View>

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.email && styles.inputContainerError,
                  ]}
                >
                  <Ionicons name="mail-outline" size={21} color="#4D514A" />

                  <TextInput
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      setErrors((current) => ({
                        ...current,
                        email: undefined,
                      }));
                    }}
                    placeholder="البريد الإلكتروني"
                    placeholderTextColor="#777B75"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textAlign="right"
                    style={styles.input}
                    returnKeyType="next"
                  />
                </View>

                {renderError(errors.email)}
              </View>

              <View style={styles.fieldGroup}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="اختيار تاريخ الميلاد"
                  onPress={openBirthDatePicker}
                  style={({ pressed }) => [
                    styles.inputContainer,
                    errors.birthDate && styles.inputContainerError,
                    pressed && styles.dateFieldPressed,
                  ]}
                >
                  <Ionicons name="calendar-outline" size={22} color="#4D514A" />

                  <AppText
                    style={[
                      styles.dateValue,
                      !birthDate && styles.datePlaceholder,
                    ]}
                  >
                    {formattedBirthDate || "تاريخ الميلاد"}
                  </AppText>

                  <Ionicons
                    name="chevron-down-outline"
                    size={19}
                    color="#626861"
                  />
                </Pressable>

                {renderError(errors.birthDate)}
              </View>

              {Platform.OS === "android" && showBirthDatePicker ? (
                <DateTimePicker
                  value={temporaryBirthDate}
                  mode="date"
                  display="default"
                  minimumDate={minimumBirthDate}
                  maximumDate={maximumBirthDate}
                  onChange={handleBirthDateChange}
                />
              ) : null}

              <View style={styles.fieldGroup}>
                <View style={styles.phoneRow}>
                  <View style={styles.countryCodeBox}>
                    <AppText style={styles.countryCodeText}>+963</AppText>
                  </View>

                  <View
                    style={[
                      styles.inputContainer,
                      styles.phoneInputContainer,
                      errors.phone && styles.inputContainerError,
                    ]}
                  >
                    <Ionicons name="call-outline" size={21} color="#4D514A" />

                    <TextInput
                      value={phone}
                      onChangeText={(value) => {
                        setPhone(value.replace(/\D/g, "").slice(0, 9));
                        setErrors((current) => ({
                          ...current,
                          phone: undefined,
                        }));
                      }}
                      placeholder="رقم الهاتف"
                      placeholderTextColor="#777B75"
                      keyboardType="phone-pad"
                      textAlign="right"
                      style={styles.input}
                      returnKeyType="next"
                    />
                  </View>
                </View>

                {renderError(errors.phone)}
              </View>

              <View style={styles.fieldGroup}>
                <Pressable
                  onPress={() => setShowGovernorates((current) => !current)}
                  style={[
                    styles.inputContainer,
                    errors.governorate && styles.inputContainerError,
                  ]}
                >
                  <Ionicons name="location-outline" size={22} color="#4D514A" />

                  <AppText
                    style={[
                      styles.selectText,
                      !governorate && styles.selectPlaceholder,
                    ]}
                  >
                    {governorate || "المحافظة"}
                  </AppText>

                  <Ionicons
                    name={
                      showGovernorates
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={20}
                    color="#4D514A"
                  />
                </Pressable>

                {showGovernorates ? (
                  <View style={styles.dropdown}>
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator
                      keyboardShouldPersistTaps="handled"
                      contentContainerStyle={styles.dropdownContent}
                    >
                      {GOVERNORATES.map((item) => (
                        <Pressable
                          key={item}
                          onPress={() => {
                            setGovernorate(item);
                            setShowGovernorates(false);
                            setErrors((current) => ({
                              ...current,
                              governorate: undefined,
                            }));
                          }}
                          style={({ pressed }) => [
                            styles.dropdownItem,
                            governorate === item && styles.selectedDropdownItem,
                            pressed && styles.dropdownItemPressed,
                          ]}
                        >
                          <AppText style={styles.dropdownItemText}>
                            {item}
                          </AppText>

                          {governorate === item ? (
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color="#16833A"
                            />
                          ) : null}
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}

                {renderError(errors.governorate)}
              </View>

              <View style={[styles.sectionHeader, styles.passwordHeader]}>
                <View style={styles.sectionMarker} />
                <AppText style={styles.sectionTitle}>كلمة المرور</AppText>
              </View>

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.password && styles.inputContainerError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#4D514A"
                  />

                  <TextInput
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      setErrors((current) => ({
                        ...current,
                        password: undefined,
                      }));
                    }}
                    placeholder="كلمة المرور الجديدة"
                    placeholderTextColor="#777B75"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textAlign="right"
                    style={styles.input}
                    returnKeyType="next"
                  />

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                    onPress={() => setShowPassword((current) => !current)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={23}
                      color="#596059"
                    />
                  </Pressable>
                </View>

                {renderError(errors.password)}
              </View>

              <View style={styles.passwordStrengthHeader}>
                <AppText style={styles.passwordStrengthTitle}>
                  قوة كلمة المرور
                </AppText>

                <AppText
                  style={[
                    styles.passwordStrengthLabel,
                    {
                      color: passwordStrengthColor,
                    },
                  ]}
                >
                  {passwordStrengthLabel}
                </AppText>
              </View>

              <View style={styles.passwordBars}>
                {[1, 2, 3].map((item) => (
                  <View
                    key={item}
                    style={[
                      styles.passwordBar,
                      item <= passwordStrength && {
                        backgroundColor: passwordStrengthColor,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.requirements}>
                <View style={styles.requirementRow}>
                  <Ionicons
                    name={
                      password.length >= 8
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={18}
                    color={password.length >= 8 ? "#16833A" : "#60665F"}
                  />

                  <AppText style={styles.requirementText}>
                    8 أحرف على الأقل
                  </AppText>
                </View>

                <View style={styles.requirementRow}>
                  <Ionicons
                    name={
                      /\d/.test(password)
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={18}
                    color={/\d/.test(password) ? "#16833A" : "#60665F"}
                  />

                  <AppText style={styles.requirementText}>
                    رقم واحد على الأقل
                  </AppText>
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.confirmPassword && styles.inputContainerError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={22}
                    color="#4D514A"
                  />

                  <TextInput
                    value={confirmPassword}
                    onChangeText={(value) => {
                      setConfirmPassword(value);
                      setErrors((current) => ({
                        ...current,
                        confirmPassword: undefined,
                      }));
                    }}
                    placeholder="تأكيد كلمة المرور"
                    placeholderTextColor="#777B75"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textAlign="right"
                    style={styles.input}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showConfirmPassword
                        ? "إخفاء تأكيد كلمة المرور"
                        : "إظهار تأكيد كلمة المرور"
                    }
                    onPress={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    hitSlop={8}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={23}
                      color="#596059"
                    />
                  </Pressable>
                </View>

                {renderError(errors.confirmPassword)}
              </View>

              <Pressable
                onPress={() => {
                  setAcceptedTerms((current) => !current);
                  setErrors((current) => ({
                    ...current,
                    terms: undefined,
                  }));
                }}
                style={styles.checkboxRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    acceptedTerms && styles.checkboxSelected,
                  ]}
                >
                  {acceptedTerms ? (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  ) : null}
                </View>

                <AppText style={styles.checkboxText}>
                  أوافق على{" "}
                  <AppText style={styles.linkText}>شروط الاستخدام</AppText> و
                  <AppText style={styles.linkText}>سياسة الخصوصية</AppText>{" "}
                  لخدمة ResQ.
                </AppText>
              </Pressable>

              {renderError(errors.terms)}

              <Pressable
                onPress={() => setAcceptedUpdates((current) => !current)}
                style={styles.checkboxRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    acceptedUpdates && styles.checkboxSelected,
                  ]}
                >
                  {acceptedUpdates ? (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  ) : null}
                </View>

                <AppText style={styles.checkboxText}>
                  أرغب في تلقي تحديثات وأخبار عن الحيوانات التي تحتاج للمساعدة
                  في منطقتي.
                </AppText>
              </Pressable>

              <View style={styles.noticeCard}>
                <Ionicons name="shield" size={23} color="#FF7B32" />

                <AppText style={styles.noticeText}>
                  بياناتك في أمان. نستخدم رقم هاتفك وموقعك فقط للتواصل معك بشأن
                  البلاغات التي ترسلها لضمان سرعة الاستجابة.
                </AppText>
              </View>

              <Button
                title="إنشاء الحساب"
                onPress={handleSubmit}
                variant="custom"
                size="large"
                fullWidth
                loading={isSubmitting}
                loadingText="جاري إنشاء الحساب..."
                disabled={!canSubmit}
                backgroundColor={canSubmit ? "#FF8849" : "#FFB990"}
                borderColor={canSubmit ? "#FF8849" : "#FFB990"}
                borderWidth={0}
                textColor="#FFFFFF"
                radius={17}
                style={styles.submitButton}
                textStyle={styles.submitButtonText}
              />

              <Pressable
                onPress={() => router.replace("/login" as never)}
                style={({ pressed }) => [
                  styles.loginLink,
                  pressed && styles.loginLinkPressed,
                ]}
              >
                <AppText style={styles.loginText}>
                  لديك حساب بالفعل؟{" "}
                  <AppText style={styles.loginHighlight}>تسجيل الدخول</AppText>
                </AppText>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <Modal
        visible={Platform.OS === "ios" && showBirthDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBirthDatePicker(false)}
      >
        <View style={styles.dateModalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowBirthDatePicker(false)}
          />

          <View style={styles.dateModalCard}>
            <View style={styles.dateModalHeader}>
              <Pressable
                onPress={() => setShowBirthDatePicker(false)}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.dateModalAction,
                  pressed && styles.dateModalActionPressed,
                ]}
              >
                <AppText style={styles.dateModalCancel}>إلغاء</AppText>
              </Pressable>

              <AppText style={styles.dateModalTitle}>تاريخ الميلاد</AppText>

              <Pressable
                onPress={confirmBirthDate}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.dateModalAction,
                  pressed && styles.dateModalActionPressed,
                ]}
              >
                <AppText style={styles.dateModalConfirm}>تم</AppText>
              </Pressable>
            </View>

            <DateTimePicker
              value={temporaryBirthDate}
              mode="date"
              display="spinner"
              minimumDate={minimumBirthDate}
              maximumDate={maximumBirthDate}
              onChange={handleBirthDateChange}
              style={styles.iosDatePicker}
            />
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#FBFAFE",
  },
  topBar: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarTitle: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: "#24201E",
    textAlign: "center",
    writingDirection: "rtl",
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
  progressArea: {
    paddingTop: 4,
    paddingBottom: 18,
  },
  progressLabels: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#5D5551",
    textAlign: "left",
    writingDirection: "rtl",
  },
  stepText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#FF7B32",
    textAlign: "left",
    writingDirection: "rtl",
  },
  progressTrack: {
    width: "100%",
    height: 5,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "#E4E1DF",
  },
  progressFill: {
    width: "66.666%",
    height: "100%",
    alignSelf: "flex-end",
    borderRadius: 999,
    backgroundColor: "#FF8849",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 36,
  },
  content: {
    alignSelf: "center",
  },
  sectionHeader: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    marginBottom: 18,
  },
  passwordHeader: {
    marginTop: 26,
  },
  sectionMarker: {
    width: 4,
    height: 22,
    borderRadius: 999,
    backgroundColor: "#16833A",
  },
  sectionTitle: {
    fontFamily: FONTS.medium,
    fontSize: 17,
    color: "#16833A",
    textAlign: "left",
    writingDirection: "rtl",
  },
  fieldGroup: {
    width: "100%",
    marginBottom: 16,
  },
  inputContainer: {
    width: "100%",
    minHeight: 57,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#7E897D",
    backgroundColor: "#FBFAFE",
  },
  inputContainerError: {
    borderColor: "#C92335",
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: "#2F332F",
    writingDirection: "rtl",
  },
  dateFieldPressed: {
    opacity: 0.72,
  },
  dateValue: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: "#2F332F",
    textAlign: "left",
    writingDirection: "rtl",
  },
  datePlaceholder: {
    color: "#777B75",
  },
  selectText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: "#2F332F",
    textAlign: "left",
    writingDirection: "rtl",
  },
  selectPlaceholder: {
    color: "#777B75",
  },
  phoneRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phoneInputContainer: {
    flex: 1,
  },
  countryCodeBox: {
    width: 74,
    minHeight: 57,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#7E897D",
    backgroundColor: "#FBFAFE",
  },
  countryCodeText: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: "#4E514D",
    textAlign: "center",
    writingDirection: "ltr",
  },
  dropdown: {
    width: "100%",
    height: 240,
    overflow: "hidden",
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6D9D4",
    backgroundColor: "#FFFFFF",
  },
  dropdownContent: {
    flexGrow: 0,
  },
  dropdownItem: {
    minHeight: 48,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ECEDEB",
  },
  selectedDropdownItem: {
    backgroundColor: "#F1F8F3",
  },
  dropdownItemPressed: {
    opacity: 0.65,
  },
  dropdownItemText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: "#343834",
    textAlign: "left",
    writingDirection: "rtl",
  },
  errorText: {
    marginTop: 6,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 18,
    color: "#C92335",
    textAlign: "left",
    writingDirection: "rtl",
  },
  passwordStrengthHeader: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -4,
    marginBottom: 8,
  },
  passwordStrengthTitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#4F544E",
    textAlign: "left",
    writingDirection: "rtl",
  },
  passwordStrengthLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    textAlign: "left",
    writingDirection: "rtl",
  },
  passwordBars: {
    width: "100%",
    flexDirection: "row-reverse",
    gap: 5,
    marginBottom: 18,
  },
  passwordBar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#E2E3E1",
  },
  requirements: {
    width: "100%",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 22,
  },
  requirementRow: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  requirementText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#50554F",
    textAlign: "left",
    writingDirection: "rtl",
  },
  checkboxRow: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    width: 21,
    height: 21,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#8F9990",
    backgroundColor: "#FFFFFF",
  },
  checkboxSelected: {
    borderColor: "#16833A",
    backgroundColor: "#16833A",
  },
  checkboxText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 22,
    color: "#555A54",
    textAlign: "left",
    writingDirection: "rtl",
  },
  linkText: {
    fontFamily: FONTS.medium,
    color: "#FF7B32",
  },
  noticeCard: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 6,
    marginBottom: 28,
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FF8A46",
    backgroundColor: "#FFF4EC",
  },
  noticeText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 20,
    color: "#604D41",
    textAlign: "left",
    writingDirection: "rtl",
  },
  dateModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: "rgba(0, 0, 0, 0.34)",
  },
  dateModalCard: {
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  dateModalHeader: {
    minHeight: 54,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5E5",
  },
  dateModalTitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: "#292D29",
    textAlign: "center",
    writingDirection: "rtl",
  },
  dateModalAction: {
    minWidth: 48,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  dateModalActionPressed: {
    opacity: 0.55,
  },
  dateModalCancel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: "#6B706A",
  },
  dateModalConfirm: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: "#FF7B32",
  },
  iosDatePicker: {
    width: "100%",
  },
  submitButton: {
    width: "100%",
    height: 58,
    minHeight: 58,
  },
  submitButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    textAlign: "center",
  },
  loginLink: {
    alignSelf: "center",
    marginTop: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginLinkPressed: {
    opacity: 0.55,
  },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#706864",
    textAlign: "center",
    writingDirection: "rtl",
  },
  loginHighlight: {
    fontFamily: FONTS.medium,
    color: "#FF7B32",
  },
});
