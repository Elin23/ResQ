# ResQ

تطبيق جامعي مبني باستخدام Expo وReact Native وTypeScript لمساعدة الحيوانات وربط المستخدمين بالجمعيات والعيادات.

## نموذج الحسابات

يدعم التطبيق نوعين فقط من الحسابات:

- **مستخدم:** يرسل البلاغات، يتصفح الحالات، يتبنى، ويتقدم للتطوع لدى جمعية.
- **جهة:** عيادة بيطرية أو جمعية إنقاذ.

> التطوع ليس نوع حساب مستقلًا. المستخدم يرسل طلب تطوع إلى جمعية، وتدير الجمعية الطلب من حسابها.

## تشغيل المشروع

```bash
npm install
npm run start
```

الفحص قبل التسليم:

```bash
npm run check
```

## الهيكل

```text
app/                         مسارات Expo Router فقط
src/components/ui/           مكونات الواجهة العامة القابلة لإعادة الاستخدام
src/features/home/           مكونات الصفحة الرئيسية
src/features/search/         مكونات البحث
src/features/reports/        مكونات البلاغات
src/navigation/routes.ts     جميع مسارات التنقل المركزية
src/theme/                   ألوان وخطوط ومسافات التصميم
src/services/api/            عميل API ومعالجة الأخطاء والمهلة
src/services/                خدمات الميزات
src/types/                   الأنواع المشتركة ونموذج الحسابات
src/data/                    البيانات التجريبية
src/utils/                   الأدوات العامة
```

## قواعد الفريق

1. لا يُكتب مكوّن عام داخل ملف صفحة.
2. لا تُكتب ألوان أو مسارات جديدة مباشرةً إن كان لها ثابت موجود.
3. ملفات `app` مخصصة لربط المسار بالشاشة، والمنطق القابل لإعادة الاستخدام يوضع داخل `src`.
4. المكوّن الخاص بميزة يوضع داخل `src/features/<feature>/components`.
5. المكوّن العام يوضع داخل `src/components/ui`.
6. لا تستخدم `as never` لإخفاء خطأ مسار جديد؛ أضف المسار إلى `src/navigation/routes.ts` واستخدم مسارًا موجودًا.
7. شغّل `npm run check` قبل دمج أي فرع.

## ربط Backend

المشروع يعمل حاليًا بالبيانات التجريبية. عند توفر الخادم:

1. عدّل `apiUrl` في `src/constants/config.ts`.
2. غيّر `useMockApi` إلى `false`.
3. استخدم `apiRequest` من `src/services/api/client.ts` داخل خدمات الميزات.

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
  #ResQ Project
