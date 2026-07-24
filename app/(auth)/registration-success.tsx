import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/src/components/AppText";
import { FONTS } from "@/src/constants/theme";

type AccountType = "user" | "volunteer" | "entity";
type EntityType = "clinic" | "organization";
type AccountStatus = "active" | "pending";

type IoniconName = keyof typeof Ionicons.glyphMap;

type Capability = {
  id: string;
  title: string;
  description: string;
  icon: IoniconName;
};

type RoleContent = {
  roleLabel: string;
  welcomeTitle: string;
  welcomeDescription: string;
  statusTitle: string;
  statusDescription: string;
  status: AccountStatus;
  heroIcon: IoniconName;
  capabilitiesTitle: string;
  capabilitiesDescription: string;
  capabilities: Capability[];
  primaryButtonTitle: string;
  primaryButtonPathname: string;
  secondaryButtonTitle?: string;
  secondaryButtonPathname?: string;
};

const USER_CAPABILITIES: Capability[] = [
  {
    id: "browse",
    title: "تصفح الحيوانات",
    description: "استكشاف الحيوانات والحالات المتاحة داخل التطبيق",
    icon: "paw-outline",
  },
  {
    id: "adoption",
    title: "تقديم طلبات التبني",
    description: "اختيار الحيوان المناسب ومتابعة حالة طلب التبني",
    icon: "home-outline",
  },
  {
    id: "reports",
    title: "إرسال البلاغات",
    description: "الإبلاغ عن حيوان ضال أو مصاب يحتاج إلى المساعدة",
    icon: "alert-circle-outline",
  },
  {
    id: "donations",
    title: "التبرع للحملات",
    description: "دعم حملات الإنقاذ والعلاج والرعاية",
    icon: "heart-outline",
  },
  {
    id: "map",
    title: "استخدام الخريطة التفاعلية",
    description: "العثور على الجمعيات والعيادات والخدمات القريبة",
    icon: "map-outline",
  },
];

const VOLUNTEER_CAPABILITIES: Capability[] = [
  {
    id: "rescue-tasks",
    title: "استقبال مهام الإنقاذ",
    description: "متابعة مهام الإنقاذ والحالات المسندة إليك",
    icon: "notifications-outline",
  },
  {
    id: "rescue",
    title: "المشاركة في عمليات الإنقاذ",
    description: "المساهمة ميدانيًا في مساعدة الحيوانات المحتاجة",
    icon: "medkit-outline",
  },
  {
    id: "success-stories",
    title: "إضافة قصص النجاح",
    description: "توثيق نتائج الإنقاذ والتعافي والتبني الناجح",
    icon: "sparkles-outline",
  },
  {
    id: "browse",
    title: "تصفح الحيوانات",
    description: "استكشاف الحيوانات والحالات المنشورة داخل التطبيق",
    icon: "paw-outline",
  },
  {
    id: "adoption",
    title: "تقديم طلبات التبني",
    description: "الاستفادة من ميزات التبني المتاحة لجميع المستخدمين",
    icon: "home-outline",
  },
  {
    id: "donations",
    title: "التبرع للحملات",
    description: "دعم حملات العلاج والإنقاذ والرعاية",
    icon: "heart-outline",
  },
  {
    id: "activity-history",
    title: "متابعة سجل المشاركات",
    description: "الاطلاع على المهام والإنجازات السابقة",
    icon: "time-outline",
  },
];

const CLINIC_CAPABILITIES: Capability[] = [
  {
    id: "ads",
    title: "نشر وإدارة الإعلانات",
    description: "التعريف بخدمات العيادة وعروضها داخل التطبيق",
    icon: "megaphone-outline",
  },
  {
    id: "adoption",
    title: "عرض حيوانات للتبني",
    description: "إضافة حالات تبنٍ جديدة ومتابعة طلباتها",
    icon: "add-circle-outline",
  },
  {
    id: "map",
    title: "الظهور على الخريطة التفاعلية",
    description: "إظهار موقع العيادة وبيانات التواصل للمستخدمين",
    icon: "location-outline",
  },
  {
    id: "browse",
    title: "تصفح الحالات",
    description: "الاطلاع على الحيوانات والبلاغات المنشورة",
    icon: "search-outline",
  },
  {
    id: "donations",
    title: "التبرع للحملات",
    description: "المساهمة في دعم حالات الإنقاذ والعلاج",
    icon: "heart-outline",
  },
  {
    id: "profile",
    title: "إدارة ملف العيادة",
    description: "تحديث الخدمات وساعات العمل ومعلومات التواصل",
    icon: "business-outline",
  },
];

