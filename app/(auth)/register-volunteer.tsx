import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
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
  district?: string;
  association?: string;
  availability?: string;
  password?: string;
  confirmPassword?: string;
  information?: string;
  approval?: string;
  terms?: string;
};

type UploadType = "personal" | "identity";

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

const ASSOCIATIONS = [
  "جمعية الرفق بالحيوان",
  "فريق إنقاذ الحيوانات",
  "جمعية أصدقاء الحيوان",
  "مبادرة مأوى آمن",
  "فريق الرحمة التطوعي",
];

const WEEK_DAYS = [
  { id: "sat", label: "س" },
  { id: "sun", label: "ح" },
  { id: "mon", label: "ن" },
  { id: "tue", label: "ث" },
  { id: "wed", label: "ر" },
  { id: "thu", label: "خ" },
  { id: "fri", label: "ج" },
];

const PERIODS = [
  { id: "morning", label: "صباحاً" },
  { id: "afternoon", label: "ظهراً" },
  { id: "night", label: "ليلاً" },
];

export default function RegisterVolunteerScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const horizontalPadding = Math.max(17, Math.min(width * 0.048, 30));
  const contentWidth = Math.min(width - horizontalPadding * 2, 560);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [temporaryBirthDate, setTemporaryBirthDate] = useState(
    new Date(2000, 0, 1),
  );
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [district, setDistrict] = useState("");
  const [association, setAssociation] = useState("");
  const [associationSearch, setAssociationSearch] = useState("");
  const [transportation, setTransportation] = useState<"car" | "bike">("car");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [nightEmergency, setNightEmergency] = useState(false);
  const [personalPhoto, setPersonalPhoto] = useState<string | null>(null);
  const [identityPhoto, setIdentityPhoto] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [informationConfirmed, setInformationConfirmed] = useState(false);
  const [approvalConfirmed, setApprovalConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAfterSubmitInfo, setShowAfterSubmitInfo] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showGovernorates, setShowGovernorates] = useState(false);
  const [showAssociations, setShowAssociations] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const filteredAssociations = useMemo(() => {
    const query = associationSearch.trim();

    if (!query) {
      return ASSOCIATIONS;
    }

    return ASSOCIATIONS.filter((item) => item.includes(query));
  }, [associationSearch]);

  const passwordStrength = useMemo(() => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (/[A-Za-z\u0600-\u06FF]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;

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
      ? "#18833B"
      : passwordStrength === 2
        ? "#E28B2D"
        : "#C92835";

  const canSubmit =
    fullName.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    birthDate !== null &&
    phone.length >= 8 &&
    governorate.length > 0 &&
    district.trim().length > 0 &&
    association.length > 0 &&
    selectedDays.length > 0 &&
    selectedPeriods.length > 0 &&
    passwordStrength === 3 &&
    confirmPassword === password &&
    informationConfirmed &&
    approvalConfirmed &&
    termsAccepted &&
    !isSubmitting;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/choose-account" as never);
  };

  const openBirthDatePicker = () => {
    setTemporaryBirthDate(birthDate ?? new Date(2000, 0, 1));
    setShowGovernorates(false);
    setShowAssociations(false);
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
        setErrors((current) => ({ ...current, birthDate: undefined }));
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
    setErrors((current) => ({ ...current, birthDate: undefined }));
  };

  const toggleValue = (
    value: string,
    setter: Dispatch<SetStateAction<string[]>>,
  ) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
    setErrors((current) => ({ ...current, availability: undefined }));
  };

  const pickImage = async (type: UploadType) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: type === "personal" ? [1, 1] : [4, 3],
      quality: 0.85,
    });

    if (result.canceled) {
      return;
    }

    const uri = result.assets[0]?.uri;

    if (!uri) {
      return;
    }

    if (type === "personal") {
      setPersonalPhoto(uri);
      setErrors((current) => ({ ...current, personalPhoto: undefined }));
      return;
    }

    setIdentityPhoto(uri);
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (fullName.trim().length < 3)
      nextErrors.fullName = "يرجى إدخال الاسم الكامل";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }
    if (!birthDate) nextErrors.birthDate = "يرجى اختيار تاريخ الميلاد";
    if (phone.length < 8) nextErrors.phone = "يرجى إدخال رقم هاتف صحيح";
    if (!governorate) nextErrors.governorate = "يرجى اختيار المحافظة";
    if (!district.trim()) nextErrors.district = "يرجى إدخال المنطقة أو الحي";
    if (!association) nextErrors.association = "يرجى اختيار الجمعية";
    if (selectedDays.length === 0 || selectedPeriods.length === 0) {
      nextErrors.availability = "يرجى تحديد أيام وأوقات التوفر";
    }
    if (passwordStrength < 3) {
      nextErrors.password =
        "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وحرف ورقم";
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }
    if (!informationConfirmed) {
      nextErrors.information = "يجب تأكيد صحة المعلومات";
    }
    if (!approvalConfirmed) {
      nextErrors.approval = "يجب الموافقة على مراجعة الجمعية للطلب";
    }
    if (!termsAccepted) {
      nextErrors.terms = "يجب الموافقة على الشروط وسياسة الخصوصية";
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
        accountType: "volunteer",
        fullName: fullName.trim(),
        email: email.trim(),
        birthDate: birthDate?.toISOString() ?? "",
        phone: `+963${phone}`,
        governorate,
        district: district.trim(),
        association,
        transportation,
        availableDays: selectedDays,
        availablePeriods: selectedPeriods,
        nightEmergency,
        personalPhoto,
        identityPhoto,
        password,
      };

      await new Promise((resolve) => setTimeout(resolve, 900));
      void payload;

      router.push({
        pathname: "/verify-registration-phone",
        params: {
          phone: `+963${phone}`,
          accountType: "volunteer",
        },
      } as never);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderError = (message?: string) =>
    message ? <AppText style={styles.errorText}>{message}</AppText> : null;

  const renderSectionHeader = (title: string, spaced = false) => (
    <View style={[styles.sectionHeader, spaced && styles.spacedHeader]}>
      <View style={styles.sectionMarker} />
      <AppText style={styles.sectionTitle}>{title}</AppText>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.screen}>
          <View
            style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}
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

            <AppText style={styles.topBarTitle}>إنشاء حساب متطوع</AppText>
            <View style={styles.topBarSpacer} />
          </View>

          <View
            style={[
              styles.progressArea,
              { paddingHorizontal: horizontalPadding },
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
              { paddingHorizontal: horizontalPadding },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            nestedScrollEnabled
          >
            <View style={[styles.content, { width: contentWidth }]}>
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={23}
                    color="#B85F1F"
                  />
                  <AppText style={styles.reviewTitle}>حول مراجعة الطلب</AppText>
                </View>
                <AppText style={styles.reviewText}>
                  ستقوم الجمعية التي تختارها بمراجعة طلبك. يمكنك استخدام التطبيق
                  كعضو عادي ريثما يتم الرد على طلب انضمامك كمتطوع.
                </AppText>
              </View>

              {renderSectionHeader("المعلومات الشخصية والموقع")}

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
                  />
                </View>
                {renderError(errors.email)}
              </View>

              <View style={styles.fieldGroup}>
                <Pressable
                  onPress={openBirthDatePicker}
                  style={({ pressed }) => [
                    styles.inputContainer,
                    errors.birthDate && styles.inputContainerError,
                    pressed && styles.pressedField,
                  ]}
                >
                  <Ionicons name="calendar-outline" size={22} color="#4D514A" />
                  <AppText
                    style={[
                      styles.selectText,
                      !birthDate && styles.selectPlaceholder,
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
                    />
                  </View>
                </View>
                {renderError(errors.phone)}
              </View>

              <View style={styles.fieldGroup}>
                <Pressable
                  onPress={() => {
                    setShowGovernorates((current) => !current);
                    setShowAssociations(false);
                  }}
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

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.district && styles.inputContainerError,
                  ]}
                >
                  <TextInput
                    value={district}
                    onChangeText={(value) => {
                      setDistrict(value);
                      setErrors((current) => ({
                        ...current,
                        district: undefined,
                      }));
                    }}
                    placeholder="المنطقة / الحي"
                    placeholderTextColor="#777B75"
                    textAlign="right"
                    style={styles.input}
                  />
                </View>
                {renderError(errors.district)}
              </View>

              {renderSectionHeader("الجمعية التي تنتمي إليها", true)}

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.association && styles.inputContainerError,
                  ]}
                >
                  <Ionicons name="search-outline" size={23} color="#4D514A" />
                  <TextInput
                    value={associationSearch}
                    onFocus={() => {
                      setShowAssociations(true);
                      setShowGovernorates(false);
                    }}
                    onChangeText={(value) => {
                      setAssociationSearch(value);
                      setAssociation("");
                      setShowAssociations(true);
                      setErrors((current) => ({
                        ...current,
                        association: undefined,
                      }));
                    }}
                    placeholder="إبحث عن اسم الجمعية..."
                    placeholderTextColor="#777B75"
                    textAlign="right"
                    style={styles.input}
                  />
                </View>

                {showAssociations ? (
                  <View style={styles.dropdown}>
                    <ScrollView
                      nestedScrollEnabled
                      showsVerticalScrollIndicator
                      keyboardShouldPersistTaps="handled"
                      contentContainerStyle={styles.dropdownContent}
                    >
                      {filteredAssociations.length > 0 ? (
                        filteredAssociations.map((item) => (
                          <Pressable
                            key={item}
                            onPress={() => {
                              setAssociation(item);
                              setAssociationSearch(item);
                              setShowAssociations(false);
                            }}
                            style={({ pressed }) => [
                              styles.dropdownItem,
                              association === item &&
                                styles.selectedDropdownItem,
                              pressed && styles.dropdownItemPressed,
                            ]}
                          >
                            <AppText style={styles.dropdownItemText}>
                              {item}
                            </AppText>
                            {association === item ? (
                              <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color="#16833A"
                              />
                            ) : null}
                          </Pressable>
                        ))
                      ) : (
                        <AppText style={styles.emptyDropdownText}>
                          لا توجد نتائج مطابقة
                        </AppText>
                      )}
                    </ScrollView>
                  </View>
                ) : null}
                {renderError(errors.association)}
              </View>

              {renderSectionHeader("التنقل والتوفر", true)}

              <View style={styles.transportRow}>
                {[
                  { id: "car", label: "سيارة", icon: "car-outline" as const },
                  {
                    id: "bike",
                    label: "دراجة",
                    icon: "bicycle-outline" as const,
                  },
                ].map((item) => {
                  const selected = transportation === item.id;
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() =>
                        setTransportation(item.id as "car" | "bike")
                      }
                      style={[
                        styles.transportChip,
                        selected && styles.selectedTransportChip,
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={19}
                        color={selected ? "#FF7B32" : "#555B55"}
                      />
                      <AppText
                        style={[
                          styles.transportText,
                          selected && styles.selectedTransportText,
                        ]}
                      >
                        {item.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>

              <AppText style={styles.subLabel}>
                أيام التوفر خلال الأسبوع
              </AppText>

              <View style={styles.daysRow}>
                {WEEK_DAYS.map((day) => {
                  const selected = selectedDays.includes(day.id);
                  return (
                    <Pressable
                      key={day.id}
                      onPress={() => toggleValue(day.id, setSelectedDays)}
                      style={[
                        styles.dayChip,
                        selected && styles.selectedDayChip,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.dayText,
                          selected && styles.selectedDayText,
                        ]}
                      >
                        {day.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.periodsRow}>
                {PERIODS.map((period) => {
                  const selected = selectedPeriods.includes(period.id);
                  return (
                    <Pressable
                      key={period.id}
                      onPress={() => toggleValue(period.id, setSelectedPeriods)}
                      style={[
                        styles.periodChip,
                        selected && styles.selectedPeriodChip,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.periodText,
                          selected && styles.selectedPeriodText,
                        ]}
                      >
                        {period.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
              {renderError(errors.availability)}

              <View style={styles.emergencyRow}>
                <View style={styles.emergencyLabelWrap}>
                  <Ionicons name="medical-outline" size={18} color="#758076" />
                  <AppText style={styles.emergencyLabel}>
                    متاح لحالات الطوارئ الليلية؟
                  </AppText>
                </View>
                <Switch
                  value={nightEmergency}
                  onValueChange={setNightEmergency}
                  trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {renderSectionHeader("تأكيد العضوية", true)}

              <Pressable
                onPress={() => pickImage("personal")}
                style={styles.uploadCard}
              >
                {personalPhoto ? (
                  <Image
                    source={{ uri: personalPhoto }}
                    style={styles.uploadPreview}
                  />
                ) : (
                  <Ionicons name="camera-outline" size={35} color="#7B877B" />
                )}
                <AppText style={styles.uploadTitle}>رفع صورة شخصية</AppText>
                <AppText style={styles.uploadSubtitle}>
                  اختياري - لإتمام ملفك الشخصي
                </AppText>
              </Pressable>

              <Pressable
                onPress={() => pickImage("identity")}
                style={styles.uploadCard}
              >
                {identityPhoto ? (
                  <Image
                    source={{ uri: identityPhoto }}
                    style={styles.uploadPreview}
                  />
                ) : (
                  <Ionicons name="camera-outline" size={35} color="#7B877B" />
                )}
                <AppText style={styles.uploadTitle}>رفع وثيقة العضوية</AppText>
                <AppText style={styles.uploadSubtitle}>
                  اختياري - لتأكيد العضوية بحال وجود الوثيقة
                </AppText>
              </Pressable>

              {renderSectionHeader("كلمة المرور", true)}

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
                  />
                  <Pressable
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
                    { color: passwordStrengthColor },
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
                  />
                  <Pressable
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

              <View style={styles.fieldGroup}>
                <View style={styles.afterSubmitCard}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: showAfterSubmitInfo }}
                    onPress={() =>
                      setShowAfterSubmitInfo((current) => !current)
                    }
                    style={({ pressed }) => [
                      styles.afterSubmitHeader,
                      pressed && styles.afterSubmitHeaderPressed,
                    ]}
                  >
                    <View style={styles.afterSubmitTitleWrap}>
                      <Ionicons
                        name="help-circle-outline"
                        size={22}
                        color="#555B55"
                      />

                      <AppText style={styles.afterSubmitTitle}>
                        ماذا يحدث بعد إرسال الطلب؟
                      </AppText>
                    </View>

                    <Ionicons
                      name={
                        showAfterSubmitInfo
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      size={20}
                      color="#555B55"
                    />
                  </Pressable>

                  {showAfterSubmitInfo ? (
                    <View style={styles.afterSubmitContent}>
                      <View style={styles.afterSubmitItem}>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={19}
                          color="#16833A"
                        />

                        <AppText style={styles.afterSubmitText}>
                          يتم إرسال طلب التطوع إلى الجمعية التي اخترتها
                          لمراجعته.
                        </AppText>
                      </View>

                      <View style={styles.afterSubmitItem}>
                        <Ionicons
                          name="time-outline"
                          size={19}
                          color="#16833A"
                        />

                        <AppText style={styles.afterSubmitText}>
                          يمكنك استخدام التطبيق كحساب مستخدم عادي أثناء انتظار
                          الرد.
                        </AppText>
                      </View>

                      <View style={styles.afterSubmitItem}>
                        <Ionicons
                          name="notifications-outline"
                          size={19}
                          color="#16833A"
                        />

                        <AppText style={styles.afterSubmitText}>
                          سيصلك إشعار عند قبول الطلب أو رفضه، وقد تتواصل معك
                          الجمعية لطلب معلومات إضافية.
                        </AppText>
                      </View>
                    </View>
                  ) : null}
                </View>

                {[
                  {
                    value: informationConfirmed,
                    setter: setInformationConfirmed,
                    error: "information" as const,
                    text: "أؤكد أن جميع المعلومات المدخلة صحيحة وسأقوم بتحديثها عند الحاجة.",
                  },
                  {
                    value: approvalConfirmed,
                    setter: setApprovalConfirmed,
                    error: "approval" as const,
                    text: "أدرك أن تفعيل حساب المتطوع يخضع لموافقة الجمعية بعد مراجعة الطلب.",
                  },
                  {
                    value: termsAccepted,
                    setter: setTermsAccepted,
                    error: "terms" as const,
                    text: "أوافق على الشروط والأحكام وسياسة الخصوصية.",
                  },
                ].map((item) => (
                  <View key={item.error}>
                    <Pressable
                      onPress={() => {
                        item.setter((current) => !current);
                        setErrors((current) => ({
                          ...current,
                          [item.error]: undefined,
                        }));
                      }}
                      style={styles.checkboxRow}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          item.value && styles.checkboxSelected,
                        ]}
                      >
                        {item.value ? (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FFFFFF"
                          />
                        ) : null}
                      </View>
                      <AppText style={styles.checkboxText}>{item.text}</AppText>
                    </Pressable>
                    {renderError(errors[item.error])}
                  </View>
                ))}

                <Button
                  title="إنشاء الحساب وإرسال الطلب"
                  onPress={handleSubmit}
                  variant="custom"
                  size="large"
                  fullWidth
                  loading={isSubmitting}
                  loadingText="جاري إرسال الطلب..."
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
                    <AppText style={styles.loginHighlight}>
                      تسجيل الدخول
                    </AppText>
                  </AppText>
                </Pressable>
              </View>
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
                style={styles.dateModalAction}
              >
                <AppText style={styles.dateModalCancel}>إلغاء</AppText>
              </Pressable>
              <AppText style={styles.dateModalTitle}>تاريخ الميلاد</AppText>
              <Pressable
                onPress={confirmBirthDate}
                style={styles.dateModalAction}
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
  safeArea: { flex: 1, backgroundColor: "#FBFAFE" },
  keyboardView: { flex: 1 },
  screen: { flex: 1, backgroundColor: "#FBFAFE" },
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
  topBarSpacer: { width: 46, height: 46 },
  backButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: "#EFEFF1",
  },
  backButtonPressed: { opacity: 0.65, transform: [{ scale: 0.94 }] },
  progressArea: { paddingTop: 4, paddingBottom: 18 },
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
  scrollView: { flex: 1 },
  scrollContent: { alignItems: "center", paddingBottom: 38 },
  content: { alignSelf: "center" },
  reviewCard: {
    width: "100%",
    marginBottom: 22,
    paddingHorizontal: 17,
    paddingVertical: 16,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#F1C9AA",
    backgroundColor: "#FFF4EB",
  },
  reviewHeader: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 7,
  },
  reviewTitle: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#A7551E",
    textAlign: "right",
    writingDirection: "rtl",
  },
  reviewText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 22,
    color: "#7B4B2B",
    textAlign: "left",
    writingDirection: "rtl",
  },
  sectionHeader: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 9,
    marginBottom: 18,
  },
  spacedHeader: { marginTop: 25 },
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
  fieldGroup: { width: "100%", marginBottom: 16 },
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
  inputContainerError: { borderColor: "#C92335" },
  pressedField: { opacity: 0.72 },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: "#2F332F",
    writingDirection: "rtl",
  },
  selectText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: "#2F332F",
    textAlign: "left",
    writingDirection: "rtl",
  },
  selectPlaceholder: { color: "#777B75" },
  phoneRow: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phoneInputContainer: { flex: 1, width: undefined },
  countryCodeBox: {
    width: 72,
    minHeight: 57,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#A4ADA2",
    backgroundColor: "#F1F2EE",
  },
  countryCodeText: { fontFamily: FONTS.medium, fontSize: 15, color: "#687067" },
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
  selectedDropdownItem: { backgroundColor: "#F1F8F3" },
  dropdownItemPressed: { opacity: 0.66 },
  dropdownItemText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: "#333833",
    textAlign: "left",
    writingDirection: "rtl",
  },
  emptyDropdownText: {
    paddingHorizontal: 14,
    paddingVertical: 18,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: "#777B75",
    textAlign: "center",
    writingDirection: "rtl",
  },
  transportRow: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 9,
    marginBottom: 24,
  },
  transportChip: {
    minHeight: 40,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#727A73",
    backgroundColor: "#FFFFFF",
  },
  selectedTransportChip: { borderColor: "#FF8849", backgroundColor: "#FFF0E7" },
  transportText: { fontFamily: FONTS.regular, fontSize: 14, color: "#444A44" },
  selectedTransportText: { color: "#FF7B32" },
  subLabel: {
    width: "100%",
    marginBottom: 12,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: "#343934",
    textAlign: "left",
    writingDirection: "rtl",
  },
  daysRow: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  dayChip: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: "#E9E9E6",
  },
  selectedDayChip: { backgroundColor: "#FF8849" },
  dayText: { fontFamily: FONTS.medium, fontSize: 14, color: "#656B65" },
  selectedDayText: { color: "#FFFFFF" },
  periodsRow: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    marginBottom: 18,
  },
  periodChip: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#E7F0E9",
  },
  selectedPeriodChip: { backgroundColor: "#B9D8C1" },
  periodText: { fontFamily: FONTS.regular, fontSize: 13, color: "#3D6948" },
  selectedPeriodText: { fontFamily: FONTS.medium, color: "#1B6631" },
  emergencyRow: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "#F4F2ED",
  },
  emergencyLabelWrap: {
    flex: 1,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emergencyLabel: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: "#3C413C",
    textAlign: "left",
    writingDirection: "rtl",
  },
  uploadCard: {
    width: "100%",
    minHeight: 125,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 13,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#B8C9B5",
    backgroundColor: "#FBFAFE",
  },
  uploadPreview: { width: 58, height: 58, marginBottom: 8, borderRadius: 12 },
  uploadTitle: {
    marginTop: 4,
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#353A35",
    textAlign: "center",
    writingDirection: "rtl",
  },
  uploadSubtitle: {
    marginTop: 5,
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#828982",
    textAlign: "center",
    writingDirection: "rtl",
  },
  passwordStrengthHeader: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -2,
    marginBottom: 7,
  },
  passwordStrengthTitle: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#5B615B",
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
    direction: "rtl",
    flexDirection: "row",
    gap: 6,
    marginBottom: 15,
  },
  passwordBar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#E1E1DE",
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
    color: "#575D57",
    textAlign: "left",
    writingDirection: "rtl",
  },
  checkboxRow: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#C7CEC5",
    backgroundColor: "#FFFFFF",
  },
  checkboxSelected: { borderColor: "#16833A", backgroundColor: "#16833A" },
  checkboxText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 20,
    color: "#555B55",
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
  submitButton: { width: "100%", height: 58, minHeight: 58, marginTop: 17 },
  submitButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    textAlign: "center",
  },
  loginLink: {
    alignSelf: "center",
    marginTop: 17,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginLinkPressed: { opacity: 0.55 },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#706864",
    textAlign: "center",
    writingDirection: "rtl",
  },
  loginHighlight: { fontFamily: FONTS.medium, color: "#FF7B32" },
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
  iosDatePicker: { width: "100%" },
  afterSubmitCard: {
    width: "100%",
    overflow: "hidden",
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D8D9CE",
    backgroundColor: "#F8F7F1",
  },

  afterSubmitHeader: {
    width: "100%",
    minHeight: 58,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  afterSubmitHeaderPressed: {
    opacity: 0.65,
  },

  afterSubmitTitleWrap: {
    flex: 1,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  afterSubmitTitle: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#373C37",
    textAlign: "left",
    writingDirection: "rtl",
  },

  afterSubmitContent: {
    width: "100%",
    gap: 12,
    paddingHorizontal: 15,
    paddingTop: 2,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DDDED5",
  },

  afterSubmitItem: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },

  afterSubmitText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 20,
    color: "#5B615B",
    textAlign: "left",
    writingDirection: "rtl",
  },
});
