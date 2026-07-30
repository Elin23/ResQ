<<<<<<< HEAD
export { default } from "@/src/features/auth/screens/RegisterEntityScreen";
=======
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
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
import MapView, { MapPressEvent, Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/AppText";
import Button from "@/src/components/Button";
import { FONTS } from "@/src/constants/theme";

type EntityType = "clinic" | "organization";
type UploadKey = "logo" | "license" | "manager" | "extra";
type Errors = Partial<
  Record<
    | "fullName"
    | "email"
    | "birthDate"
    | "phone"
    | "entityName"
    | "entityCategory"
    | "licenseNumber"
    | "issuingAuthority"
    | "description"
    | "serviceGovernorate"
    | "serviceDistrict"
    | "mapLocation"
    | "activities"
    | "animals"
    | "workingHours"
    | "shelterCapacity"
    | "volunteerRequirements"
    | "licenseDocument"
    | "password"
    | "confirmPassword"
    | "information"
    | "verification"
    | "terms",
    string
  >
>;

type ChipOption = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
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

const ORGANIZATION_TYPES = [
  "جمعية مرخصة",
  "منظمة غير ربحية",
  "فريق إنقاذ مسجل",
  "مأوى حيوانات",
  "مبادرة مجتمعية",
];

const CLINIC_TYPES = [
  "عيادة بيطرية عامة",
  "مشفى بيطري",
  "مركز لقاحات ورعاية",
  "عيادة تخصصية",
  "مركز إسعاف بيطري",
];

const ORGANIZATION_ACTIVITIES: ChipOption[] = [
  { id: "rescue", label: "إنقاذ ميداني", icon: "paw-outline" },
  { id: "shelter", label: "إيواء", icon: "home-outline" },
  { id: "adoption", label: "تبنّي", icon: "heart-outline" },
  { id: "awareness", label: "توعية", icon: "megaphone-outline" },
  { id: "treatment", label: "علاج", icon: "medkit-outline" },
];

const CLINIC_SERVICES: ChipOption[] = [
  { id: "emergency", label: "إسعاف", icon: "medical-outline" },
  { id: "examination", label: "فحص", icon: "search-outline" },
  { id: "vaccination", label: "لقاحات", icon: "shield-checkmark-outline" },
  { id: "surgery", label: "جراحة", icon: "cut-outline" },
  { id: "laboratory", label: "تحاليل", icon: "flask-outline" },
  { id: "imaging", label: "تصوير", icon: "scan-outline" },
];

const ORGANIZATION_ANIMALS: ChipOption[] = [
  { id: "cats", label: "قطط", icon: "paw-outline" },
  { id: "dogs", label: "كلاب", icon: "paw-outline" },
  { id: "birds", label: "طيور", icon: "leaf-outline" },
  { id: "other", label: "أخرى", icon: "add-circle-outline" },
];

const CLINIC_ANIMALS: ChipOption[] = [
  { id: "pets", label: "حيوانات أليفة", icon: "paw-outline" },
  { id: "birds", label: "طيور", icon: "leaf-outline" },
  { id: "farm", label: "حيوانات مزرعة", icon: "nutrition-outline" },
  { id: "other", label: "أخرى", icon: "add-circle-outline" },
];

export default function RegisterEntityScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ entityType?: string }>();
  const { width } = useWindowDimensions();

  const entityType: EntityType =
    params.entityType === "clinic" ? "clinic" : "organization";
  const isClinic = entityType === "clinic";
  const entityTitle = isClinic ? "عيادة" : "جمعية / منظمة";

  const horizontalPadding = Math.max(17, Math.min(width * 0.048, 30));
  const contentWidth = Math.min(width - horizontalPadding * 2, 560);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [temporaryBirthDate, setTemporaryBirthDate] = useState(
    new Date(1990, 0, 1),
  );
  const [phone, setPhone] = useState("");
  const [entityName, setEntityName] = useState("");
  const [entityCategory, setEntityCategory] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [description, setDescription] = useState("");
  const [serviceGovernorate, setServiceGovernorate] = useState("");
  const [serviceDistrict, setServiceDistrict] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);

  const [hasShelter, setHasShelter] = useState(false);
  const [shelterCapacity, setShelterCapacity] = useState("");
  const [acceptsVolunteers, setAcceptsVolunteers] = useState(true);
  const [volunteerRequirements, setVolunteerRequirements] = useState("");

  const [open24Hours, setOpen24Hours] = useState(false);
  const [workingHours, setWorkingHours] = useState("");
  const [homeVisits, setHomeVisits] = useState(false);
  const [emergencyService, setEmergencyService] = useState(false);

  const [logo, setLogo] = useState<string | null>(null);
  const [licenseDocument, setLicenseDocument] = useState<string | null>(null);
  const [managerDocument, setManagerDocument] = useState<string | null>(null);
  const [extraDocument, setExtraDocument] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [informationConfirmed, setInformationConfirmed] = useState(false);
  const [verificationConfirmed, setVerificationConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showServiceGovernorates, setShowServiceGovernorates] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 33.5138,
    longitude: 36.2765,
    latitudeDelta: 0.08,
    longitudeDelta: 0.08,
  });
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [temporaryLocation, setTemporaryLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const maximumBirthDate = useMemo(() => new Date(), []);
  const minimumBirthDate = useMemo(() => new Date(1900, 0, 1), []);

  const formattedBirthDate = useMemo(() => {
    if (!birthDate) return "";
    return new Intl.DateTimeFormat("ar-SY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(birthDate);
  }, [birthDate]);

  const categories = isClinic ? CLINIC_TYPES : ORGANIZATION_TYPES;
  const activityOptions = isClinic ? CLINIC_SERVICES : ORGANIZATION_ACTIVITIES;
  const animalOptions = isClinic ? CLINIC_ANIMALS : ORGANIZATION_ANIMALS;

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
    /^9\d{8}$/.test(phone) &&
    entityName.trim().length >= 3 &&
    entityCategory.length > 0 &&
    licenseNumber.trim().length >= 3 &&
    issuingAuthority.trim().length >= 3 &&
    description.trim().length >= 20 &&
    serviceGovernorate.length > 0 &&
    serviceDistrict.trim().length >= 2 &&
    selectedLocation !== null &&
    selectedActivities.length > 0 &&
    selectedAnimals.length > 0 &&
    licenseDocument !== null &&
    passwordStrength === 3 &&
    confirmPassword === password &&
    (!isClinic || open24Hours || workingHours.trim().length >= 3) &&
    (isClinic || !hasShelter || Number(shelterCapacity) > 0) &&
    informationConfirmed &&
    verificationConfirmed &&
    termsAccepted &&
    !isSubmitting;

  const closeDropdowns = () => {
    setShowServiceGovernorates(false);
    setShowCategories(false);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/choose-account" as never);
  };

  const openBirthDatePicker = () => {
    setTemporaryBirthDate(birthDate ?? new Date(1990, 0, 1));
    closeDropdowns();
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
    if (selectedDate) setTemporaryBirthDate(selectedDate);
  };

  const confirmBirthDate = () => {
    setBirthDate(temporaryBirthDate);
    setShowBirthDatePicker(false);
    setErrors((current) => ({ ...current, birthDate: undefined }));
  };

  const toggleValue = (
    value: string,
    current: string[],
    setter: (value: string[]) => void,
    key: "activities" | "animals",
  ) => {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
    setErrors((state) => ({ ...state, [key]: undefined }));
  };

  const pickImage = async (key: UploadKey) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: key === "logo" ? [1, 1] : [4, 3],
      quality: 0.85,
    });

    if (result.canceled) return;
    const uri = result.assets[0]?.uri;
    if (!uri) return;

    if (key === "logo") setLogo(uri);
    if (key === "license") {
      setLicenseDocument(uri);
      setErrors((current) => ({ ...current, licenseDocument: undefined }));
    }
    if (key === "manager") setManagerDocument(uri);
    if (key === "extra") setExtraDocument(uri);
  };

  const openMapPicker = () => {
    closeDropdowns();

    const initialLocation = selectedLocation ?? {
      latitude: mapRegion.latitude,
      longitude: mapRegion.longitude,
    };

    setTemporaryLocation(initialLocation);
    setMapRegion((current) => ({
      ...current,
      latitude: initialLocation.latitude,
      longitude: initialLocation.longitude,
    }));
    setShowMapPicker(true);
  };

  const handleMapPress = (event: MapPressEvent) => {
    setTemporaryLocation(event.nativeEvent.coordinate);
  };

  const useCurrentLocation = async () => {
    try {
      setIsLocating(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coordinate = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setTemporaryLocation(coordinate);
      setMapRegion({
        ...coordinate,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } finally {
      setIsLocating(false);
    }
  };

  const confirmMapLocation = () => {
    if (!temporaryLocation) {
      return;
    }

    setSelectedLocation(temporaryLocation);
    setShowMapPicker(false);
    setErrors((current) => ({ ...current, mapLocation: undefined }));
  };

  const validateForm = () => {
    const nextErrors: Errors = {};

    if (!fullName.trim()) nextErrors.fullName = "الاسم الكامل مطلوب";
    else if (fullName.trim().length < 3)
      nextErrors.fullName = "يجب أن يتكون الاسم من 3 أحرف على الأقل";
    if (!email.trim()) nextErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      nextErrors.email =
        "صيغة البريد الإلكتروني غير صحيحة، مثال: name@example.com";
    if (!birthDate) nextErrors.birthDate = "يرجى اختيار تاريخ الميلاد";
    if (!phone) nextErrors.phone = "رقم الهاتف مطلوب";
    else if (!/^9\d{8}$/.test(phone))
      nextErrors.phone = "أدخل 9 أرقام ويجب أن يبدأ الرقم بالرقم 9";
    if (entityName.trim().length < 3)
      nextErrors.entityName = `يرجى إدخال اسم ${entityTitle}`;
    if (!entityCategory)
      nextErrors.entityCategory = `يرجى اختيار نوع ${entityTitle}`;
    if (!licenseNumber.trim()) nextErrors.licenseNumber = "رقم الترخيص مطلوب";
    else if (licenseNumber.trim().length < 3)
      nextErrors.licenseNumber = "رقم الترخيص قصير جدًا";
    if (!issuingAuthority.trim())
      nextErrors.issuingAuthority = "جهة إصدار الترخيص مطلوبة";
    else if (issuingAuthority.trim().length < 3)
      nextErrors.issuingAuthority = "يرجى كتابة اسم جهة الإصدار بشكل أوضح";
    if (description.trim().length < 20)
      nextErrors.description = "يرجى إضافة نبذة لا تقل عن 20 حرفًا";
    if (!serviceGovernorate)
      nextErrors.serviceGovernorate = "يرجى اختيار محافظة موقع الجهة";
    if (!serviceDistrict.trim())
      nextErrors.serviceDistrict = "المنطقة أو الحي مطلوب";
    else if (serviceDistrict.trim().length < 2)
      nextErrors.serviceDistrict = "يرجى كتابة اسم المنطقة أو الحي بشكل صحيح";
    if (!selectedLocation)
      nextErrors.mapLocation = "يرجى تحديد الموقع بدقة على الخريطة";
    if (selectedActivities.length === 0)
      nextErrors.activities = isClinic
        ? "يرجى اختيار خدمة واحدة على الأقل"
        : "يرجى اختيار نشاط واحد على الأقل";
    if (selectedAnimals.length === 0)
      nextErrors.animals = "يرجى اختيار الحيوانات التي تخدمها الجهة";
    if (isClinic && !open24Hours && workingHours.trim().length < 3)
      nextErrors.workingHours =
        "يرجى إدخال أوقات دوام العيادة أو تفعيل خيار 24 ساعة";
    if (!isClinic && hasShelter && Number(shelterCapacity) <= 0)
      nextErrors.shelterCapacity = "يرجى إدخال سعة صحيحة لمنشأة الإيواء";
    if (
      !isClinic &&
      acceptsVolunteers &&
      volunteerRequirements.trim().length > 0 &&
      volunteerRequirements.trim().length < 10
    )
      nextErrors.volunteerRequirements =
        "اكتب متطلبات التطوع بشكل أوضح أو اترك الحقل فارغًا";
    if (!licenseDocument)
      nextErrors.licenseDocument = "صورة الترخيص مطلوبة للتحقق";
    if (passwordStrength < 3)
      nextErrors.password =
        "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وحرف ورقم";
    if (!confirmPassword) nextErrors.confirmPassword = "يرجى تأكيد كلمة المرور";
    else if (confirmPassword !== password)
      nextErrors.confirmPassword = "كلمتا المرور غير متطابقتين";
    if (!informationConfirmed)
      nextErrors.information = "يجب تأكيد صحة المعلومات";
    if (!verificationConfirmed)
      nextErrors.verification = "يجب الموافقة على مراجعة واعتماد الجهة";
    if (!termsAccepted)
      nextErrors.terms = "يجب الموافقة على الشروط وسياسة الخصوصية";

    setErrors(nextErrors);

    const isValid = Object.keys(nextErrors).length === 0;

    if (!isValid) {
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      });
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setSubmitAttempted(true);

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const sharedPayload = {
        accountType: "entity-admin",
        entityType,
        manager: {
          fullName: fullName.trim(),
          email: email.trim(),
          birthDate: birthDate?.toISOString() ?? "",
          phone: `+963${phone}`,
        },
        entity: {
          name: entityName.trim(),
          category: entityCategory,
          licenseNumber: licenseNumber.trim(),
          issuingAuthority: issuingAuthority.trim(),
          description: description.trim(),
          serviceGovernorate,
          serviceDistrict: serviceDistrict.trim(),
          location: selectedLocation,
          supportedAnimals: selectedAnimals,
          logo,
          licenseDocument,
          managerDocument,
        },
        password,
      };

      const payload = isClinic
        ? {
            ...sharedPayload,
            clinicDetails: {
              services: selectedActivities,
              open24Hours,
              workingHours: open24Hours ? "24/7" : workingHours.trim(),
              homeVisits,
              emergencyService,
              doctorLicenseDocument: extraDocument,
            },
          }
        : {
            ...sharedPayload,
            organizationDetails: {
              activities: selectedActivities,
              hasShelter,
              shelterCapacity: hasShelter ? shelterCapacity : "",
              acceptsVolunteers,
              volunteerRequirements: acceptsVolunteers
                ? volunteerRequirements.trim()
                : "",
              policyDocument: extraDocument,
            },
          };

      await new Promise((resolve) => setTimeout(resolve, 900));
      void payload;

      router.push({
        pathname: "/verify-registration-phone",
        params: {
          phone: `+963${phone}`,
          accountType: "entity",
          entityType,
          name: entityName.trim(),
          email: email.trim(),
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

  const renderDropdown = (
    items: string[],
    value: string,
    onSelect: (item: string) => void,
  ) => (
    <View style={styles.dropdown}>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.dropdownContent}
      >
        {items.map((item) => (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
            style={({ pressed }) => [
              styles.dropdownItem,
              value === item && styles.selectedDropdownItem,
              pressed && styles.dropdownItemPressed,
            ]}
          >
            <AppText style={styles.dropdownItemText}>{item}</AppText>
            {value === item ? (
              <Ionicons name="checkmark-circle" size={20} color="#16833A" />
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderChips = (
    options: ChipOption[],
    selected: string[],
    onToggle: (id: string) => void,
  ) => (
    <View style={styles.choiceWrap}>
      {options.map((item) => {
        const active = selected.includes(item.id);
        return (
          <Pressable
            key={item.id}
            onPress={() => onToggle(item.id)}
            style={[styles.choiceChip, active && styles.selectedChoiceChip]}
          >
            <Ionicons
              name={item.icon}
              size={18}
              color={active ? "#FFFFFF" : "#646A64"}
            />
            <AppText
              style={[styles.choiceText, active && styles.selectedChoiceText]}
            >
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );

  const renderUploadCard = (
    key: UploadKey,
    title: string,
    subtitle: string,
    uri: string | null,
    required = false,
  ) => (
    <Pressable
      onPress={() => pickImage(key)}
      style={[
        styles.uploadCard,
        required && errors.licenseDocument && styles.uploadCardError,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.uploadPreview} />
      ) : (
        <Ionicons name="document-attach-outline" size={30} color="#7B877B" />
      )}
      <View style={styles.uploadTextWrap}>
        <AppText style={styles.uploadTitle}>{title}</AppText>
        <AppText style={styles.uploadSubtitle}>{subtitle}</AppText>
      </View>
      <View style={styles.uploadButton}>
        <AppText style={styles.uploadButtonText}>
          {uri ? "تم الرفع" : "رفع الملف"}
        </AppText>
      </View>
    </Pressable>
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
            <AppText style={styles.topBarTitle}>
              إنشاء حساب {entityTitle}
            </AppText>
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
            ref={scrollViewRef}
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
              {submitAttempted && Object.keys(errors).length > 0 ? (
                <View style={styles.formErrorSummary}>
                  <Ionicons name="alert-circle" size={22} color="#B42335" />
                  <View style={styles.formErrorSummaryTextWrap}>
                    <AppText style={styles.formErrorSummaryTitle}>
                      تعذر إرسال الطلب
                    </AppText>
                    <AppText style={styles.formErrorSummaryText}>
                      راجع الحقول المحددة باللون الأحمر وأكمل المعلومات
                      المطلوبة.
                    </AppText>
                  </View>
                </View>
              ) : null}

              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color="#B85F1F"
                  />
                  <AppText style={styles.reviewTitle}>
                    حول اعتماد {entityTitle}
                  </AppText>
                </View>
                <AppText style={styles.reviewText}>
                  سيقوم فريق ResQ بمراجعة الوثائق والمعلومات الرسمية قبل إظهار{" "}
                  {isClinic ? "العيادة" : "الجمعية"} على الخريطة وتفعيل ميزاتها
                  داخل التطبيق.
                </AppText>
              </View>

              {renderSectionHeader("المعلومات الشخصية")}

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

              {renderSectionHeader(
                isClinic ? "بيانات العيادة الرسمية" : "بيانات المنظمة الرسمية",
                true,
              )}

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.entityName && styles.inputContainerError,
                  ]}
                >
                  <TextInput
                    value={entityName}
                    onChangeText={(value) => {
                      setEntityName(value);
                      setErrors((current) => ({
                        ...current,
                        entityName: undefined,
                      }));
                    }}
                    placeholder={
                      isClinic
                        ? "الاسم المعتمد للعيادة"
                        : "الاسم المعتمد للمنظمة"
                    }
                    placeholderTextColor="#777B75"
                    textAlign="right"
                    style={styles.input}
                  />
                </View>
                {renderError(errors.entityName)}
              </View>

              <View style={styles.fieldGroup}>
                <Pressable
                  onPress={() => {
                    closeDropdowns();
                    setShowCategories((current) => !current);
                  }}
                  style={[
                    styles.inputContainer,
                    errors.entityCategory && styles.inputContainerError,
                  ]}
                >
                  <AppText
                    style={[
                      styles.selectText,
                      !entityCategory && styles.selectPlaceholder,
                    ]}
                  >
                    {entityCategory ||
                      (isClinic ? "نوع العيادة" : "نوع الكيان")}
                  </AppText>
                  <Ionicons
                    name={
                      showCategories
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={20}
                    color="#4D514A"
                  />
                </Pressable>
                {showCategories
                  ? renderDropdown(categories, entityCategory, (item) => {
                      setEntityCategory(item);
                      setShowCategories(false);
                      setErrors((current) => ({
                        ...current,
                        entityCategory: undefined,
                      }));
                    })
                  : null}
                {renderError(errors.entityCategory)}
              </View>

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.licenseNumber && styles.inputContainerError,
                  ]}
                >
                  <TextInput
                    value={licenseNumber}
                    onChangeText={(value) => {
                      setLicenseNumber(value);
                      setErrors((current) => ({
                        ...current,
                        licenseNumber: undefined,
                      }));
                    }}
                    placeholder={
                      isClinic
                        ? "رقم ترخيص العيادة"
                        : "رقم الترخيص، مثال: RGE-2024-XXXX"
                    }
                    placeholderTextColor="#777B75"
                    textAlign="right"
                    style={styles.input}
                  />
                </View>
                {renderError(errors.licenseNumber)}
              </View>

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.issuingAuthority && styles.inputContainerError,
                  ]}
                >
                  <TextInput
                    value={issuingAuthority}
                    onChangeText={(value) => {
                      setIssuingAuthority(value);
                      setErrors((current) => ({
                        ...current,
                        issuingAuthority: undefined,
                      }));
                    }}
                    placeholder={
                      isClinic
                        ? "جهة الإصدار، مثال: نقابة الأطباء البيطريين"
                        : "جهة الإصدار، مثال: وزارة الشؤون الاجتماعية"
                    }
                    placeholderTextColor="#777B75"
                    textAlign="right"
                    style={styles.input}
                  />
                </View>
                {renderError(errors.issuingAuthority)}
              </View>

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.textAreaContainer,
                    errors.description && styles.inputContainerError,
                  ]}
                >
                  <TextInput
                    value={description}
                    onChangeText={(value) => {
                      setDescription(value.slice(0, 500));
                      setErrors((current) => ({
                        ...current,
                        description: undefined,
                      }));
                    }}
                    placeholder={
                      isClinic
                        ? "نبذة عن العيادة وخبرتها والخدمات التي تقدمها..."
                        : "تعريف بإيجاز عن أهداف الجمعية وتاريخها..."
                    }
                    placeholderTextColor="#777B75"
                    textAlign="right"
                    textAlignVertical="top"
                    multiline
                    maxLength={500}
                    style={styles.textArea}
                  />
                </View>
                <AppText style={styles.counterText}>
                  {description.length} / 500
                </AppText>
                {renderError(errors.description)}
              </View>

              {renderSectionHeader("الموقع ونطاق الخدمة", true)}

              <View style={styles.fieldGroup}>
                <Pressable
                  onPress={() => {
                    closeDropdowns();
                    setShowServiceGovernorates((current) => !current);
                  }}
                  style={[
                    styles.inputContainer,
                    errors.serviceGovernorate && styles.inputContainerError,
                  ]}
                >
                  <Ionicons name="location-outline" size={22} color="#4D514A" />
                  <AppText
                    style={[
                      styles.selectText,
                      !serviceGovernorate && styles.selectPlaceholder,
                    ]}
                  >
                    {serviceGovernorate || "المحافظة"}
                  </AppText>
                  <Ionicons
                    name={
                      showServiceGovernorates
                        ? "chevron-up-outline"
                        : "chevron-down-outline"
                    }
                    size={20}
                    color="#4D514A"
                  />
                </Pressable>
                {showServiceGovernorates
                  ? renderDropdown(GOVERNORATES, serviceGovernorate, (item) => {
                      setServiceGovernorate(item);
                      setShowServiceGovernorates(false);
                      setErrors((current) => ({
                        ...current,
                        serviceGovernorate: undefined,
                      }));
                    })
                  : null}
                {renderError(errors.serviceGovernorate)}
              </View>

              <View style={styles.fieldGroup}>
                <View
                  style={[
                    styles.inputContainer,
                    errors.serviceDistrict && styles.inputContainerError,
                  ]}
                >
                  <Ionicons name="location-outline" size={22} color="#4D514A" />
                  <TextInput
                    value={serviceDistrict}
                    onChangeText={(value) => {
                      setServiceDistrict(value);
                      setErrors((current) => ({
                        ...current,
                        serviceDistrict: undefined,
                      }));
                    }}
                    placeholder="المنطقة / الحي"
                    placeholderTextColor="#777B75"
                    textAlign="right"
                    style={styles.input}
                  />
                </View>
                {renderError(errors.serviceDistrict)}
              </View>

              <View
                style={[
                  styles.mapCard,
                  errors.mapLocation && styles.mapCardError,
                ]}
              >
                <MapView
                  style={styles.mapPreview}
                  region={{
                    latitude: selectedLocation?.latitude ?? mapRegion.latitude,
                    longitude:
                      selectedLocation?.longitude ?? mapRegion.longitude,
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  rotateEnabled={false}
                  pitchEnabled={false}
                  pointerEvents="none"
                >
                  {selectedLocation ? (
                    <Marker coordinate={selectedLocation} />
                  ) : null}
                </MapView>

                {!selectedLocation ? (
                  <View style={styles.mapEmptyState}>
                    <Ionicons name="map-outline" size={52} color="#8F9A8E" />
                    <AppText style={styles.mapEmptyText}>
                      لم يتم تحديد الموقع بعد
                    </AppText>
                  </View>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="تحديد الموقع على الخريطة"
                  onPress={openMapPicker}
                  style={({ pressed }) => [
                    styles.locationButton,
                    pressed && styles.locationButtonPressed,
                  ]}
                >
                  <Ionicons
                    name={
                      selectedLocation ? "create-outline" : "locate-outline"
                    }
                    size={17}
                    color="#4E5B50"
                  />
                  <AppText style={styles.locationButtonText}>
                    {selectedLocation
                      ? "تعديل الموقع على الخريطة"
                      : "تحديد الموقع على الخريطة"}
                  </AppText>
                </Pressable>
              </View>

              {selectedLocation ? (
                <AppText style={styles.coordinateText}>
                  الإحداثيات: {selectedLocation.latitude.toFixed(6)}،{" "}
                  {selectedLocation.longitude.toFixed(6)}
                </AppText>
              ) : null}

              {renderError(errors.mapLocation)}

              <AppText style={styles.helperText}>
                اختر موقع {entityTitle} بدقة، وسيظهر هذا الموقع للمستخدمين على
                الخريطة بعد اعتماد الطلب.
              </AppText>

              {renderSectionHeader(
                isClinic
                  ? "الخدمات والحيوانات التي تعالجها"
                  : "الأنشطة والخدمات المقدمة",
                true,
              )}

              <AppText style={styles.subLabel}>
                {isClinic ? "الخدمات المتوفرة" : "نوع الأنشطة"}
              </AppText>
              {renderChips(activityOptions, selectedActivities, (id) =>
                toggleValue(
                  id,
                  selectedActivities,
                  setSelectedActivities,
                  "activities",
                ),
              )}
              {renderError(errors.activities)}

              <AppText style={[styles.subLabel, styles.subLabelSpacing]}>
                الحيوانات التي تخدمها {entityTitle}
              </AppText>
              {renderChips(animalOptions, selectedAnimals, (id) =>
                toggleValue(id, selectedAnimals, setSelectedAnimals, "animals"),
              )}
              {renderError(errors.animals)}

              {isClinic ? (
                <>
                  <View style={styles.switchCard}>
                    <View style={styles.switchTextWrap}>
                      <AppText style={styles.switchTitle}>
                        هل العيادة مفتوحة 24 ساعة؟
                      </AppText>
                      <AppText style={styles.switchSubtitle}>
                        فعّل الخيار فقط إذا كانت الخدمة متاحة طوال اليوم.
                      </AppText>
                    </View>
                    <Switch
                      value={open24Hours}
                      onValueChange={setOpen24Hours}
                      trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {!open24Hours ? (
                    <View style={styles.fieldGroup}>
                      <View
                        style={[
                          styles.inputContainer,
                          errors.workingHours && styles.inputContainerError,
                        ]}
                      >
                        <Ionicons
                          name="time-outline"
                          size={21}
                          color="#4D514A"
                        />
                        <TextInput
                          value={workingHours}
                          onChangeText={(value) => {
                            setWorkingHours(value);
                            setErrors((current) => ({
                              ...current,
                              workingHours: undefined,
                            }));
                          }}
                          placeholder="أوقات الدوام، مثال: 9 صباحاً - 9 مساءً"
                          placeholderTextColor="#777B75"
                          textAlign="right"
                          style={styles.input}
                        />
                      </View>
                      {renderError(errors.workingHours)}
                    </View>
                  ) : null}

                  <View style={styles.switchCard}>
                    <View style={styles.switchTextWrap}>
                      <AppText style={styles.switchTitle}>
                        هل تتوفر زيارات منزلية؟
                      </AppText>
                      <AppText style={styles.switchSubtitle}>
                        يمكن للمستخدمين طلب زيارة بيطرية للمنزل.
                      </AppText>
                    </View>
                    <Switch
                      value={homeVisits}
                      onValueChange={setHomeVisits}
                      trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  <View style={styles.switchCard}>
                    <View style={styles.switchTextWrap}>
                      <AppText style={styles.switchTitle}>
                        استقبال حالات إسعافية؟
                      </AppText>
                      <AppText style={styles.switchSubtitle}>
                        يظهر هذا الخيار للمستخدمين ضمن معلومات العيادة.
                      </AppText>
                    </View>
                    <Switch
                      value={emergencyService}
                      onValueChange={setEmergencyService}
                      trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.switchCard}>
                    <View style={styles.switchTextWrap}>
                      <AppText style={styles.switchTitle}>
                        هل تتوفر لديكم منشأة إيواء؟
                      </AppText>
                      <AppText style={styles.switchSubtitle}>
                        أضف تفاصيل السعة إذا كانت الجمعية تمتلك مأوى.
                      </AppText>
                    </View>
                    <Switch
                      value={hasShelter}
                      onValueChange={setHasShelter}
                      trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {hasShelter ? (
                    <View style={styles.fieldGroup}>
                      <View
                        style={[
                          styles.inputContainer,
                          errors.shelterCapacity && styles.inputContainerError,
                        ]}
                      >
                        <TextInput
                          value={shelterCapacity}
                          onChangeText={(value) => {
                            setShelterCapacity(
                              value.replace(/\D/g, "").slice(0, 4),
                            );
                            setErrors((current) => ({
                              ...current,
                              shelterCapacity: undefined,
                            }));
                          }}
                          placeholder="سعة منشأة الإيواء"
                          placeholderTextColor="#777B75"
                          keyboardType="number-pad"
                          textAlign="right"
                          style={styles.input}
                        />
                      </View>
                      {renderError(errors.shelterCapacity)}
                    </View>
                  ) : null}

                  <View style={styles.switchCard}>
                    <View style={styles.switchTextWrap}>
                      <AppText style={styles.switchTitle}>
                        تستقبلون متطوعين؟
                      </AppText>
                      <AppText style={styles.switchSubtitle}>
                        يمكن للمستخدمين إرسال طلبات انضمام للجمعية.
                      </AppText>
                    </View>
                    <Switch
                      value={acceptsVolunteers}
                      onValueChange={setAcceptsVolunteers}
                      trackColor={{ false: "#D9DDD7", true: "#B9D7C1" }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {acceptsVolunteers ? (
                    <View style={styles.fieldGroup}>
                      <View
                        style={[
                          styles.textAreaContainer,
                          errors.volunteerRequirements &&
                            styles.inputContainerError,
                        ]}
                      >
                        <TextInput
                          value={volunteerRequirements}
                          onChangeText={(value) => {
                            setVolunteerRequirements(value.slice(0, 350));
                            setErrors((current) => ({
                              ...current,
                              volunteerRequirements: undefined,
                            }));
                          }}
                          placeholder="أدخل شروط أو متطلبات انضمام المتطوعين..."
                          placeholderTextColor="#777B75"
                          multiline
                          maxLength={350}
                          textAlign="right"
                          textAlignVertical="top"
                          style={styles.textArea}
                        />
                      </View>
                      {renderError(errors.volunteerRequirements)}
                    </View>
                  ) : null}
                </>
              )}

              {renderSectionHeader("هوية الجهة والثبوتيات", true)}

              <Pressable
                onPress={() => pickImage("logo")}
                style={styles.logoUploadCard}
              >
                {logo ? (
                  <Image source={{ uri: logo }} style={styles.logoPreview} />
                ) : (
                  <Ionicons name="image-outline" size={35} color="#7B877B" />
                )}
                <AppText style={styles.logoUploadTitle}>
                  شعار {entityTitle} (اختياري)
                </AppText>
                <AppText style={styles.uploadSubtitle}>
                  استخدم صورة واضحة بصيغة JPG أو PNG
                </AppText>
              </Pressable>

              {renderUploadCard(
                "license",
                isClinic ? "صورة ترخيص العيادة" : "شهادة الترخيص الرسمية",
                "صيغة JPG أو PNG وبجودة واضحة",
                licenseDocument,
                true,
              )}
              {renderError(errors.licenseDocument)}

              {renderUploadCard(
                "manager",
                "تفويض مدير الحساب",
                "اختياري إذا لم يكن مقدم الطلب صاحب الترخيص",
                managerDocument,
              )}

              {renderUploadCard(
                "extra",
                isClinic
                  ? "ترخيص الطبيب المسؤول"
                  : "النظام الداخلي أو سياسة الجمعية",
                isClinic
                  ? "اختياري عند توفره"
                  : "اختياري ويساعد في تسريع التحقق",
                extraDocument,
              )}

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

              <View style={styles.confirmationCard}>
                <Pressable
                  onPress={() => {
                    setInformationConfirmed((current) => !current);
                    setErrors((current) => ({
                      ...current,
                      information: undefined,
                    }));
                  }}
                  style={styles.checkboxRow}
                >
                  <View
                    style={[
                      styles.checkbox,
                      informationConfirmed && styles.checkboxSelected,
                    ]}
                  >
                    {informationConfirmed ? (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    ) : null}
                  </View>
                  <AppText style={styles.checkboxText}>
                    أقر أن جميع البيانات والوثائق المقدمة صحيحة وأتحمل مسؤولية
                    المعلومات.
                  </AppText>
                </Pressable>
                {renderError(errors.information)}

                <Pressable
                  onPress={() => {
                    setVerificationConfirmed((current) => !current);
                    setErrors((current) => ({
                      ...current,
                      verification: undefined,
                    }));
                  }}
                  style={styles.checkboxRow}
                >
                  <View
                    style={[
                      styles.checkbox,
                      verificationConfirmed && styles.checkboxSelected,
                    ]}
                  >
                    {verificationConfirmed ? (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    ) : null}
                  </View>
                  <AppText style={styles.checkboxText}>
                    أدرك أن ظهور {entityTitle} وميزاتها يتطلب مراجعة واعتماد
                    فريق ResQ.
                  </AppText>
                </Pressable>
                {renderError(errors.verification)}

                <Pressable
                  onPress={() => {
                    setTermsAccepted((current) => !current);
                    setErrors((current) => ({ ...current, terms: undefined }));
                  }}
                  style={styles.checkboxRow}
                >
                  <View
                    style={[
                      styles.checkbox,
                      termsAccepted && styles.checkboxSelected,
                    ]}
                  >
                    {termsAccepted ? (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    ) : null}
                  </View>
                  <AppText style={styles.checkboxText}>
                    أوافق على{" "}
                    <AppText style={styles.linkText}>
                      شروط استخدام الجهة
                    </AppText>{" "}
                    و<AppText style={styles.linkText}>سياسة الخصوصية</AppText>.
                  </AppText>
                </Pressable>
                {renderError(errors.terms)}
              </View>

              <Button
                title={
                  isClinic
                    ? "إرسال طلب تسجيل العيادة"
                    : "إرسال طلب تسجيل الجمعية"
                }
                onPress={handleSubmit}
                variant="custom"
                size="large"
                fullWidth
                loading={isSubmitting}
                loadingText="جاري إرسال الطلب..."
                disabled={isSubmitting}
                backgroundColor="#FF8849"
                borderColor="#FF8849"
                borderWidth={0}
                textColor="#FFFFFF"
                radius={17}
                style={styles.submitButton}
                textStyle={styles.submitButtonText}
              />

              {!canSubmit && !isSubmitting ? (
                <AppText style={styles.submitHelperText}>
                  يمكنك الضغط على الزر الآن، وسنوضح لك الحقول التي تحتاج إلى
                  تصحيح.
                </AppText>
              ) : null}

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
        visible={showMapPicker}
        animationType="slide"
        onRequestClose={() => setShowMapPicker(false)}
      >
        <SafeAreaView style={styles.mapModalSafeArea} edges={["top", "bottom"]}>
          <View style={styles.mapModalHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إغلاق الخريطة"
              onPress={() => setShowMapPicker(false)}
              style={({ pressed }) => [
                styles.mapModalHeaderButton,
                pressed && styles.mapModalHeaderButtonPressed,
              ]}
            >
              <Ionicons name="close" size={25} color="#332D2A" />
            </Pressable>

            <AppText style={styles.mapModalTitle}>
              تحديد موقع {entityTitle}
            </AppText>

            <View style={styles.mapModalHeaderSpacer} />
          </View>

          <View style={styles.mapPickerWrap}>
            <MapView
              style={styles.mapPicker}
              region={mapRegion}
              onRegionChangeComplete={setMapRegion}
              onPress={handleMapPress}
              showsUserLocation
              showsMyLocationButton={false}
            >
              {temporaryLocation ? (
                <Marker
                  coordinate={temporaryLocation}
                  draggable
                  onDragEnd={(event) =>
                    setTemporaryLocation(event.nativeEvent.coordinate)
                  }
                />
              ) : null}
            </MapView>

            <View style={styles.mapInstructionCard}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color="#B85F1F"
              />
              <AppText style={styles.mapInstructionText}>
                اضغط على الخريطة أو اسحب العلامة لتحديد الموقع بدقة.
              </AppText>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="استخدام موقعي الحالي"
              onPress={useCurrentLocation}
              disabled={isLocating}
              style={({ pressed }) => [
                styles.currentLocationButton,
                pressed && styles.currentLocationButtonPressed,
                isLocating && styles.currentLocationButtonDisabled,
              ]}
            >
              <Ionicons name="navigate-outline" size={21} color="#16833A" />
              <AppText style={styles.currentLocationButtonText}>
                {isLocating ? "جاري تحديد الموقع..." : "استخدام موقعي الحالي"}
              </AppText>
            </Pressable>
          </View>

          <View style={styles.mapModalFooter}>
            <Button
              title="تأكيد الموقع"
              onPress={confirmMapLocation}
              variant="custom"
              size="large"
              fullWidth
              disabled={!temporaryLocation}
              backgroundColor={temporaryLocation ? "#FF8849" : "#EAE8E6"}
              borderColor={temporaryLocation ? "#FF8849" : "#EAE8E6"}
              borderWidth={0}
              textColor={temporaryLocation ? "#FFFFFF" : "#AAA7A3"}
              radius={17}
              style={styles.confirmLocationButton}
              textStyle={styles.submitButtonText}
            />
          </View>
        </SafeAreaView>
      </Modal>

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
  formErrorSummary: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E7AAB2",
    backgroundColor: "#FFF1F3",
  },
  formErrorSummaryTextWrap: {
    flex: 1,
  },
  formErrorSummaryTitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: "#A51F32",
    textAlign: "left",
    writingDirection: "rtl",
  },
  formErrorSummaryText: {
    marginTop: 3,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 19,
    color: "#7F3944",
    textAlign: "left",
    writingDirection: "rtl",
  },
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
    textAlign: "left",
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
  fieldGroup: { width: "100%", marginBottom: 16, marginTop: 16 },
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
  textAreaContainer: {
    width: "100%",
    minHeight: 118,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#7E897D",
    backgroundColor: "#FBFAFE",
  },
  textArea: {
    flex: 1,
    minHeight: 92,
    paddingVertical: 0,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 22,
    color: "#2F332F",
    writingDirection: "rtl",
  },
  counterText: {
    marginTop: 5,
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#7D837D",
    textAlign: "left",
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
  dropdownContent: { flexGrow: 0 },
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
  mapCard: {
    width: "100%",
    height: 190,
    overflow: "hidden",
    marginTop: 2,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7DDD4",
    backgroundColor: "#E9EEE8",
  },
  mapCardError: {
    borderColor: "#C92335",
  },
  mapPreview: {
    width: "100%",
    height: "100%",
  },
  mapEmptyState: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "rgba(233, 238, 232, 0.9)",
  },
  mapEmptyText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#697169",
    textAlign: "center",
    writingDirection: "rtl",
  },
  locationButton: {
    position: "absolute",
    left: 12,
    bottom: 12,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8DDD6",
  },
  locationButtonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  locationButtonText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#4E5B50",
    writingDirection: "rtl",
  },
  coordinateText: {
    width: "100%",
    marginBottom: 7,
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#5F675F",
    textAlign: "left",
    writingDirection: "rtl",
  },
  helperText: {
    width: "100%",
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 18,
    color: "#6E756E",
    textAlign: "left",
    writingDirection: "rtl",
  },
  subLabel: {
    width: "100%",
    marginBottom: 11,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: "#343934",
    textAlign: "left",
    writingDirection: "rtl",
  },
  subLabelSpacing: { marginTop: 17 },
  choiceWrap: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  choiceChip: {
    minHeight: 38,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#727A73",
    backgroundColor: "#FFFFFF",
  },
  selectedChoiceChip: { borderColor: "#FF8849", backgroundColor: "#FF8849" },
  choiceText: { fontFamily: FONTS.regular, fontSize: 13, color: "#4A504A" },
  selectedChoiceText: { color: "#FFFFFF" },
  switchCard: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#F5F4F0",
  },
  switchTextWrap: { flex: 1 },
  switchTitle: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: "#333933",
    textAlign: "left",
    writingDirection: "rtl",
  },
  switchSubtitle: {
    marginTop: 4,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 18,
    color: "#737973",
    textAlign: "left",
    writingDirection: "rtl",
  },
  logoUploadCard: {
    width: "100%",
    minHeight: 125,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 13,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#B8C9B5",
    backgroundColor: "#FBFAFE",
  },
  logoPreview: { width: 58, height: 58, marginBottom: 8, borderRadius: 12 },
  logoUploadTitle: {
    marginTop: 5,
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#353A35",
    textAlign: "center",
    writingDirection: "rtl",
  },
  uploadCard: {
    width: "100%",
    minHeight: 78,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 13,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#CDD4CA",
    backgroundColor: "#FFFFFF",
  },
  uploadCardError: { borderColor: "#C92335" },
  uploadPreview: { width: 44, height: 44, borderRadius: 9 },
  uploadTextWrap: { flex: 1 },
  uploadTitle: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#353A35",
    textAlign: "left",
    writingDirection: "rtl",
  },
  uploadSubtitle: {
    marginTop: 4,
    fontFamily: FONTS.regular,
    fontSize: 10,
    lineHeight: 16,
    color: "#828982",
    textAlign: "left",
    writingDirection: "rtl",
  },
  uploadButton: {
    flexShrink: 0,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FF8849",
    backgroundColor: "#FFF5EE",
  },
  uploadButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: "#FF7B32",
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
  confirmationCard: {
    width: "100%",
    marginTop: 5,
    paddingHorizontal: 14,
    paddingTop: 15,
    paddingBottom: 4,
    borderRadius: 12,
    backgroundColor: "#F8F7F3",
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
  linkText: {
    fontFamily: FONTS.medium,
    color: "#16833A",
    textDecorationLine: "underline",
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
  submitButton: { width: "100%", height: 58, minHeight: 58, marginTop: 20 },
  submitHelperText: {
    marginTop: 8,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 18,
    color: "#7A6B63",
    textAlign: "center",
    writingDirection: "rtl",
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
  loginLinkPressed: { opacity: 0.55 },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#706864",
    textAlign: "center",
    writingDirection: "rtl",
  },
  loginHighlight: { fontFamily: FONTS.medium, color: "#FF7B32" },
  mapModalSafeArea: {
    flex: 1,
    backgroundColor: "#FBFAFE",
  },
  mapModalHeader: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DDDCD9",
  },
  mapModalHeaderButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    backgroundColor: "#EFEFF1",
  },
  mapModalHeaderButtonPressed: {
    opacity: 0.65,
    transform: [{ scale: 0.94 }],
  },
  mapModalTitle: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: "#24201E",
    textAlign: "center",
    writingDirection: "rtl",
  },
  mapModalHeaderSpacer: {
    width: 46,
    height: 46,
  },
  mapPickerWrap: {
    flex: 1,
  },
  mapPicker: {
    ...StyleSheet.absoluteFillObject,
  },
  mapInstructionCard: {
    position: "absolute",
    top: 14,
    left: 14,
    right: 14,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1C9AA",
    backgroundColor: "rgba(255, 244, 235, 0.96)",
  },
  mapInstructionText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 19,
    color: "#7B4B2B",
    textAlign: "left",
    writingDirection: "rtl",
  },
  currentLocationButton: {
    position: "absolute",
    right: 14,
    bottom: 18,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#BDD2C1",
    backgroundColor: "#FFFFFF",
  },
  currentLocationButtonPressed: {
    opacity: 0.72,
  },
  currentLocationButtonDisabled: {
    opacity: 0.55,
  },
  currentLocationButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#16833A",
    writingDirection: "rtl",
  },
  mapModalFooter: {
    paddingHorizontal: 17,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DDDCD9",
    backgroundColor: "#FBFAFE",
  },
  confirmLocationButton: {
    width: "100%",
    minHeight: 56,
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
});
>>>>>>> 5f4a354c8632b09b2c8785d2eebd30ffed989cf6