const ORGANIZATION_CAPABILITIES: Capability[] = [
  {
    id: "adoption",
    title: "عرض حيوانات للتبني",
    description: "إضافة الحالات ومتابعة طلبات التبني الواردة",
    icon: "paw-outline",
  },
  {
    id: "ads",
    title: "نشر وإدارة الإعلانات",
    description: "التعريف بأنشطة الجمعية وأخبارها وخدماتها",
    icon: "megaphone-outline",
  },
  {
    id: "campaigns",
    title: "إضافة حملات التبرع",
    description: "إنشاء الحملات ومتابعة المساهمات المالية",
    icon: "heart-circle-outline",
  },
  {
    id: "volunteers",
    title: "استقبال طلبات المتطوعين",
    description: "مراجعة الطلبات وتنظيم فريق المتطوعين",
    icon: "people-outline",
  },

  {
    id: "map",
    title: "الظهور على الخريطة التفاعلية",
    description: "إظهار موقع الجمعية وبيانات التواصل للمستخدمين",
    icon: "map-outline",
  },
];

const createRoleContent = (
  accountType: AccountType,
  entityType: EntityType | undefined,
  statusParam: string | undefined,
): RoleContent => {
  if (accountType === "user") {
    return {
      roleLabel: "حساب مستخدم",
      welcomeTitle: "مرحبًا بك في ResQ",
      welcomeDescription:
        "تم تأكيد رقم هاتفك وإنشاء حسابك بنجاح. يمكنك الآن البدء بمساعدة الحيوانات.",
      statusTitle: "حسابك نشط",
      statusDescription: "جميع ميزات المستخدم متاحة الآن",
      status: "active",
      heroIcon: "paw",
      capabilitiesTitle: "ابدأ من هنا",
      capabilitiesDescription: "أهم الأشياء التي يمكنك القيام بها داخل التطبيق",
      capabilities: USER_CAPABILITIES,
      primaryButtonTitle: "الانتقال إلى الصفحة الرئيسية",
      primaryButtonPathname: "/home",
      secondaryButtonTitle: "إكمال الملف الشخصي",
      secondaryButtonPathname: "/profile/edit",
    };
  }

  if (accountType === "volunteer") {
    const isActive = statusParam === "active";

    return {
      roleLabel: "حساب متطوع",
      welcomeTitle: isActive
        ? "أهلًا بك ضمن فريق الإنقاذ"
        : "تم استلام طلب التطوع",
      welcomeDescription: isActive
        ? "تم تفعيل حسابك كمتطوع، وأصبحت أدوات الإنقاذ والتطوع متاحة لك."
        : "تم تأكيد رقم هاتفك وإنشاء حسابك. طلب التطوع قيد المراجعة، ويمكنك استخدام الميزات العامة في هذه الأثناء.",
      statusTitle: isActive ? "حساب المتطوع نشط" : "طلب التطوع قيد المراجعة",
      statusDescription: isActive
        ? "أصبحت صلاحيات الإنقاذ والتطوع متاحة في حسابك"
        : "سنرسل لك إشعارًا فور اتخاذ قرار بشأن الطلب",
      status: isActive ? "active" : "pending",
      heroIcon: "hand-left",
      capabilitiesTitle: isActive ? "صلاحيات المتطوع" : "ما يمكنك فعله الآن",
      capabilitiesDescription: isActive
        ? "أدوات تساعدك على المشاركة في الإنقاذ والتطوع"
        : "بعض الميزات ستتفعّل بعد قبول طلب التطوع",
      capabilities: VOLUNTEER_CAPABILITIES,
      primaryButtonTitle: "متابعة إلى التطبيق",
      primaryButtonPathname: "/home",
      secondaryButtonTitle: "إكمال الملف الشخصي",
      secondaryButtonPathname: "/profile/edit",
    };
  }

  if (entityType === "clinic") {
    const isActive = statusParam === "active";

    return {
      roleLabel: "حساب عيادة",
      welcomeTitle: isActive
        ? "تم اعتماد العيادة"
        : "تم إرسال طلب تسجيل العيادة",
      welcomeDescription: isActive
        ? "أصبحت صفحة العيادة وخدماتها متاحة للمستخدمين داخل ResQ."
        : "تم تأكيد رقم هاتف مسؤول العيادة. سنراجع البيانات والوثائق قبل إظهار العيادة للمستخدمين.",
      statusTitle: isActive ? "العيادة معتمدة ونشطة" : "العيادة قيد المراجعة",
      statusDescription: isActive
        ? "تظهر العيادة على الخريطة ويمكنها إدارة الإعلانات"
        : "سيتم إشعارك عند اعتماد الطلب أو طلب معلومات إضافية",
      status: isActive ? "active" : "pending",
      heroIcon: "medkit",
      capabilitiesTitle: isActive ? "أدوات العيادة" : "الميزات بعد الاعتماد",
      capabilitiesDescription:
        "يمكن للعيادة إدارة ظهورها وخدماتها والمساهمة في حالات التبني",
      capabilities: CLINIC_CAPABILITIES,
      primaryButtonTitle: "فتح لوحة العيادة",
      primaryButtonPathname: "/entity-dashboard",
      secondaryButtonTitle: "معاينة الملف العام",
      secondaryButtonPathname: "/entity-profile",
    };
  }

  const isActive = statusParam === "active";

  return {
    roleLabel: "حساب جمعية",
    welcomeTitle: isActive ? "تم اعتماد الجمعية" : "تم إرسال طلب تسجيل الجمعية",
    welcomeDescription: isActive
      ? "أصبحت الجمعية جاهزة لإدارة الحالات والمتطوعين والحملات داخل ResQ."
      : "تم تأكيد رقم هاتف مسؤول الجمعية. سنراجع البيانات والوثائق قبل تفعيل ميزات الجمعية.",
    statusTitle: isActive ? "الجمعية معتمدة ونشطة" : "الجمعية قيد المراجعة",
    statusDescription: isActive
      ? "يمكن للجمعية استقبال المتطوعين وإدارة الحملات"
      : "سيتم إشعارك فور اكتمال مراجعة الطلب",
    status: isActive ? "active" : "pending",
    heroIcon: "people",
    capabilitiesTitle: isActive ? "أدوات الجمعية" : "الميزات بعد الاعتماد",
    capabilitiesDescription:
      "كل ما تحتاجه الجمعية لإدارة التبني والتطوع والتبرعات",
    capabilities: ORGANIZATION_CAPABILITIES,
    primaryButtonTitle: "فتح لوحة الجمعية",
    primaryButtonPathname: "/entity-dashboard",
    secondaryButtonTitle: "معاينة الملف العام",
    secondaryButtonPathname: "/entity-profile",
  };
};

