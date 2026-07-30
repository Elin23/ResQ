<<<<<<< HEAD
export { default } from "@/src/features/public/screens/AboutScreen";
=======
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/AppText";
import { FONTS } from "@/src/constants/theme";

type IoniconName = keyof typeof Ionicons.glyphMap;

type FeatureItem = {
  id: string;
  title: string;
  icon: IoniconName;
};

type InfoItem = {
  id: string;
  label: string;
  value: string;
};

type SocialItem = {
  id: string;
  title: string;
  icon: IoniconName;
  url: string;
};

const APP_VERSION = "1.0.0";
const LAST_UPDATED = "يناير 2026";
const PLATFORM = "Android";
const SUPPORT_EMAIL = "support@resq.app";

const FEATURES: FeatureItem[] = [
  { id: "reports", title: "الإبلاغ عن حالات", icon: "alert-circle-outline" },
  { id: "tracking", title: "متابعة البلاغات", icon: "time-outline" },
  { id: "adoption", title: "التبني", icon: "heart-outline" },
  { id: "donations", title: "التبرعات", icon: "wallet-outline" },
  { id: "feeding", title: "نقاط الإطعام", icon: "location-outline" },
  { id: "clinics", title: "عيادات بيطرية", icon: "medkit-outline" },
  { id: "organizations", title: "الجمعيات", icon: "people-outline" },
  { id: "volunteering", title: "التطوع", icon: "hand-left-outline" },
];

const INFO_ITEMS: InfoItem[] = [
  { id: "version", label: "الإصدار", value: APP_VERSION },
  { id: "updated", label: "آخر تحديث", value: LAST_UPDATED },
  { id: "platform", label: "المنصة", value: PLATFORM },
];

const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: "website",
    title: "الموقع الإلكتروني",
    icon: "globe-outline",
    url: "https://resq.app",
  },
  {
    id: "facebook",
    title: "فيسبوك",
    icon: "logo-facebook",
    url: "https://www.facebook.com",
  },
  {
    id: "instagram",
    title: "إنستغرام",
    icon: "logo-instagram",
    url: "https://www.instagram.com",
  },
  {
    id: "linkedin",
    title: "لينكد إن",
    icon: "logo-linkedin",
    url: "https://www.linkedin.com",
  },
];

