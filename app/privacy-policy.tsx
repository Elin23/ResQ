<<<<<<< HEAD
export { default } from "@/src/features/public/screens/PrivacyPolicyScreen";
=======
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useRef } from "react";
import {
    Linking,
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

type TableItem = {
  id: string;
  title: string;
};

type InformationItem = {
  id: string;
  title: string;
  description: string;
  icon: IoniconName;
};

const SUPPORT_EMAIL = "support@resq.app";

const TABLE_ITEMS: TableItem[] = [
  { id: "introduction", title: "مقدمة" },
  { id: "information", title: "المعلومات التي نجمعها" },
  { id: "usage", title: "كيفية استخدام المعلومات" },
  { id: "sharing", title: "مشاركة البيانات" },
  { id: "protection", title: "حماية المعلومات" },
  { id: "rights", title: "حقوق المستخدم" },
];

const INFORMATION_ITEMS: InformationItem[] = [
  {
    id: "account",
    title: "بيانات الحساب",
    description: "الاسم، البريد الإلكتروني، ورقم الهاتف لتوثيق الهوية.",
    icon: "person-outline",
  },
  {
    id: "location",
    title: "الموقع الجغرافي",
    description: "نحتاج لموقعك عند تقديم بلاغ إنقاذ لتحديد مكان الحيوان بدقة.",
    icon: "location-outline",
  },
  {
    id: "volunteering",
    title: "بيانات التبرع والتطوع",
    description: "تُستخدم مساهماتك لتعزيز ملفك الشخصي كعضو فعّال في المجتمع.",
    icon: "hand-left-outline",
  },
];

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();

  const sectionOffsets = useRef<Record<string, number>>({});

  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 18;
  const contentWidth = Math.min(width - horizontalPadding * 2, 620);

  const lastUpdated = useMemo(() => "15 مايو 2026", []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/register-entity" as never);
  };

  const handleShare = async () => {
    await Share.share({
      title: "سياسة الخصوصية - ResQ",
      message:
        "اطّلع على سياسة الخصوصية الخاصة بتطبيق ResQ وكيفية حماية بيانات المستخدمين.",
    });
  };

  const handleEmail = async () => {
    const subject = encodeURIComponent("استفسار حول سياسة الخصوصية");
    const url = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;

    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  const handleHelpCenter = () => {
    router.push("/help-center" as never);
  };

  const handleScrollToSection = (id: string) => {
    const y = sectionOffsets.current[id];

    if (typeof y !== "number") {
      return;
    }

    scrollRef.current?.scrollTo({
      y: Math.max(0, y - 12),
      animated: true,
    });
  };

  const registerSection = (id: string, y: number) => {
    sectionOffsets.current[id] = y;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="مشاركة سياسة الخصوصية"
            hitSlop={10}
            onPress={handleShare}
            style={({ pressed }) => [
              styles.topBarIconButton,
              pressed && styles.iconButtonPressed,
            ]}
          >
            <Ionicons name="share-social-outline" size={23} color="#25211F" />
          </Pressable>

          <AppText style={styles.topBarTitle}>سياسة الخصوصية</AppText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="العودة"
            hitSlop={10}
            onPress={handleBack}
            style={({ pressed }) => [
              styles.topBarIconButton,
              pressed && styles.iconButtonPressed,
            ]}
          >
            <Ionicons name="arrow-forward-outline" size={24} color="#25211F" />
          </Pressable>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.content, { width: contentWidth }]}>
            <View style={styles.header}>
              <AppText style={styles.title}>سياسة الخصوصية</AppText>

              <AppText style={styles.updatedText}>
                آخر تحديث: {lastUpdated}
              </AppText>

              <AppText style={styles.introText}>
                نلتزم بحماية خصوصيتك وبياناتك الشخصية، وتوضح هذه السياسة كيفية
                جمع المعلومات واستخدامها وحمايتها في تطبيق ResQ للإنقاذ.
              </AppText>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryTitleRow}>
                <Ionicons name="flash" size={22} color="#18833B" />
                <AppText style={styles.summaryTitle}>ملخص سريع</AppText>
              </View>

              <View style={styles.summaryList}>
                <View style={styles.summaryRow}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={19}
                    color="#18833B"
                  />
                  <AppText style={styles.summaryText}>
                    لا نبيع بياناتك الشخصية لأي جهة خارجية إطلاقًا.
                  </AppText>
                </View>

                <View style={styles.summaryRow}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={19}
                    color="#18833B"
                  />
                  <AppText style={styles.summaryText}>
                    نستخدم البيانات فقط لتحسين سرعة وجودة عمليات إنقاذ
                    الحيوانات.
                  </AppText>
                </View>

                <View style={styles.summaryRow}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={19}
                    color="#18833B"
                  />
                  <AppText style={styles.summaryText}>
                    لديك السيطرة الكاملة على حسابك وبياناتك في أي وقت.
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.contentsCard}>
              <AppText style={styles.contentsTitle}>المحتويات</AppText>

              {TABLE_ITEMS.map((item, index) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`الانتقال إلى قسم ${item.title}`}
                  onPress={() => handleScrollToSection(item.id)}
                  style={({ pressed }) => [
                    styles.contentsRow,
                    index < TABLE_ITEMS.length - 1 && styles.contentsRowBorder,
                    pressed && styles.contentsRowPressed,
                  ]}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={17}
                    color="#726B66"
                  />
                  <AppText style={styles.contentsItemText}>
                    {item.title}
                  </AppText>
                </Pressable>
              ))}
            </View>

            <View
              onLayout={(event) =>
                registerSection("introduction", event.nativeEvent.layout.y)
              }
              style={styles.sectionCard}
            >
              <AppText style={styles.sectionTitle}>مقدمة</AppText>

              <AppText style={styles.sectionParagraph}>
                تم إنشاء ResQ بهدف تسهيل إنقاذ ورعاية الحيوانات الأليفة والمشردة
                في سوريا. خصوصيتك هي حجر الزاوية في بناء الثقة بيننا وبين
                المجتمع، ونحن نطبق أعلى معايير الأمان لضمان أن تبقى بياناتك معنا
                آمنة وشفافة.
              </AppText>
            </View>

            <View
              onLayout={(event) =>
                registerSection("information", event.nativeEvent.layout.y)
              }
              style={styles.sectionCard}
            >
              <AppText style={styles.sectionTitle}>
                المعلومات التي نجمعها
              </AppText>

              <View style={styles.informationList}>
                {INFORMATION_ITEMS.map((item) => (
                  <View key={item.id} style={styles.informationItem}>
                    <View style={styles.informationIcon}>
                      <Ionicons name={item.icon} size={21} color="#087BAE" />
                    </View>

                    <View style={styles.informationTextWrap}>
                      <AppText style={styles.informationTitle}>
                        {item.title}
                      </AppText>
                      <AppText style={styles.informationDescription}>
                        {item.description}
                      </AppText>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View
              onLayout={(event) =>
                registerSection("usage", event.nativeEvent.layout.y)
              }
              style={styles.sectionCard}
            >
              <AppText style={styles.sectionTitle}>
                كيفية استخدام المعلومات
              </AppText>

              <View style={styles.bulletList}>
                <View style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <AppText style={styles.bulletText}>
                    نستخدم معلوماتك لتقديم تجربة سلسة وآمنة داخل التطبيق.
                  </AppText>
                </View>

                <View style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <AppText style={styles.bulletText}>
                    إرسال تنبيهات الإنقاذ العاجلة بالقرب من موقعك.
                  </AppText>
                </View>

                <View style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <AppText style={styles.bulletText}>
                    تسهيل التواصل بين المنقذين ومراكز الإيواء.
                  </AppText>
                </View>

                <View style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <AppText style={styles.bulletText}>
                    تحليل خرائط المناطق الساخنة لتحسين توزيع الموارد الإغاثية.
                  </AppText>
                </View>

                <View style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <AppText style={styles.bulletText}>
                    تخصيص المحتوى التعليمي حول رعاية الحيوان.
                  </AppText>
                </View>
              </View>
            </View>

            <View
              onLayout={(event) =>
                registerSection("sharing", event.nativeEvent.layout.y)
              }
              style={styles.sectionCard}
            >
              <AppText style={styles.sectionTitle}>مشاركة البيانات</AppText>

              <AppText style={styles.sectionParagraph}>
                لا يتم مشاركة بياناتك الحساسة إلا مع الجهات المعتمدة من ResQ مثل
                العيادات البيطرية، جمعيات إنقاذ موثوقة، وفقط عندما يكون ذلك
                ضروريًا لإتمام عملية الإنقاذ أو التبني.
              </AppText>

              <View style={styles.promiseCard}>
                <AppText style={styles.promiseText}>
                  نحن نؤمن بالخصوصية كحق أساسي من حقوق الإنسان.
                </AppText>
              </View>
            </View>

            <View
              onLayout={(event) =>
                registerSection("protection", event.nativeEvent.layout.y)
              }
              style={styles.sectionCard}
            >
              <AppText style={styles.sectionTitle}>حماية المعلومات</AppText>

              <View style={styles.protectionRow}>
                <View style={styles.protectionIcon}>
                  <Ionicons
                    name="shield-half-outline"
                    size={28}
                    color="#19883A"
                  />
                </View>

                <AppText style={styles.protectionText}>
                  نستخدم بروتوكولات تشفير متقدمة مثل SSL/TLS لحماية جميع
                  البيانات المرسلة والمخزنة، مع إجراء فحوصات أمنية دورية
                  لأنظمتنا.
                </AppText>
              </View>
            </View>

            <View
              onLayout={(event) =>
                registerSection("rights", event.nativeEvent.layout.y)
              }
              style={styles.sectionCard}
            >
              <AppText style={styles.sectionTitle}>حقوق المستخدم</AppText>

              <View style={styles.rightsList}>
                <View style={styles.rightRow}>
                  <Ionicons name="pencil-outline" size={20} color="#776C65" />
                  <AppText style={styles.rightText}>
                    الحق في تصحيح أو تحديث معلوماتك.
                  </AppText>
                </View>

                <View style={styles.rightRow}>
                  <Ionicons name="trash-outline" size={20} color="#776C65" />
                  <AppText style={styles.rightText}>
                    الحق في حذف حسابك نهائيًا.
                  </AppText>
                </View>

                <View style={styles.rightRow}>
                  <Ionicons name="download-outline" size={20} color="#776C65" />
                  <AppText style={styles.rightText}>
                    الحق في طلب نسخة من بياناتك المخزنة.
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.contactCard}>
              <AppText style={styles.contactTitle}>هل لديك استفسار؟</AppText>

              <AppText style={styles.contactDescription}>
                انتقل إلى مركز المساعدة للاطلاع على الأسئلة الشائعة وطرق الحصول
                على الدعم.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="الانتقال إلى مركز المساعدة"
                onPress={handleHelpCenter}
                style={({ pressed }) => [
                  styles.emailButton,
                  pressed && styles.emailButtonPressed,
                ]}
              >
                <Ionicons name="help-buoy-outline" size={18} color="#AD4B18" />

                <AppText style={styles.emailText}>
                  الانتقال إلى مركز المساعدة
                </AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            {
              paddingHorizontal: horizontalPadding,
            },
          ]}
        >
          <View style={[styles.bottomBarContent, { width: contentWidth }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="مشاركة سياسة الخصوصية"
              onPress={handleShare}
              style={({ pressed }) => [
                styles.shareBottomButton,
                pressed && styles.bottomButtonPressed,
              ]}
            >
              <Ionicons name="share-social-outline" size={21} color="#5F5955" />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="تواصل معنا"
              onPress={handleEmail}
              style={({ pressed }) => [
                styles.contactButton,
                pressed && styles.bottomButtonPressed,
              ]}
            >
              <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
              <AppText style={styles.contactButtonText}>تواصل معنا</AppText>
            </Pressable>
          </View>
        </View>
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
    borderBottomColor: "#E7E4E2",
    backgroundColor: "#F9F8FC",
  },
  topBarTitle: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: "#24201E",
    textAlign: "center",
    writingDirection: "rtl",
  },
  topBarIconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  iconButtonPressed: {
    opacity: 0.55,
    transform: [{ scale: 0.94 }],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 28,
  },
  content: {
    alignSelf: "center",
  },
  header: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 18,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    lineHeight: 36,
    color: "#292421",
    textAlign: "center",
    writingDirection: "rtl",
  },
  updatedText: {
    marginTop: 4,
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: "#7C6E67",
    textAlign: "center",
    writingDirection: "rtl",
  },
  introText: {
    maxWidth: 520,
    marginTop: 12,
    fontFamily: FONTS.regular,
    fontSize: 13,
    lineHeight: 23,
    color: "#4D4642",
    textAlign: "center",
    writingDirection: "rtl",
  },
  summaryCard: {
    width: "100%",
    paddingHorizontal: 17,
    paddingVertical: 17,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#8EE59A",
    backgroundColor: "#D8F9DD",
  },
  summaryTitleRow: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 13,
  },
  summaryTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: "#167C35",
    textAlign: "left",
    writingDirection: "rtl",
  },
  summaryList: {
    gap: 9,
  },
  summaryRow: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  summaryText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 19,
    color: "#24763A",
    textAlign: "left",
    writingDirection: "rtl",
  },
  contentsCard: {
    width: "100%",
    overflow: "hidden",
    marginTop: 22,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E7BFA9",
    backgroundColor: "#F7F7FA",
  },
  contentsTitle: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#3D3733",
    textAlign: "left",
    writingDirection: "rtl",
  },
  contentsRow: {
    minHeight: 46,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: "#F7F7FA",
  },
  contentsRowBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E3E1",
  },
  contentsRowPressed: {
    backgroundColor: "#F0EFED",
  },
  contentsItemText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#4D4642",
    textAlign: "left",
    writingDirection: "rtl",
  },
  sectionCard: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 17,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E9C5B2",
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    lineHeight: 29,
    color: "#2D2825",
    textAlign: "left",
    writingDirection: "rtl",
  },
  sectionParagraph: {
    marginTop: 12,
    fontFamily: FONTS.regular,
    fontSize: 12.5,
    lineHeight: 23,
    color: "#4F4844",
    textAlign: "left",
    writingDirection: "rtl",
  },
  informationList: {
    marginTop: 13,
    gap: 15,
  },
  informationItem: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  informationIcon: {
    width: 28,
    alignItems: "center",
    paddingTop: 1,
  },
  informationTextWrap: {
    flex: 1,
  },
  informationTitle: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#37312D",
    textAlign: "left",
    writingDirection: "rtl",
  },
  informationDescription: {
    marginTop: 3,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 19,
    color: "#6B625D",
    textAlign: "left",
    writingDirection: "rtl",
  },
  bulletList: {
    marginTop: 12,
    gap: 10,
  },
  bulletRow: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bulletDot: {
    width: 5,
    height: 5,
    marginTop: 8,
    borderRadius: 3,
    backgroundColor: "#6F6762",
  },
  bulletText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 21,
    color: "#554E4A",
    textAlign: "left",
    writingDirection: "rtl",
  },
  promiseCard: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#43AEEA",
    backgroundColor: "#C8EAFD",
  },
  promiseText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    lineHeight: 21,
    color: "#19729D",
    textAlign: "center",
    writingDirection: "rtl",
  },
  protectionRow: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 13,
  },
  protectionIcon: {
    width: 58,
    height: 58,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 29,
    backgroundColor: "#A4F29A",
  },
  protectionText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 22,
    color: "#4E4844",
    textAlign: "left",
    writingDirection: "rtl",
  },
  rightsList: {
    marginTop: 14,
    gap: 9,
  },
  rightRow: {
    minHeight: 44,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#F8F7FA",
  },
  rightText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 19,
    color: "#514A46",
    textAlign: "left",
    writingDirection: "rtl",
  },
  contactCard: {
    direction: "rtl",
    width: "100%",
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
  contactTitle: {
    width: "100%",
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: "#B6531D",
    textAlign: "left",
    writingDirection: "rtl",
  },
  contactDescription: {
    width: "100%",
    marginTop: 6,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 18,
    color: "#7E6D65",
    textAlign: "left",
    writingDirection: "rtl",
  },
  emailButton: {
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
  emailButtonPressed: {
    opacity: 0.55,
  },
  emailText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#AD4B18",
    textAlign: "left",
    textDecorationLine: "underline",
    writingDirection: "rtl",
  },
  bottomBar: {
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E4E1DF",
    backgroundColor: "#FFFFFF",
  },
  bottomBarContent: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shareBottomButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: "#ECEBED",
  },
  contactButton: {
    flex: 1,
    minHeight: 50,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    backgroundColor: "#B64E00",
  },
  contactButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#FFFFFF",
    textAlign: "center",
  },
  bottomButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
});
>>>>>>> 5f4a354c8632b09b2c8785d2eebd30ffed989cf6
