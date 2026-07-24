import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Image,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "../src/components/AppText";
import Button from "../src/components/Button";
import { FONTS } from "../src/constants/theme";
import { completeOnboarding } from "../src/utils/onboardingStorage";

type OnboardingItem = {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
};

const ACTIVE_INDICATOR_COLOR = "#B25A08";
const INACTIVE_INDICATOR_COLOR = "#E7C8BB";

const ONBOARDING_ITEMS: OnboardingItem[] = [
  {
    id: "journey",
    image: require("../assets/images/onboarding/onboarding-1.png"),
    title: "ابدأ رحلتك مع ResQ",
    description:
      "سجّل الآن وساهم في إنقاذ الحيوانات ومتابعة البلاغات والمشاركة في المجتمع.",
  },
  {
    id: "community",
    image: require("../assets/images/onboarding/onboarding-2.png"),
    title: "ساهم في انتشار خدماتنا",
    description:
      "تعاون المتطوعين والجمعيات والعيادات يجعل الاستجابة أسرع وأكثر فاعلية.",
  },
  {
    id: "rescue",
    image: require("../assets/images/onboarding/onboarding-3.png"),
    title: "أنقذ حياة... ببلاغ واحد",
    description: "قد يكون بلاغك سببًا في إنقاذ حيوان يحتاج للمساعدة.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(24)).current;
  const contentScale = useRef(new Animated.Value(0.96)).current;
  const imageFloat = useRef(new Animated.Value(0)).current;
  const backgroundGlow = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(20)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const currentItem = ONBOARDING_ITEMS[currentIndex];
  const isLastSlide = currentIndex === ONBOARDING_ITEMS.length - 1;

  const isCompact = height < 700;
  const isTablet = width >= 600;

  const horizontalPadding = isTablet
    ? Math.min(width * 0.14, 90)
    : Math.max(24, width * 0.06);

  const cardWidth = Math.min(
    width - horizontalPadding * 2,
    isTablet ? 520 : 410,
  );

  const cardHeight = isTablet
    ? Math.min(height * 0.48, 490)
    : Math.min(cardWidth, isCompact ? height * 0.42 : height * 0.44);

  const titleSize = isTablet ? 34 : Math.max(25, Math.min(width * 0.068, 30));

  const descriptionSize = isTablet
    ? 19
    : Math.max(15, Math.min(width * 0.041, 17));

  const buttonHeight = isTablet ? 62 : isCompact ? 52 : 57;

  const brandSize = Math.max(27, Math.min(width * 0.075, 34));

  const startEntranceAnimation = () => {
    contentOpacity.setValue(0);
    contentTranslateY.setValue(24);
    contentScale.setValue(0.96);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 560,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(contentScale, {
        toValue: 1,
        friction: 8,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    startEntranceAnimation();

    Animated.parallel([
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 600,
        delay: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(imageFloat, {
          toValue: -6,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(imageFloat, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundGlow, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(backgroundGlow, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    floatingAnimation.start();
    glowAnimation.start();

    return () => {
      floatingAnimation.stop();
      glowAnimation.stop();
    };
  }, [
    backgroundGlow,
    buttonOpacity,
    buttonTranslateY,
    contentOpacity,
    contentScale,
    contentTranslateY,
    imageFloat,
  ]);

  const glowScale = backgroundGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.12],
  });

  const glowOpacity = backgroundGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.2],
  });

  const indicatorWidths = useMemo(
    () => ONBOARDING_ITEMS.map((_, index) => (index === currentIndex ? 32 : 8)),
    [currentIndex],
  );

  const animateToSlide = (nextIndex: number) => {
    if (
      isChanging ||
      isCompleting ||
      nextIndex === currentIndex ||
      nextIndex < 0 ||
      nextIndex >= ONBOARDING_ITEMS.length
    ) {
      return;
    }

    setIsChanging(true);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: -12,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 0.98,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        setIsChanging(false);
        return;
      }

      setCurrentIndex(nextIndex);
      contentTranslateY.setValue(24);
      contentScale.setValue(0.96);

      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 440,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(contentScale, {
          toValue: 1,
          friction: 8,
          tension: 55,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsChanging(false);
      });
    });
  };

  const navigateToWelcome = async () => {
    if (isCompleting) {
      return;
    }

    try {
      setIsCompleting(true);
      await completeOnboarding();
      router.replace("/welcome" as never);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNext = async () => {
    if (isChanging || isCompleting) {
      return;
    }

    if (isLastSlide) {
      await navigateToWelcome();
      return;
    }

    animateToSlide(currentIndex + 1);
  };

  const handleSkip = async () => {
    await navigateToWelcome();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.topGlow,
            {
              width: width * 1.15,
              height: width * 1.15,
              borderRadius: width,
              top: -width * 0.78,
              right: -width * 0.28,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            styles.bottomGlow,
            {
              width: width * 1.35,
              height: width * 1.35,
              borderRadius: width,
              bottom: -width * 0.82,
              left: -width * 0.44,
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <View
          style={[
            styles.header,
            {
              paddingHorizontal: horizontalPadding,
              paddingTop: isCompact ? 4 : 10,
            },
          ]}
        >
          <Button
            title="تخطي"
            onPress={handleSkip}
            variant="text"
            size="small"
            fullWidth={false}
            disabled={isChanging || isCompleting}
            textColor="#A94D12"
            radius={16}
            style={styles.skipButton}
            textStyle={styles.skipText}
          />
        </View>

        <Animated.View
          style={[
            styles.mainContent,
            {
              paddingHorizontal: horizontalPadding,
              opacity: contentOpacity,
              transform: [
                { translateY: contentTranslateY },
                { scale: contentScale },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.imageCard,
              {
                width: cardWidth,
                height: cardHeight,
                borderRadius: isTablet ? 34 : 26,
                transform: [{ translateY: imageFloat }],
              },
            ]}
          >
            <View style={styles.imageCardHighlight} />

            <Image
              source={currentItem.image}
              resizeMode="cover"
              style={styles.image}
            />
          </Animated.View>

          <View
            style={[
              styles.textSection,
              {
                width: cardWidth,
                marginTop: isCompact ? 18 : 28,
              },
            ]}
          >
            {currentIndex === 0 ? (
              <View style={styles.firstTitleRow}>
                <View style={styles.brandRow}>
                  <Ionicons
                    name="paw"
                    size={brandSize * 0.68}
                    color="#242424"
                  />

                  <View style={styles.brandNameRow}>
                    <AppText
                      style={[
                        styles.brandAccent,
                        {
                          fontSize: brandSize,
                          lineHeight: brandSize * 1.25,
                        },
                      ]}
                    >
                      Q
                    </AppText>

                    <AppText
                      style={[
                        styles.brandText,
                        {
                          fontSize: brandSize,
                          lineHeight: brandSize * 1.25,
                        },
                      ]}
                    >
                      Res
                    </AppText>
                  </View>
                </View>

                <AppText
                  style={[
                    styles.firstTitle,
                    {
                      fontSize: titleSize,
                      lineHeight: titleSize * 1.4,
                    },
                  ]}
                >
                  ابدأ رحلتك مع
                </AppText>
              </View>
            ) : (
              <AppText
                style={[
                  styles.title,
                  {
                    fontSize: titleSize,
                    lineHeight: titleSize * 1.45,
                  },
                ]}
              >
                {currentItem.title}
              </AppText>
            )}

            <AppText
              style={[
                styles.description,
                {
                  fontSize: descriptionSize,
                  lineHeight: descriptionSize * 1.8,
                  marginTop: isCompact ? 8 : 12,
                },
              ]}
            >
              {currentItem.description}
            </AppText>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.footer,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: isCompact ? 8 : 16,
              opacity: buttonOpacity,
              transform: [{ translateY: buttonTranslateY }],
            },
          ]}
        >
          <View style={styles.indicators}>
            {ONBOARDING_ITEMS.map((item, index) => {
              const active = index === currentIndex;

              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`الانتقال إلى الصفحة ${index + 1}`}
                  accessibilityState={{ selected: active }}
                  disabled={isChanging || isCompleting}
                  onPress={() => animateToSlide(index)}
                  hitSlop={10}
                  style={({ pressed }) => [
                    styles.indicatorTouchArea,
                    pressed && styles.indicatorPressed,
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.indicator,
                      {
                        width: indicatorWidths[index],
                        backgroundColor: active
                          ? ACTIVE_INDICATOR_COLOR
                          : INACTIVE_INDICATOR_COLOR,
                      },
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>

          <Button
            title={isLastSlide ? "ابدأ الآن" : "التالي"}
            onPress={handleNext}
            variant="custom"
            size="large"
            icon={isLastSlide ? "paw-outline" : "arrow-forward"}
            iconPosition="end"
            iconSize={21}
            loading={isCompleting}
            loadingText="جاري الانتقال..."
            disabled={isChanging}
            fullWidth
            backgroundColor="#FF8748"
            borderColor="#FF8748"
            borderWidth={0}
            textColor="#673015"
            radius={14}
            style={[
              styles.nextButton,
              {
                width: cardWidth,
                height: buttonHeight,
                minHeight: buttonHeight,
              },
            ]}
            textStyle={styles.nextButtonText}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAFAFE",
  },
  screen: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#FAFAFE",
  },
  topGlow: {
    position: "absolute",
    backgroundColor: "#FFE3D7",
  },
  bottomGlow: {
    position: "absolute",
    backgroundColor: "#BDF4CC",
  },
  header: {
    width: "100%",
    minHeight: 54,
    alignItems: "flex-start",
    justifyContent: "center",
    zIndex: 10,
  },
  skipButton: {
    alignSelf: "flex-start",
    minWidth: 68,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  skipText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: "#A94D12",
    textAlign: "center",
  },
  mainContent: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  imageCard: {
    overflow: "hidden",
    backgroundColor: "#FFF9F4",
    borderWidth: 1,
    borderColor: "rgba(255, 188, 151, 0.22)",
    shadowColor: "#B45A2B",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    elevation: 4,
  },
  imageCardHighlight: {
    position: "absolute",
    width: "80%",
    height: "55%",
    top: "-20%",
    left: "-15%",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    transform: [{ rotate: "-12deg" }],
    zIndex: 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  firstTitleRow: {
    width: "100%",
    direction: "ltr",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    columnGap: 8,
  },
  firstTitle: {
    fontFamily: FONTS.bold,
    color: "#242424",
    textAlign: "center",
    writingDirection: "rtl",
  },
  title: {
    fontFamily: FONTS.bold,
    color: "#242424",
    textAlign: "center",
  },
  brandRow: {
    direction: "ltr",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  brandNameRow: {
    direction: "ltr",
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  brandText: {
    fontFamily: FONTS.bold,
    color: "#242424",
    textAlign: "center",
    includeFontPadding: false,
  },
  brandAccent: {
    fontFamily: FONTS.bold,
    color: "#FF8248",
    textAlign: "center",
    includeFontPadding: false,
  },
  description: {
    maxWidth: 470,
    fontFamily: FONTS.regular,
    color: "#6B5C55",
    textAlign: "center",
  },
  footer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 20,
  },
  indicators: {
    minHeight: 24,
    direction: "ltr",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  indicatorTouchArea: {
    minWidth: 16,
    minHeight: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },
  indicator: {
    height: 8,
    borderRadius: 999,
  },
  nextButton: {
    direction: "ltr",
    maxWidth: 520,
    paddingVertical: 0,
    shadowColor: "#E8783C",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 7,
  },
  nextButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 17,
    color: "#673015",
    textAlign: "center",
  },
});