export default function AboutScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [licensesVisible, setLicensesVisible] = useState(false);

  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 18;
  const contentWidth = Math.min(width - horizontalPadding * 2, 620);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/" as never);
  };

  const openRoute = (route: string) => {
    router.push(route as never);
  };

  const openExternalUrl = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const handleContact = async () => {
    const subject = encodeURIComponent("استفسار حول تطبيق ResQ");
    const url = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;

    await openExternalUrl(url);
  };

  const handleShare = async () => {
    await Share.share({
      title: "تطبيق ResQ",
      message:
        "تعرّف على تطبيق ResQ، المنصة المخصصة للمساهمة في إنقاذ الحيوانات ودعم المجتمع.",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مشاركة معلومات التطبيق"
            hitSlop={10}
            onPress={handleShare}
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="share-social-outline" size={23} color="#25211F" />
          </Pressable>

          <View style={styles.topBarTitleWrap}>
            <AppText style={styles.topBarTitle}>حول ResQ</AppText>
            <Ionicons name="paw" size={18} color="#2B2724" />
          </View>

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
            <Ionicons name="arrow-forward-outline" size={24} color="#25211F" />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { width: contentWidth }]}>
            <View style={styles.hero}>
              <View style={styles.logoBox}>
                <Ionicons name="paw" size={48} color="#FFFFFF" />
              </View>

              <View style={styles.brandRow}>
                <Ionicons name="paw" size={20} color="#2B2724" />

                <AppText style={styles.brandName}>
                  Res<AppText style={styles.brandAccent}>Q {""}</AppText>
                </AppText>
              </View>

              <AppText style={styles.tagline}>
                معاً لإنقاذ الحيوانات وبناء مجتمع أكثر رحمة.
              </AppText>

              <View style={styles.versionPill}>
                <AppText style={styles.versionText}>
                  الإصدار {APP_VERSION}
                </AppText>
              </View>
            </View>

            <View style={styles.statementCard}>
              <View style={styles.statementHeader}>
                <Ionicons name="flag-outline" size={21} color="#18833B" />
                <AppText style={styles.statementTitle}>رسالتنا</AppText>
              </View>

              <AppText style={styles.statementText}>
                نهدف إلى توفير استجابة سريعة وفعّالة لإنقاذ الحيوانات المشردة
                والمصابة من خلال ربط المتطوعين والجمعيات والعيادات في منصة واحدة
                متكاملة تعزز قيم الرفق بالحيوان.
              </AppText>
            </View>

            <View style={styles.statementCard}>
              <View style={styles.statementHeader}>
                <Ionicons name="eye-outline" size={22} color="#B64E00" />
                <AppText style={[styles.statementTitle, styles.visionTitle]}>
                  رؤيتنا
                </AppText>
              </View>

              <AppText style={styles.statementText}>
                أن نصبح المنصة الرقمية الأولى في المنطقة لحماية حقوق الحيوان،
                وبناء قاعدة بيانات وطنية تضمن حياة كريمة لكل حيوان يحتاج إلى
                المساعدة.
              </AppText>
            </View>

            <View style={styles.featuresCard}>
              <AppText style={styles.cardTitle}>ماذا يوفر التطبيق؟</AppText>

              <View style={styles.featuresGrid}>
                {FEATURES.map((item) => (
                  <View key={item.id} style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Ionicons name={item.icon} size={21} color="#18833B" />
                    </View>

                    <AppText style={styles.featureTitle}>{item.title}</AppText>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color="#5E625F"
                />
                <AppText style={styles.cardTitle}>معلومات التطبيق</AppText>
              </View>

              {INFO_ITEMS.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.infoRow,
                    index < INFO_ITEMS.length - 1 && styles.rowBorder,
                  ]}
                >
                  <AppText style={styles.infoLabel}>{item.label}</AppText>
                  <AppText style={styles.infoValue}>{item.value}</AppText>
                </View>
              ))}
            </View>

            <View style={styles.licensesCard}>
              <AppText style={styles.licensesTitle}>التراخيص</AppText>
              <AppText style={styles.licensesDescription}>
                يعتمد التطبيق على مجموعة من المكتبات مفتوحة المصدر التي تساهم في
                تقديم تجربة مستخدم آمنة وسلسة.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="عرض التراخيص"
                onPress={() => setLicensesVisible(true)}
                style={({ pressed }) => [
                  styles.licensesButton,
                  pressed && styles.pressed,
                ]}
              >
                <AppText style={styles.licensesButtonText}>
                  عرض التراخيص
                </AppText>
              </Pressable>
            </View>

            <View style={styles.socialCard}>
              <AppText style={styles.socialTitle}>تابعنا على</AppText>

              {SOCIAL_ITEMS.map((item, index) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="link"
                  accessibilityLabel={item.title}
                  onPress={() => openExternalUrl(item.url)}
                  style={({ pressed }) => [
                    styles.socialRow,
                    index < SOCIAL_ITEMS.length - 1 && styles.rowBorder,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <Ionicons name="open-outline" size={18} color="#7B837D" />

                  <AppText style={styles.socialText}>{item.title}</AppText>

                  <Ionicons name={item.icon} size={20} color="#18833B" />
                </Pressable>
              ))}
            </View>

            <View style={styles.helpCard}>
              <AppText style={styles.helpTitle}>هل لديك سؤال؟</AppText>
              <AppText style={styles.helpDescription}>
                انتقل إلى مركز المساعدة للاطلاع على الأسئلة الشائعة وطرق الحصول
                على الدعم.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="الانتقال إلى مركز المساعدة"
                onPress={() => openRoute("/help-center")}
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

            <View style={styles.shareCard}>
              <AppText style={styles.shareTitle}>انشر الخير</AppText>
              <AppText style={styles.shareDescription}>
                شارك التطبيق مع أصدقائك، فقد تكون مشاركتك سببًا في إنقاذ روح.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="مشاركة التطبيق"
                onPress={handleShare}
                style={({ pressed }) => [
                  styles.shareButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color="#B64E00"
                />
                <AppText style={styles.shareButtonText}>مشاركة التطبيق</AppText>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <View style={styles.footerLine} />

              <AppText style={styles.footerCopyright}>
                جميع الحقوق محفوظة © 2026 ResQ
              </AppText>

              <View style={styles.footerLinks}>
                <Pressable onPress={() => openRoute("/privacy-policy")}>
                  <AppText style={styles.footerLink}>سياسة الخصوصية</AppText>
                </Pressable>

                <View style={styles.footerDot} />

                <Pressable onPress={() => openRoute("/terms-and-conditions")}>
                  <AppText style={styles.footerLink}>الشروط والأحكام</AppText>
                </Pressable>
              </View>

              <Pressable
                accessibilityRole="link"
                onPress={handleContact}
                style={({ pressed }) => [
                  styles.footerContact,
                  pressed && styles.pressed,
                ]}
              >
                <AppText style={styles.footerContactText}>
                  {SUPPORT_EMAIL}
                </AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <Modal
          visible={licensesVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLicensesVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { width: contentWidth }]}>
              <View style={styles.modalHeader}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="إغلاق"
                  hitSlop={10}
                  onPress={() => setLicensesVisible(false)}
                  style={({ pressed }) => [
                    styles.modalCloseButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="close" size={22} color="#3B3531" />
                </Pressable>

                <AppText style={styles.modalTitle}>التراخيص المفتوحة</AppText>
              </View>

              <AppText style={styles.modalText}>
                يستخدم ResQ مكتبات مفتوحة المصدر، بما في ذلك React Native وExpo
                وExpo Router وIonicons. تخضع كل مكتبة لشروط الترخيص الخاصة بها.
              </AppText>

              <View style={styles.licenseList}>
                <AppText style={styles.licenseItem}>React Native — MIT</AppText>
                <AppText style={styles.licenseItem}>Expo — MIT</AppText>
                <AppText style={styles.licenseItem}>Expo Router — MIT</AppText>
                <AppText style={styles.licenseItem}>Ionicons — MIT</AppText>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => setLicensesVisible(false)}
                style={({ pressed }) => [
                  styles.modalDoneButton,
                  pressed && styles.pressed,
                ]}
              >
                <AppText style={styles.modalDoneText}>تم</AppText>
              </Pressable>
            </View>
          </View>
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
  topBarTitleWrap: {
    flex: 1,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  topBarTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: "#282321",
    textAlign: "center",
    writingDirection: "rtl",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
  },
  content: {
    direction: "rtl",
    alignSelf: "center",
    alignItems: "stretch",
  },
  hero: {
    width: "100%",
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 8,
  },
  logoBox: {
    width: 82,
    height: 82,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#FF7E3D",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  brandRow: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  brandName: {
    fontFamily: FONTS.bold,
    fontSize: 25,
    color: "#2D2825",
  },
  brandAccent: {
    fontFamily: FONTS.bold,
    fontSize: 25,
    color: "#FF7E3D",
    marginStart: 1,
    marginEnd: 4,
  },
  tagline: {
    width: "100%",
    marginTop: 5,
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#756D68",
    textAlign: "center",
    writingDirection: "rtl",
  },
  versionPill: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#FFE2D2",
  },
  versionText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: "#9A4C22",
    textAlign: "center",
    writingDirection: "rtl",
  },
  statementCard: {
    width: "100%",
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9C5B2",
    backgroundColor: "#FFFFFF",
  },
  statementHeader: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statementTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: "#18833B",
    textAlign: "left",
    writingDirection: "rtl",
  },
  visionTitle: {
    color: "#B64E00",
  },
  statementText: {
    width: "100%",
    marginTop: 10,
    fontFamily: FONTS.regular,
    fontSize: 12.5,
    lineHeight: 23,
    color: "#4F4844",
    textAlign: "left",
    writingDirection: "rtl",
  },
  featuresCard: {
    width: "100%",
    marginTop: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9C5B2",
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: "#2D2825",
    textAlign: "left",
    writingDirection: "rtl",
  },
  featuresGrid: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    rowGap: 18,
  },
  featureItem: {
    width: "50%",
    alignItems: "center",
  },
  featureIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#E7F4EA",
  },
  featureTitle: {
    marginTop: 7,
    fontFamily: FONTS.medium,
    fontSize: 11.5,
    color: "#3D3733",
    textAlign: "center",
    writingDirection: "rtl",
  },
  infoCard: {
    overflow: "hidden",
    width: "100%",
    marginTop: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E4E1DF",
    backgroundColor: "#FFFFFF",
  },
  infoHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  infoRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  infoLabel: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#776F69",
    textAlign: "left",
    writingDirection: "rtl",
  },
  infoValue: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#3E3834",
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E7E4E2",
  },
  licensesCard: {
    width: "100%",
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9C5B2",
    backgroundColor: "#FFFFFF",
  },
  licensesTitle: {
    width: "100%",
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: "#2D2825",
    textAlign: "left",
    writingDirection: "rtl",
  },
  licensesDescription: {
    width: "100%",
    marginTop: 8,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 21,
    color: "#5B534E",
    textAlign: "left",
    writingDirection: "rtl",
  },
  licensesButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B6BDB7",
    backgroundColor: "#FFFFFF",
  },
  licensesButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#18833B",
    textAlign: "center",
    writingDirection: "rtl",
  },
  socialCard: {
    overflow: "hidden",
    width: "100%",
    marginTop: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E4E1DF",
    backgroundColor: "#FFFFFF",
  },
  socialTitle: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: "#B64E00",
    textAlign: "left",
    writingDirection: "rtl",
    backgroundColor: "#FFF7F2",
  },
  socialRow: {
    minHeight: 52,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
  },
  socialText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12.5,
    color: "#3E3834",
    textAlign: "left",
    writingDirection: "rtl",
  },
  rowPressed: {
    backgroundColor: "#F6F5F4",
  },
  helpCard: {
    direction: "rtl",
    width: "100%",
    alignItems: "stretch",
    marginTop: 18,
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
    alignSelf: "flex-start",
    direction: "rtl",
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
    textAlign: "right",
    textDecorationLine: "underline",
    writingDirection: "rtl",
  },
  shareCard: {
    width: "100%",
    alignItems: "stretch",
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 19,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9C5B2",
    backgroundColor: "#FFF7F2",
  },
  shareTitle: {
    width: "100%",
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: "#B64E00",
    textAlign: "left",
    writingDirection: "rtl",
  },
  shareDescription: {
    width: "100%",
    marginTop: 6,
    fontFamily: FONTS.regular,
    fontSize: 11.5,
    lineHeight: 19,
    color: "#765E50",
    textAlign: "left",
    writingDirection: "rtl",
  },
  shareButton: {
    alignSelf: "flex-start",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 13,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
  },
  shareButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 12.5,
    color: "#B64E00",
    writingDirection: "rtl",
  },
  footer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
    paddingBottom: 10,
  },
  footerLine: {
    width: 72,
    height: 1,
    backgroundColor: "#D7D4D1",
  },
  footerCopyright: {
    marginTop: 16,
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#8A827D",
    textAlign: "center",
    writingDirection: "rtl",
  },
  footerLinks: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 12,
  },
  footerLink: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: "#18833B",
    textDecorationLine: "underline",
    writingDirection: "rtl",
  },
  footerDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#AAA29D",
  },
  footerContact: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  footerContactText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#7B736E",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    backgroundColor: "rgba(36, 31, 28, 0.42)",
  },
  modalCard: {
    direction: "rtl",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#F1EFED",
  },
  modalTitle: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: "#2D2825",
    textAlign: "left",
    writingDirection: "rtl",
  },
  modalText: {
    width: "100%",
    marginTop: 14,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 21,
    color: "#5B534E",
    textAlign: "left",
    writingDirection: "rtl",
  },
  licenseList: {
    marginTop: 14,
    gap: 9,
  },
  licenseItem: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 9,
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#3F3935",
    textAlign: "left",
    backgroundColor: "#F8F7F6",
  },
  modalDoneButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: "#B64E00",
  },
  modalDoneText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: "#FFFFFF",
    writingDirection: "rtl",
  },
  pressed: {
    opacity: 0.65,
    transform: [{ scale: 0.98 }],
  },
});
>>>>>>> 5f4a354c8632b09b2c8785d2eebd30ffed989cf6
