<<<<<<< HEAD
export { default } from "@/src/features/public/screens/ContactUsScreen";
=======
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    Image,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    TextInput,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/AppText";
import { FONTS } from "@/src/constants/theme";

type MessageType = {
  id: string;
  label: string;
};

type SocialItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  url: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  subject?: string;
  messageType?: string;
  message?: string;
};

const SUPPORT_EMAIL = "support@resq.app";
const SUPPORT_PHONE = "+963 XX XXX XXXX";
const MAX_MESSAGE_LENGTH = 1000;

const MESSAGE_TYPES: MessageType[] = [
  { id: "question", label: "استفسار عام" },
  { id: "suggestion", label: "اقتراح" },
  { id: "technical", label: "مشكلة تقنية" },
  { id: "account", label: "مشكلة في الحساب" },
  { id: "report", label: "مشكلة في بلاغ" },
  { id: "other", label: "أخرى" },
];

const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: "website",
    label: "الموقع",
    icon: "globe-outline",
    url: "https://resq.app",
  },
  {
    id: "facebook",
    label: "فيسبوك",
    icon: "logo-facebook",
    url: "https://www.facebook.com",
  },
  {
    id: "instagram",
    label: "إنستغرام",
    icon: "logo-instagram",
    url: "https://www.instagram.com",
  },
  {
    id: "linkedin",
    label: "لينكدإن",
    icon: "logo-linkedin",
    url: "https://www.linkedin.com",
  },
];

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function ContactUsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [messageType, setMessageType] = useState<MessageType | null>(null);
  const [message, setMessage] = useState("");
  const [attachmentUri, setAttachmentUri] = useState<string | null>(null);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 18;
  const contentWidth = Math.min(width - horizontalPadding * 2, 620);

  const remainingCharacters = useMemo(
    () => MAX_MESSAGE_LENGTH - message.length,
    [message.length],
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/help-center" as never);
  };

  const openExternalUrl = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      Alert.alert("تعذر فتح الرابط", "يرجى المحاولة مرة أخرى لاحقًا.");
      return;
    }

    await Linking.openURL(url);
  };

  const handleEmail = () => {
    void openExternalUrl(`mailto:${SUPPORT_EMAIL}`);
  };

  const handlePhone = () => {
    const numericPhone = SUPPORT_PHONE.replace(/[^\d+]/g, "");
    void openExternalUrl(`tel:${numericPhone}`);
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "السماح بالوصول للصور",
        "نحتاج إلى إذن الوصول للصور حتى تتمكن من إرفاق صورة.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setAttachmentUri(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!fullName.trim()) {
      nextErrors.name = "يرجى إدخال الاسم الكامل.";
    }

    if (!email.trim()) {
      nextErrors.email = "يرجى إدخال البريد الإلكتروني.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صحيح.";
    }

    if (!subject.trim()) {
      nextErrors.subject = "يرجى إدخال موضوع الرسالة.";
    }

    if (!messageType) {
      nextErrors.messageType = "يرجى اختيار نوع الرسالة.";
    }

    if (!message.trim()) {
      nextErrors.message = "يرجى كتابة تفاصيل الرسالة.";
    } else if (message.trim().length < 10) {
      nextErrors.message = "يرجى كتابة تفاصيل أوضح لا تقل عن 10 أحرف.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        "تحقق من البيانات",
        "يرجى تصحيح الحقول الموضحة ثم إعادة المحاولة.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const body = [
        `الاسم: ${fullName.trim()}`,
        `البريد الإلكتروني: ${email.trim()}`,
        `نوع الرسالة: ${messageType?.label ?? ""}`,
        "",
        message.trim(),
        attachmentUri ? "\nتم اختيار صورة مرفقة داخل التطبيق." : "",
      ].join("\n");

      const mailUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
        subject.trim(),
      )}&body=${encodeURIComponent(body)}`;

      const canOpen = await Linking.canOpenURL(mailUrl);

      if (!canOpen) {
        Alert.alert(
          "تعذر فتح البريد",
          "يمكنك مراسلتنا مباشرة عبر support@resq.app",
        );
        return;
      }

      await Linking.openURL(mailUrl);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مشاركة صفحة التواصل"
            hitSlop={10}
            onPress={() =>
              void Share.share({
                title: "تواصل معنا - ResQ",
                message:
                  "يمكنك التواصل مع فريق ResQ عبر صفحة التواصل داخل التطبيق.",
              })
            }
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="share-social-outline" size={23} color="#25211F" />
          </Pressable>

          <AppText style={styles.topBarTitle}>تواصل معنا</AppText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="العودة"
            hitSlop={10}
            onPress={handleBack}
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-forward-outline" size={25} color="#25211F" />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.content, { width: contentWidth }]}>
            <Image
              source={require("@/assets/images/help-center-hero.png")}
              resizeMode="cover"
              style={styles.heroImage}
            />

            <View style={styles.heroTextWrap}>
              <AppText style={styles.heroTitle}>يسعدنا التواصل معك</AppText>
              <AppText style={styles.heroDescription}>
                إذا كان لديك سؤال أو اقتراح أو واجهت مشكلة، يسعد فريق ResQ
                بمساعدتك.
              </AppText>
            </View>

            <View style={styles.formCard}>
              <View style={styles.fieldGroup}>
                <AppText style={styles.label}>الاسم الكامل</AppText>

                <TextInput
                  value={fullName}
                  onChangeText={(value) => {
                    setFullName(value);
                    setErrors((current) => ({ ...current, name: undefined }));
                  }}
                  placeholder="أدخل اسمك هنا"
                  placeholderTextColor="#99918B"
                  style={[styles.input, errors.name ? styles.inputError : null]}
                />

                {errors.name ? (
                  <AppText style={styles.errorText}>{errors.name}</AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <AppText style={styles.label}>البريد الإلكتروني</AppText>

                <TextInput
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setErrors((current) => ({ ...current, email: undefined }));
                  }}
                  placeholder="example@mail.com"
                  placeholderTextColor="#99918B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    styles.ltrInput,
                    errors.email ? styles.inputError : null,
                  ]}
                />

                {errors.email ? (
                  <AppText style={styles.errorText}>{errors.email}</AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <AppText style={styles.label}>الموضوع</AppText>

                <TextInput
                  value={subject}
                  onChangeText={(value) => {
                    setSubject(value);
                    setErrors((current) => ({
                      ...current,
                      subject: undefined,
                    }));
                  }}
                  placeholder="عنوان الرسالة"
                  placeholderTextColor="#99918B"
                  style={[
                    styles.input,
                    errors.subject ? styles.inputError : null,
                  ]}
                />

                {errors.subject ? (
                  <AppText style={styles.errorText}>{errors.subject}</AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <AppText style={styles.label}>نوع الرسالة</AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="اختيار نوع الرسالة"
                  onPress={() => setTypeModalVisible(true)}
                  style={({ pressed }) => [
                    styles.selectInput,
                    errors.messageType ? styles.inputError : null,
                    pressed && styles.fieldPressed,
                  ]}
                >
                  <AppText
                    style={[
                      styles.selectText,
                      !messageType && styles.selectPlaceholder,
                    ]}
                  >
                    {messageType?.label ?? "اختر نوع الرسالة"}
                  </AppText>

                  <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color="#776E68"
                  />
                </Pressable>

                {errors.messageType ? (
                  <AppText style={styles.errorText}>
                    {errors.messageType}
                  </AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.messageLabelRow}>
                  <AppText style={styles.label}>رسالتك</AppText>

                  <AppText
                    style={[
                      styles.counterText,
                      remainingCharacters < 0 && styles.counterError,
                    ]}
                  >
                    {message.length} / {MAX_MESSAGE_LENGTH}
                  </AppText>
                </View>

                <TextInput
                  value={message}
                  onChangeText={(value) => {
                    if (value.length <= MAX_MESSAGE_LENGTH) {
                      setMessage(value);
                    }

                    setErrors((current) => ({
                      ...current,
                      message: undefined,
                    }));
                  }}
                  placeholder="اكتب رسالتك هنا بالتفصيل..."
                  placeholderTextColor="#99918B"
                  multiline
                  textAlignVertical="top"
                  style={[
                    styles.messageInput,
                    errors.message ? styles.inputError : null,
                  ]}
                />

                {errors.message ? (
                  <AppText style={styles.errorText}>{errors.message}</AppText>
                ) : null}
              </View>

              <View style={styles.fieldGroupLast}>
                <AppText style={styles.label}>إرفاق صورة (اختياري)</AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="اختيار صورة"
                  onPress={handlePickImage}
                  style={({ pressed }) => [
                    styles.uploadBox,
                    pressed && styles.fieldPressed,
                  ]}
                >
                  {attachmentUri ? (
                    <Image
                      source={{ uri: attachmentUri }}
                      resizeMode="cover"
                      style={styles.attachmentPreview}
                    />
                  ) : (
                    <>
                      <Ionicons
                        name="cloud-upload-outline"
                        size={34}
                        color="#B64E00"
                      />
                      <AppText style={styles.uploadTitle}>
                        اضغط لرفع الملفات
                      </AppText>
                      <AppText style={styles.uploadHint}>
                        JPG, PNG, WEBP
                      </AppText>
                    </>
                  )}
                </Pressable>

                {attachmentUri ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="إزالة الصورة"
                    onPress={() => setAttachmentUri(null)}
                    style={({ pressed }) => [
                      styles.removeAttachmentButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons name="trash-outline" size={17} color="#C73732" />
                    <AppText style={styles.removeAttachmentText}>
                      إزالة الصورة
                    </AppText>
                  </Pressable>
                ) : null}
              </View>
            </View>

            <View style={styles.helpCard}>
              <AppText style={styles.helpTitle}>ربما تجد إجابتك هنا</AppText>

              <AppText style={styles.helpDescription}>
                تصفح الأسئلة الشائعة والمقالات الإرشادية في مركز المساعدة.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="الانتقال إلى مركز المساعدة"
                onPress={() => router.push("/help-center" as never)}
                style={({ pressed }) => [
                  styles.helpButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="help-buoy-outline" size={18} color="#AD4B18" />
                <AppText style={styles.helpButtonText}>
                  الانتقال إلى مركز المساعدة
                </AppText>
              </Pressable>
            </View>

            <View style={styles.contactInfoCard}>
              <AppText style={styles.sectionTitle}>معلومات التواصل</AppText>

              <Pressable
                accessibilityRole="link"
                accessibilityLabel="إرسال بريد إلكتروني"
                onPress={handleEmail}
                style={({ pressed }) => [
                  styles.contactInfoRow,
                  pressed && styles.rowPressed,
                ]}
              >
                <View style={styles.contactIconOrange}>
                  <Ionicons name="mail-outline" size={21} color="#B64E00" />
                </View>

                <View style={styles.contactTextWrap}>
                  <AppText style={styles.contactLabel}>
                    البريد الإلكتروني
                  </AppText>
                  <AppText style={styles.contactValueLTR}>
                    {SUPPORT_EMAIL}
                  </AppText>
                </View>
              </Pressable>

              <Pressable
                accessibilityRole="link"
                accessibilityLabel="الاتصال برقم الدعم"
                onPress={handlePhone}
                style={({ pressed }) => [
                  styles.contactInfoRow,
                  pressed && styles.rowPressed,
                ]}
              >
                <View style={styles.contactIconGreen}>
                  <Ionicons name="call-outline" size={21} color="#18833B" />
                </View>

                <View style={styles.contactTextWrap}>
                  <AppText style={styles.contactLabel}>رقم الهاتف</AppText>
                  <AppText style={styles.contactValueLTR}>
                    {SUPPORT_PHONE}
                  </AppText>
                </View>
              </Pressable>

              <View style={styles.contactInfoRow}>
                <View style={styles.contactIconNeutral}>
                  <Ionicons name="time-outline" size={21} color="#6A625D" />
                </View>

                <View style={styles.contactTextWrap}>
                  <AppText style={styles.contactLabel}>ساعات الدعم</AppText>
                  <AppText style={styles.contactValue}>
                    الأحد - الخميس | 09:00 - 17:00
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.socialCard}>
              <AppText style={styles.sectionTitle}>تابعنا</AppText>

              <View style={styles.socialGrid}>
                {SOCIAL_ITEMS.map((item) => (
                  <Pressable
                    key={item.id}
                    accessibilityRole="link"
                    accessibilityLabel={item.label}
                    onPress={() => void openExternalUrl(item.url)}
                    style={({ pressed }) => [
                      styles.socialItem,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={styles.socialIcon}>
                      <Ionicons name={item.icon} size={21} color="#5F5955" />
                    </View>

                    <AppText style={styles.socialLabel}>{item.label}</AppText>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إرسال الرسالة"
              disabled={isSubmitting}
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitPressed,
                isSubmitting && styles.submitDisabled,
              ]}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />

              <AppText style={styles.submitButtonText}>
                {isSubmitting ? "جارٍ الإرسال..." : "إرسال الرسالة"}
              </AppText>
            </Pressable>
          </View>
        </ScrollView>

        <Modal
          visible={typeModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setTypeModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setTypeModalVisible(false)}
          >
            <Pressable
              style={[styles.typeModalCard, { width: contentWidth }]}
              onPress={() => undefined}
            >
              <View style={styles.modalHeader}>
                <AppText style={styles.modalTitle}>اختر نوع الرسالة</AppText>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="إغلاق"
                  onPress={() => setTypeModalVisible(false)}
                  style={({ pressed }) => [
                    styles.modalCloseButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="close" size={21} color="#3D3733" />
                </Pressable>
              </View>

              {MESSAGE_TYPES.map((item, index) => {
                const isSelected = messageType?.id === item.id;

                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      setMessageType(item);
                      setErrors((current) => ({
                        ...current,
                        messageType: undefined,
                      }));
                      setTypeModalVisible(false);
                    }}
                    style={({ pressed }) => [
                      styles.typeOption,
                      index < MESSAGE_TYPES.length - 1 &&
                        styles.typeOptionBorder,
                      pressed && styles.rowPressed,
                    ]}
                  >
                    <Ionicons
                      name={
                        isSelected
                          ? "radio-button-on"
                          : "radio-button-off-outline"
                      }
                      size={21}
                      color={isSelected ? "#B64E00" : "#8B837D"}
                    />

                    <AppText style={styles.typeOptionText}>
                      {item.label}
                    </AppText>
                  </Pressable>
                );
              })}
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F8FC",
  },
  screen: {
    flex: 1,
    backgroundColor: "#F9F8FC",
  },
  topBar: {
    minHeight: 60,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E4E1DF",
    backgroundColor: "#F9F8FC",
  },
  topBarButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  topBarTitle: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 19,
    color: "#282321",
    textAlign: "center",
    writingDirection: "rtl",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 34,
  },
  content: {
    width: "100%",
    direction: "rtl",
    alignSelf: "center",
    alignItems: "stretch",
  },
  heroImage: {
    width: "100%",
    height: 186,
    borderRadius: 15,
    backgroundColor: "#FFE4D4",
  },
  heroTextWrap: {
    width: "100%",
    direction: "rtl",
    alignItems: "stretch",
    marginTop: 20,
  },
  heroTitle: {
    width: "100%",
    fontFamily: FONTS.bold,
    fontSize: 27,
    lineHeight: 38,
    color: "#292421",
    textAlign: "left",
    writingDirection: "rtl",
  },
  heroDescription: {
    width: "100%",
    marginTop: 7,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 23,
    color: "#645B56",
    textAlign: "left",
    writingDirection: "rtl",
  },
  formCard: {
    width: "100%",
    direction: "rtl",
    alignItems: "stretch",
    marginTop: 24,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E9C5B2",
    backgroundColor: "#FFFFFF",
  },
  fieldGroup: {
    width: "100%",
    direction: "rtl",
    alignItems: "stretch",
    marginBottom: 18,
  },
  fieldGroupLast: {
    width: "100%",
    direction: "rtl",
    alignItems: "stretch",
  },
  label: {
    width: "100%",
    marginBottom: 7,
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#544B46",
    textAlign: "left",
    writingDirection: "rtl",
  },
  input: {
    width: "100%",
    minHeight: 54,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDB7AA",
    backgroundColor: "#FFFFFF",
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#332E2B",
    textAlign: "left",
    writingDirection: "rtl",
  },
  ltrInput: {
    textAlign: "left",
    writingDirection: "ltr",
  },
  selectInput: {
    direction: "rtl",
    width: "100%",
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDB7AA",
    backgroundColor: "#FFFFFF",
  },
  selectText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#332E2B",
    textAlign: "left",
    writingDirection: "rtl",
  },
  selectPlaceholder: {
    color: "#99918B",
  },
  messageLabelRow: {
    direction: "rtl",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  counterText: {
    fontFamily: FONTS.regular,
    fontSize: 10.5,
    color: "#8F847E",
    textAlign: "left",
    writingDirection: "ltr",
  },
  counterError: {
    color: "#C73732",
  },
  messageInput: {
    width: "100%",
    minHeight: 132,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDB7AA",
    backgroundColor: "#FFFFFF",
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 22,
    color: "#332E2B",
    textAlign: "left",
    writingDirection: "rtl",
  },
  inputError: {
    borderColor: "#D9544F",
    backgroundColor: "#FFF9F8",
  },
  errorText: {
    width: "100%",
    marginTop: 5,
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#C73732",
    textAlign: "left",
    writingDirection: "rtl",
  },
  uploadBox: {
    width: "100%",
    minHeight: 122,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#E8BCA5",
    backgroundColor: "#FAF9FB",
  },
  uploadTitle: {
    marginTop: 7,
    fontFamily: FONTS.medium,
    fontSize: 12.5,
    color: "#5D5550",
    textAlign: "center",
    writingDirection: "rtl",
  },
  uploadHint: {
    marginTop: 3,
    fontFamily: FONTS.regular,
    fontSize: 10,
    color: "#8B817B",
    textAlign: "center",
    writingDirection: "ltr",
  },
  attachmentPreview: {
    width: "100%",
    height: 160,
  },
  removeAttachmentButton: {
    direction: "rtl",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 5,
  },
  removeAttachmentText: {
    fontFamily: FONTS.medium,
    fontSize: 11.5,
    color: "#C73732",
    textAlign: "left",
    writingDirection: "rtl",
  },
  helpCard: {
    width: "100%",
    direction: "rtl",
    alignItems: "stretch",
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#FF7E3D",
    backgroundColor: "#FFF5EF",
  },
  helpTitle: {
    width: "100%",
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: "#B6531D",
    textAlign: "left",
    writingDirection: "rtl",
  },
  helpDescription: {
    width: "100%",
    marginTop: 6,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 18,
    color: "#7E6D65",
    textAlign: "left",
    writingDirection: "rtl",
  },
  helpButton: {
    direction: "rtl",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 7,
  },
  helpButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#AD4B18",
    textAlign: "left",
    textDecorationLine: "underline",
    writingDirection: "rtl",
  },
  contactInfoCard: {
    width: "100%",
    direction: "rtl",
    alignItems: "stretch",
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E4E1DF",
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    width: "100%",
    marginBottom: 12,
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: "#2D2825",
    textAlign: "left",
    writingDirection: "rtl",
  },
  contactInfoRow: {
    direction: "rtl",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    paddingVertical: 10,
  },
  contactTextWrap: {
    flex: 1,
    direction: "rtl",
    alignItems: "stretch",
  },
  contactLabel: {
    width: "100%",
    fontFamily: FONTS.regular,
    fontSize: 10.5,
    color: "#7D736D",
    textAlign: "left",
    writingDirection: "rtl",
  },
  contactValue: {
    width: "100%",
    marginTop: 2,
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#3C3632",
    textAlign: "left",
    writingDirection: "rtl",
  },
  contactValueLTR: {
    width: "100%",
    marginTop: 2,
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#3C3632",
    textAlign: "left",
    writingDirection: "ltr",
  },
  contactIconOrange: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#FFF0E7",
  },
  contactIconGreen: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#E7F4EA",
  },
  contactIconNeutral: {
    width: 44,
    height: 44,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#EFEEED",
  },
  socialCard: {
    width: "100%",
    direction: "rtl",
    alignItems: "stretch",
    marginTop: 20,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E4E1DF",
    backgroundColor: "#FFFFFF",
  },
  socialGrid: {
    direction: "rtl",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  socialItem: {
    width: "24%",
    alignItems: "center",
  },
  socialIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#EFEEED",
  },
  socialLabel: {
    marginTop: 7,
    fontFamily: FONTS.regular,
    fontSize: 10.5,
    color: "#5D5550",
    textAlign: "center",
    writingDirection: "rtl",
  },
  submitButton: {
    direction: "rtl",
    width: "100%",
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: "#B64E00",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
    writingDirection: "rtl",
  },
  submitPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  submitDisabled: {
    opacity: 0.55,
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: "rgba(36, 31, 28, 0.42)",
  },
  typeModalCard: {
    overflow: "hidden",
    direction: "rtl",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E4E1DF",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#F1EFED",
  },
  modalTitle: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: "#2D2825",
    textAlign: "left",
    writingDirection: "rtl",
  },
  typeOption: {
    minHeight: 52,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    paddingHorizontal: 16,
  },
  typeOptionBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7E4E2",
  },
  typeOptionText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#3E3834",
    textAlign: "left",
    writingDirection: "rtl",
  },
  rowPressed: {
    backgroundColor: "#F7F6F5",
  },
  fieldPressed: {
    opacity: 0.75,
  },
  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.98 }],
  },
});
>>>>>>> 5f4a354c8632b09b2c8785d2eebd30ffed989cf6
