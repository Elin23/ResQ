import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Image,
    Linking,
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

type CategoryItem = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackground: string;
  route: string;
  keywords: string[];
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
};

type ArticleItem = {
  id: string;
  title: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  keywords: string[];
};

const CATEGORIES: CategoryItem[] = [
  {
    id: "account",
    title: "الحساب",
    icon: "person-circle-outline",
    iconColor: "#FF8D52",
    iconBackground: "#E9F4EE",
    route: "/help/account",
    keywords: ["حساب", "تسجيل", "دخول", "كلمة المرور", "الهاتف"],
  },
  {
    id: "reports",
    title: "البلاغات",
    icon: "alert-circle",
    iconColor: "#9B4E00",
    iconBackground: "#F5EEE8",
    route: "/help/reports",
    keywords: ["بلاغ", "بلاغات", "حالة", "إنقاذ", "طارئ"],
  },
  {
    id: "adoption",
    title: "التبني",
    icon: "paw",
    iconColor: "#168B48",
    iconBackground: "#E6F2EA",
    route: "/help/adoption",
    keywords: ["تبني", "طلب تبني", "حيوان", "متبني"],
  },
  {
    id: "donations",
    title: "التبرعات",
    icon: "hand-left",
    iconColor: "#FF8B4B",
    iconBackground: "#E8F4EF",
    route: "/help/donations",
    keywords: ["تبرع", "تبرعات", "دفع", "مساعدة مالية"],
  },
  {
    id: "clinics",
    title: "العيادات",
    icon: "medkit",
    iconColor: "#168B48",
    iconBackground: "#E6F2EA",
    route: "/help/clinics",
    keywords: ["عيادة", "عيادات", "طبيب", "بيطري", "خريطة"],
  },
  {
    id: "organizations",
    title: "الجمعيات",
    icon: "people",
    iconColor: "#9B4E00",
    iconBackground: "#F5EEE8",
    route: "/help/organizations",
    keywords: ["جمعية", "جمعيات", "منظمة", "متطوعين"],
  },
  {
    id: "feeding-points",
    title: "نقاط الإطعام",
    icon: "restaurant",
    iconColor: "#FF8B4B",
    iconBackground: "#E8F4EF",
    route: "/help/feeding-points",
    keywords: ["إطعام", "نقطة", "طعام", "موقع"],
  },
  {
    id: "settings",
    title: "الإعدادات",
    icon: "settings",
    iconColor: "#4C5A51",
    iconBackground: "#E9EEEB",
    route: "/help/settings",
    keywords: ["إعدادات", "إشعارات", "خصوصية", "لغة"],
  },
];

const FAQS: FaqItem[] = [
  {
    id: "create-report",
    question: "كيف يمكنني إنشاء بلاغ؟",
    answer:
      "يمكنك إنشاء بلاغ من زر البلاغ الموجود في الصفحة الرئيسية، ثم إضافة نوع الحالة والصور والموقع والوصف وإرسال البلاغ.",
    keywords: ["إنشاء بلاغ", "بلاغ", "إرسال", "حالة"],
  },
  {
    id: "track-report",
    question: "كيف أتابع حالة البلاغ؟",
    answer:
      "انتقل إلى قسم بلاغاتي من حسابك، ثم افتح البلاغ المطلوب لمشاهدة حالته وآخر التحديثات عليه.",
    keywords: ["متابعة البلاغ", "حالة البلاغ", "بلاغاتي"],
  },
  {
    id: "adoption-request",
    question: "كيف أقدّم طلب تبني؟",
    answer:
      "افتح صفحة الحيوان الذي ترغب في تبنيه، واضغط على تقديم طلب تبني، ثم أكمل البيانات المطلوبة وأرسل الطلب للمراجعة.",
    keywords: ["طلب تبني", "تبني", "حيوان"],
  },
];