export default function RegistrationSuccessScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const params = useLocalSearchParams<{
    accountType?: string;
    entityType?: string;
    status?: string;
    name?: string;
    email?: string;
  }>();

  const accountType: AccountType =
    params.accountType === "volunteer"
      ? "volunteer"
      : params.accountType === "entity"
        ? "entity"
        : "user";

  const entityType: EntityType | undefined =
    params.entityType === "clinic"
      ? "clinic"
      : params.entityType === "organization"
        ? "organization"
        : undefined;

  const statusParam = Array.isArray(params.status)
    ? params.status[0]
    : params.status;

  const displayName = useMemo(() => {
    const name = Array.isArray(params.name) ? params.name[0] : params.name;
    return name?.trim() || "";
  }, [params.name]);

  const content = useMemo(
    () => createRoleContent(accountType, entityType, statusParam),
    [accountType, entityType, statusParam],
  );

  const horizontalPadding = width >= 700 ? Math.min(width * 0.15, 120) : 20;
  const contentWidth = Math.min(width - horizontalPadding * 2, 560);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.content, { width: contentWidth }]}>
          <View style={styles.brandRow}>
            <Ionicons name="paw" size={22} color="#20201F" />
            <AppText style={styles.brandText}>
              Res<AppText style={styles.brandAccent}>Q</AppText>
            </AppText>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroDecorationOne} />
            <View style={styles.heroDecorationTwo} />

            <View style={styles.heroIconHalo}>
              <View style={styles.heroIconCircle}>
                <Ionicons name={content.heroIcon} size={42} color="#A6511C" />
              </View>

              <View style={styles.heroCheck}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              </View>
            </View>

            <View style={styles.rolePill}>
              <AppText style={styles.rolePillText}>{content.roleLabel}</AppText>
            </View>

            <AppText style={styles.title}>
              {displayName ? `مرحبًا ${displayName}` : content.welcomeTitle}
            </AppText>

            <AppText style={styles.description}>
              {content.welcomeDescription}
            </AppText>
          </View>

          <View
            style={[
              styles.statusCard,
              content.status === "active"
                ? styles.activeStatusCard
                : styles.pendingStatusCard,
            ]}
          >
            <View
              style={[
                styles.statusIcon,
                content.status === "active"
                  ? styles.activeStatusIcon
                  : styles.pendingStatusIcon,
              ]}
            >
              <Ionicons
                name={
                  content.status === "active"
                    ? "shield-checkmark"
                    : "time-outline"
                }
                size={23}
                color={content.status === "active" ? "#16833A" : "#B86625"}
              />
            </View>

            <View style={styles.statusTextContainer}>
              <View style={styles.statusTitleRow}>
                <AppText style={styles.statusLabel}>حالة الحساب</AppText>

                <View
                  style={[
                    styles.statusDot,
                    content.status === "active"
                      ? styles.activeStatusDot
                      : styles.pendingStatusDot,
                  ]}
                />
              </View>

              <AppText
                style={[
                  styles.statusTitle,
                  content.status === "active"
                    ? styles.activeStatusTitle
                    : styles.pendingStatusTitle,
                ]}
              >
                {content.statusTitle}
              </AppText>

              <AppText style={styles.statusDescription}>
                {content.statusDescription}
              </AppText>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>
              {content.capabilitiesTitle}
            </AppText>
            <AppText style={styles.sectionDescription}>
              {content.capabilitiesDescription}
            </AppText>
          </View>

          <View style={styles.capabilitiesCard}>
            {content.capabilities.map((capability, index) => (
              <View
                key={capability.id}
                style={[
                  styles.capabilityRow,
                  index < content.capabilities.length - 1 &&
                    styles.capabilityRowBorder,
                ]}
              >
                <View style={styles.capabilityCheck}>
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                </View>

                <View style={styles.capabilityTextContainer}>
                  <View style={styles.capabilityTitleRow}>
                    <Ionicons
                      name={capability.icon}
                      size={19}
                      color="#19723A"
                    />
                    <AppText style={styles.capabilityTitle}>
                      {capability.title}
                    </AppText>
                  </View>

                  <AppText style={styles.capabilityDescription}>
                    {capability.description}
                  </AppText>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileIcon}>
              <Ionicons
                name="person-circle-outline"
                size={28}
                color="#59635A"
              />
            </View>

            <View style={styles.profileTextContainer}>
              <AppText style={styles.profileTitle}>أكمل بيانات حسابك</AppText>
              <AppText style={styles.profileDescription}>
                الملف المكتمل يزيد الثقة ويسهّل التواصل
              </AppText>
            </View>

            <View style={styles.progressContainer}>
              <AppText style={styles.progressText}>60%</AppText>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.replace(content.primaryButtonPathname as never)
            }
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <AppText style={styles.primaryButtonText}>
              {content.primaryButtonTitle}
            </AppText>
            <Ionicons name="arrow-back-outline" size={21} color="#FFFFFF" />
          </Pressable>

          {content.secondaryButtonTitle && content.secondaryButtonPathname ? (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push(content.secondaryButtonPathname as never)
              }
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <AppText style={styles.secondaryButtonText}>
                {content.secondaryButtonTitle}
              </AppText>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F8FB",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 28,
  },
  content: {
    alignSelf: "center",
  },
  brandRow: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginBottom: 16,
  },
  brandText: {
    fontFamily: FONTS.bold,
    fontSize: 25,
    color: "#20201F",
  },
  brandAccent: {
    fontFamily: FONTS.bold,
    fontSize: 25,
    color: "#FF8142",
  },
  heroCard: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 21,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EEE7E2",
    backgroundColor: "#FFFFFF",
  },
  heroDecorationOne: {
    position: "absolute",
    top: -45,
    right: -35,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#FFF1E8",
  },
  heroDecorationTwo: {
    position: "absolute",
    bottom: -55,
    left: -45,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#ECF6EE",
  },
  heroIconHalo: {
    position: "relative",
    width: 102,
    height: 102,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 51,
    backgroundColor: "#FFF4EC",
  },
  heroIconCircle: {
    width: 74,
    height: 74,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 37,
    borderWidth: 1,
    borderColor: "#F1C7AA",
    backgroundColor: "#FFFFFF",
  },
  heroCheck: {
    position: "absolute",
    right: 2,
    bottom: 7,
    width: 29,
    height: 29,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#FFF4EC",
    backgroundColor: "#16833A",
  },
  rolePill: {
    marginTop: 13,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#FFF0E6",
  },
  rolePillText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: "#A6521D",
    textAlign: "center",
  },
  title: {
    marginTop: 12,
    fontFamily: FONTS.bold,
    fontSize: 25,
    lineHeight: 35,
    color: "#24201E",
    textAlign: "center",
    writingDirection: "rtl",
  },
  description: {
    maxWidth: 430,
    marginTop: 7,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 23,
    color: "#6D6560",
    textAlign: "center",
    writingDirection: "rtl",
  },
  statusCard: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginTop: 14,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 17,
    borderWidth: 1,
  },
  activeStatusCard: {
    borderColor: "#C9DECD",
    backgroundColor: "#F3F9F4",
  },
  pendingStatusCard: {
    borderColor: "#EACDB8",
    backgroundColor: "#FFF7F1",
  },
  statusIcon: {
    width: 47,
    height: 47,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  activeStatusIcon: {
    backgroundColor: "#E2F1E5",
  },
  pendingStatusIcon: {
    backgroundColor: "#FFE8D7",
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitleRow: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusLabel: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: "#746E69",
    textAlign: "left",
    writingDirection: "rtl",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  activeStatusDot: {
    backgroundColor: "#16833A",
  },
  pendingStatusDot: {
    backgroundColor: "#C36A29",
  },
  statusTitle: {
    marginTop: 3,
    fontFamily: FONTS.bold,
    fontSize: 16,
    textAlign: "left",
    writingDirection: "rtl",
  },
  activeStatusTitle: {
    color: "#176F32",
  },
  pendingStatusTitle: {
    color: "#A9571C",
  },
  statusDescription: {
    marginTop: 2,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 18,
    color: "#6A6662",
    textAlign: "left",
    writingDirection: "rtl",
  },
  sectionHeader: {
    width: "100%",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 21,
    color: "#292522",
    textAlign: "left",
    writingDirection: "rtl",
  },
  sectionDescription: {
    marginTop: 4,
    fontFamily: FONTS.regular,
    fontSize: 12,
    lineHeight: 19,
    color: "#746D68",
    textAlign: "left",
    writingDirection: "rtl",
  },
  capabilitiesCard: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E4E7E3",
    backgroundColor: "#FFFFFF",
  },
  capabilityRow: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  capabilityRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8EAE7",
  },
  capabilityCheck: {
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    borderRadius: 13,
    backgroundColor: "#16833A",
  },
  capabilityTextContainer: {
    flex: 1,
  },
  capabilityTitleRow: {
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  capabilityTitle: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: "#2D2926",
    textAlign: "left",
    writingDirection: "rtl",
  },
  capabilityDescription: {
    marginTop: 4,
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 18,
    color: "#746F6B",
    textAlign: "left",
    writingDirection: "rtl",
  },
  profileCard: {
    width: "100%",
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8D0C8",
    backgroundColor: "#FAF8F5",
  },
  profileIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
  },
  profileTextContainer: {
    flex: 1,
  },
  profileTitle: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: "#34302D",
    textAlign: "left",
    writingDirection: "rtl",
  },
  profileDescription: {
    marginTop: 2,
    fontFamily: FONTS.regular,
    fontSize: 10.5,
    color: "#77716C",
    textAlign: "left",
    writingDirection: "rtl",
  },
  progressContainer: {
    alignItems: "center",
    gap: 5,
  },
  progressText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: "#177234",
  },
  progressTrack: {
    width: 56,
    height: 6,
    overflow: "hidden",
    borderRadius: 3,
    backgroundColor: "#E5E5E2",
  },
  progressFill: {
    width: "60%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#177234",
  },
  primaryButton: {
    width: "100%",
    minHeight: 57,
    direction: "rtl",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 22,
    borderRadius: 17,
    backgroundColor: "#FF8849",
  },
  primaryButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  primaryButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },
  secondaryButton: {
    width: "100%",
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "#687866",
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonPressed: {
    opacity: 0.65,
  },
  secondaryButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#176F32",
    textAlign: "center",
  },
});
