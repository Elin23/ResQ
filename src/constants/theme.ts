// src/constants/theme.ts

export const COLORS = {
    // palette ResQ الرسمية من الفيغما
    primary: '#FF8C42',       // Primary Orange
    secondary: '#4CAF50',     // Secondary Green
    success: '#91F78E',       // Success
    accent: '#2BB5F6',        // Accent Blue
    neutral: '#E2E2E5',       // Neutral
    danger: '#D32F2F',        // Danger

    // ألوان عامة (تدقيق! )
    background: '#FFFFFF',
    surface: '#F7F7F8',       // خلفية الكروت
    text: '#1A1A1A',
    textSecondary: '#666666',

    // ألوان حالات البلاغ، مربوطة بالـ palette
    statusPending: '#FF8C42',   // معلق = برتقالي
    statusApproved: '#2BB5F6',  // معروض للمساعدة = أزرق
    statusClosed: '#4CAF50',    // مغلق (تم الإنقاذ) = أخضر
};

export const FONTS = {
    regular: 'IBMPlexSansArabic_400Regular',
    medium: 'IBMPlexSansArabic_500Medium',
    bold: 'IBMPlexSansArabic_700Bold',
};

// أحجام حسب نظام Typography بالفيغما
export const FONT_SIZES = {
    displayLarge: 34,
    headline: 24,
    title: 18,
    body: 15,
    label: 12,
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};