const ARTICLES: ArticleItem[] = [
  {
    id: "first-aid",
    title: "دليل الإسعافات الأولية للحيوانات",
    duration: "3 دقائق",
    icon: "book-outline",
    route: "/help/articles/animal-first-aid",
    keywords: ["إسعافات", "أولية", "حيوان", "طوارئ"],
  },
  {
    id: "vaccinations",
    title: "أهمية التطعيمات الدورية",
    duration: "5 دقائق",
    icon: "shield-checkmark-outline",
    route: "/help/articles/vaccinations",
    keywords: ["تطعيم", "لقاح", "صحة"],
  },
  {
    id: "new-pet",
    title: "تجهيز منزلك للحيوان الأليف الجديد",
    duration: "4 دقائق",
    icon: "home-outline",
    route: "/help/articles/new-pet-home",
    keywords: ["منزل", "حيوان جديد", "تجهيز", "تبني"],
  },
];

const normalizeText = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");

export default function HelpCenterScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 18;
  const contentWidth = Math.min(width - horizontalPadding * 2, 620);
  const normalizedQuery = normalizeText(searchQuery);

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) {
      return CATEGORIES;
    }

    return CATEGORIES.filter((item) =>
      normalizeText([item.title, ...item.keywords].join(" ")).includes(
        normalizedQuery,
      ),
    );
  }, [normalizedQuery]);

  const filteredFaqs = useMemo(() => {
    if (!normalizedQuery) {
      return FAQS;
    }

    return FAQS.filter((item) =>
      normalizeText(
        [item.question, item.answer, ...item.keywords].join(" "),
      ).includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  const filteredArticles = useMemo(() => {
    if (!normalizedQuery) {
      return ARTICLES;
    }

    return ARTICLES.filter((item) =>
      normalizeText([item.title, ...item.keywords].join(" ")).includes(
        normalizedQuery,
      ),
    );
  }, [normalizedQuery]);

  const hasResults =
    filteredCategories.length > 0 ||
    filteredFaqs.length > 0 ||
    filteredArticles.length > 0;

  const openRoute = (route: string) => {
    router.push(route as never);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/" as never);
  };

  const handleContactUs = () => {
    router.push("/contact-us" as never);
  };

  const handleReportProblem = async () => {
    const subject = encodeURIComponent("الإبلاغ عن مشكلة في تطبيق ResQ");
    const body = encodeURIComponent(
      "نوع المشكلة:\n\nوصف المشكلة:\n\nالخطوات التي أدت إلى المشكلة:\n",
    );
    const url = `mailto:support@resq.app?subject=${subject}&body=${body}`;

    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
    }
  };

  const handleShare = async () => {
    await Share.share({
      title: "مركز مساعدة ResQ",
      message:
        "يمكنك الحصول على المساعدة والإجابة عن الأسئلة الشائعة من مركز مساعدة ResQ.",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={[styles.topBar, { paddingHorizontal: horizontalPadding }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="المساعدة"
            hitSlop={10}
            onPress={handleShare}
            style={({ pressed }) => [
              styles.topBarButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="help-circle-outline" size={24} color="#26211F" />
          </Pressable>

          <AppText style={styles.topBarTitle}>مركز المساعدة</AppText>

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
            <Ionicons name="arrow-forward-outline" size={25} color="#26211F" />
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

            <AppText style={styles.heroTitle}>كيف يمكننا مساعدتك؟</AppText>
            <AppText style={styles.heroDescription}>
              ابحث عن إجابات أو تصفّح المواضيع الأكثر شيوعًا.
            </AppText>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={22} color="#7C897E" />

              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="ابحث عن سؤال أو موضوع..."
                placeholderTextColor="#92928F"
                returnKeyType="search"
                style={styles.searchInput}
              />

              {searchQuery.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="مسح البحث"
                  hitSlop={8}
                  onPress={() => setSearchQuery("")}
                >
                  <Ionicons name="close-circle" size={20} color="#8C8985" />
                </Pressable>
              ) : null}
            </View>

            {!hasResults ? (
              <View style={styles.emptyCard}>
                <Ionicons name="search-outline" size={30} color="#8A817B" />
                <AppText style={styles.emptyTitle}>لا توجد نتائج</AppText>
                <AppText style={styles.emptyText}>
                  جرّب استخدام كلمات مختلفة، أو تواصل مع فريق الدعم.
                </AppText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="الانتقال إلى صفحة تواصل معنا"
                  onPress={handleContactUs}
                  style={({ pressed }) => [
                    styles.emptyButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText style={styles.emptyButtonText}>
                    التواصل مع الدعم
                  </AppText>
                </Pressable>
              </View>
            ) : (
              <>
                {filteredCategories.length > 0 ? (
                  <View style={styles.categoriesGrid}>
                    {filteredCategories.map((item) => (
                      <Pressable
                        key={item.id}
                        accessibilityRole="button"
                        accessibilityLabel={item.title}
                        onPress={() => openRoute(item.route)}
                        style={({ pressed }) => [
                          styles.categoryCard,
                          pressed && styles.cardPressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.categoryIcon,
                            { backgroundColor: item.iconBackground },
                          ]}
                        >
                          <Ionicons
                            name={item.icon}
                            size={22}
                            color={item.iconColor}
                          />
                        </View>

                        <AppText style={styles.categoryTitle}>
                          {item.title}
                        </AppText>
                      </Pressable>
                    ))}
                  </View>
                ) : null}

                {filteredFaqs.length > 0 ? (
                  <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>
                      الأسئلة الأكثر شيوعًا
                    </AppText>

                    <View style={styles.faqList}>
                      {filteredFaqs.map((item) => {
                        const isExpanded = expandedFaqId === item.id;

                        return (
                          <Pressable
                            key={item.id}
                            accessibilityRole="button"
                            accessibilityState={{ expanded: isExpanded }}
                            onPress={() =>
                              setExpandedFaqId((current) =>
                                current === item.id ? null : item.id,
                              )
                            }
                            style={({ pressed }) => [
                              styles.faqCard,
                              pressed && styles.cardPressed,
                            ]}
                          >
                            <View style={styles.faqHeader}>
                              <AppText style={styles.faqQuestion}>
                                {item.question}
                              </AppText>

                              <Ionicons
                                name={
                                  isExpanded
                                    ? "chevron-up-outline"
                                    : "chevron-down-outline"
                                }
                                size={20}
                                color="#35312E"
                              />
                            </View>

                            {isExpanded ? (
                              <AppText style={styles.faqAnswer}>
                                {item.answer}
                              </AppText>
                            ) : null}
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ) : null}

                {filteredArticles.length > 0 ? (
                  <View style={styles.section}>
                    <AppText style={styles.sectionTitle}>مقالات مقترحة</AppText>

                    <View style={styles.articlesCard}>
                      {filteredArticles.map((item, index) => (
                        <Pressable
                          key={item.id}
                          accessibilityRole="button"
                          onPress={() => openRoute(item.route)}
                          style={({ pressed }) => [
                            styles.articleRow,
                            index < filteredArticles.length - 1 &&
                              styles.articleBorder,
                            pressed && styles.articlePressed,
                          ]}
                        >
                          <Ionicons
                            name="chevron-back-outline"
                            size={20}
                            color="#829087"
                          />

                          <View style={styles.articleTextWrap}>
                            <AppText style={styles.articleTitle}>
                              {item.title}
                            </AppText>

                            <View style={styles.articleMeta}>
                              <Ionicons
                                name="time-outline"
                                size={14}
                                color="#69736C"
                              />
                              <AppText style={styles.articleDuration}>
                                {item.duration}
                              </AppText>
                            </View>
                          </View>

                          <View style={styles.articleIcon}>
                            <Ionicons
                              name={item.icon}
                              size={22}
                              color="#FF7E3D"
                            />
                          </View>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ) : null}
              </>
            )}

            <View style={styles.supportCard}>
              <AppText style={styles.supportTitle}>لم تجد ما تبحث عنه؟</AppText>
              <AppText style={styles.supportDescription}>
                يمكن لفريق الدعم مساعدتك في حل أي مشكلة أو الرد على استفساراتك.
              </AppText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="الانتقال إلى صفحة تواصل معنا"
                onPress={handleContactUs}
                style={({ pressed }) => [
                  styles.supportPrimaryButton,
                  pressed && styles.supportPressed,
                ]}
              >
                <Ionicons name="chatbox-outline" size={20} color="#FFFFFF" />
                <AppText style={styles.supportPrimaryText}>
                  التواصل مع الدعم
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={handleReportProblem}
                style={({ pressed }) => [
                  styles.supportSecondaryButton,
                  pressed && styles.supportPressed,
                ]}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <AppText style={styles.supportSecondaryText}>
                  الإبلاغ عن مشكلة
                </AppText>
              </Pressable>
            </View>

            <View style={styles.linksCard}>
              <Pressable
                onPress={() => openRoute("/privacy-policy")}
                style={({ pressed }) => [
                  styles.linkRow,
                  pressed && styles.linkPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={21}
                  color="#7C8A80"
                />
                <AppText style={styles.linkText}>سياسة الخصوصية</AppText>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#7C8A80"
                />
              </Pressable>

              <View style={styles.linkDivider} />

              <Pressable
                onPress={() => openRoute("/terms-and-conditions")}
                style={({ pressed }) => [
                  styles.linkRow,
                  pressed && styles.linkPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={21}
                  color="#7C8A80"
                />
                <AppText style={styles.linkText}>الشروط والأحكام</AppText>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#7C8A80"
                />
              </Pressable>

              <View style={styles.linkDivider} />

              <Pressable
                onPress={() => openRoute("/about")}
                style={({ pressed }) => [
                  styles.linkRow,
                  pressed && styles.linkPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={21}
                  color="#7C8A80"
                />
                <AppText style={styles.linkText}>حول ResQ</AppText>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#7C8A80"
                />
              </Pressable>

              <View style={styles.linkDivider} />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="الانتقال إلى صفحة تواصل معنا"
                onPress={handleContactUs}
                style={({ pressed }) => [
                  styles.linkRow,
                  pressed && styles.linkPressed,
                ]}
              >
                <Ionicons
                  name="chevron-back-outline"
                  size={21}
                  color="#7C8A80"
                />
                <AppText style={styles.linkText}>تواصل معنا</AppText>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color="#7C8A80"
                />
              </Pressable>
            </View>

            <View style={styles.footer}>
              <AppText style={styles.footerLogo}>ResQ</AppText>
              <AppText style={styles.footerCopyright}>
                جميع الحقوق محفوظة © 2024 ResQ
              </AppText>

              <View style={styles.footerLinks}>
                <Pressable onPress={() => openRoute("/privacy-policy")}>
                  <AppText style={styles.footerLink}>سياسة الخصوصية</AppText>
                </Pressable>

                <Pressable onPress={() => openRoute("/terms-and-conditions")}>
                  <AppText style={styles.footerLink}>الشروط والأحكام</AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
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
  },
  content: {
    alignSelf: "center",
    direction: "rtl",
  },
  heroImage: {
    width: "100%",
    height: 176,
    borderRadius: 14,
    backgroundColor: "#FFE4CE",
  },
  heroTitle: {
    width: "100%",
    marginTop: 15,
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: "#3B3531",
    textAlign: "center",
    writingDirection: "rtl",
  },
  heroDescription: {
    width: "100%",
    marginTop: 5,
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: "#756D68",
    textAlign: "center",
    writingDirection: "rtl",
  },
  searchContainer: {
    width: "100%",
    minHeight: 52,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 20,
    paddingHorizontal: 17,
    borderRadius: 26,
    backgroundColor: "#ECEAE7",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#383330",
    textAlign: "right",
    writingDirection: "rtl",
  },
  categoriesGrid: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginTop: 34,
  },
  categoryCard: {
    width: "48.3%",
    minHeight: 98,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#E2E4E2",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  categoryTitle: {
    marginTop: 8,
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#302B28",
    textAlign: "center",
    writingDirection: "rtl",
  },
  section: {
    width: "100%",
    marginTop: 28,
  },
  sectionTitle: {
    width: "100%",
    marginBottom: 12,
    fontFamily: FONTS.bold,
    fontSize: 21,
    color: "#282321",
    textAlign: "left",
    writingDirection: "rtl",
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    width: "100%",
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderRadius: 13,
    backgroundColor: "#F4F1ED",
  },
  faqHeader: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: "#332E2B",
    textAlign: "left",
    writingDirection: "rtl",
  },
  faqAnswer: {
    width: "100%",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DDD8D3",
    fontFamily: FONTS.regular,
    fontSize: 12.5,
    lineHeight: 22,
    color: "#655C56",
    textAlign: "left",
    writingDirection: "rtl",
  },
  articlesCard: {
    overflow: "hidden",
    width: "100%",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E0E3E0",
    backgroundColor: "#FFFFFF",
  },
  articleRow: {
    minHeight: 72,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  articleBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E3E5E3",
  },
  articlePressed: {
    backgroundColor: "#F6F6F5",
  },
  articleIcon: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#EAF3ED",
  },
  articleTextWrap: {
    flex: 1,
  },
  articleTitle: {
    width: "100%",
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#302B28",
    textAlign: "left",
    writingDirection: "rtl",
  },
  articleMeta: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  articleDuration: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#68716B",
    writingDirection: "rtl",
  },
  supportCard: {
    width: "100%",
    alignItems: "stretch",
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderRadius: 18,
    backgroundColor: "#FF8847",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  supportTitle: {
    width: "100%",
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    writingDirection: "rtl",
  },
  supportDescription: {
    width: "100%",
    marginTop: 7,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 20,
    color: "#FFF7F2",
    textAlign: "center",
    writingDirection: "rtl",
  },
  supportPrimaryButton: {
    minHeight: 46,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
    borderRadius: 23,
    backgroundColor: "#A84D00",
  },
  supportPrimaryText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: "#FFFFFF",
    writingDirection: "rtl",
  },
  supportSecondaryButton: {
    minHeight: 46,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 9,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#FFD3B8",
    backgroundColor: "#FF9A62",
  },
  supportSecondaryText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: "#FFFFFF",
    writingDirection: "rtl",
  },
  linksCard: {
    overflow: "hidden",
    width: "100%",
    marginTop: 28,
    borderRadius: 14,
    backgroundColor: "#EDEBE8",
  },
  linkRow: {
    minHeight: 54,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
  },
  linkText: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: "#3A3532",
    textAlign: "left",
    writingDirection: "rtl",
  },
  linkDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    backgroundColor: "#D9D6D2",
  },
  linkPressed: {
    backgroundColor: "#E4E1DD",
  },
  footer: {
    width: "100%",
    alignItems: "center",
    marginTop: 40,
    paddingTop: 25,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D8D5D2",
  },
  footerLogo: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: "#FF7438",
  },
  footerCopyright: {
    marginTop: 13,
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#6F6A66",
    textAlign: "center",
    writingDirection: "rtl",
  },
  footerLinks: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 12,
  },
  footerLink: {
    fontFamily: FONTS.regular,
    fontSize: 10.5,
    color: "#706A66",
    textDecorationLine: "underline",
    writingDirection: "rtl",
  },
  emptyCard: {
    width: "100%",
    alignItems: "center",
    marginTop: 28,
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
  },
  emptyTitle: {
    marginTop: 10,
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: "#38322F",
    textAlign: "center",
    writingDirection: "rtl",
  },
  emptyText: {
    marginTop: 6,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 20,
    color: "#716964",
    textAlign: "center",
    writingDirection: "rtl",
  },
  emptyButton: {
    marginTop: 15,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#B6530A",
  },
  emptyButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: "#FFFFFF",
    writingDirection: "rtl",
  },
  pressed: {
    opacity: 0.6,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  supportPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
});
