import { View, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';

export default function ProfileScreen() {
  const [phone, setPhone] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input
        label="البحث عن ملجأ أو عيادة"
        placeholder="ابحث هنا..."
        icon="search"
      />
      <Input
        label="رقم التواصل"
        placeholder="9xx xxx xxx"
        prefix="+963"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        maxLength={9}
      />
      <Input
        label="وصف الحالة"
        placeholder="اكتب تفاصيل الموقع والحالة الصحية..."
        multiline
      />
      <Input
        label="مثال عن حقل بخطأ"
        placeholder="بريد إلكتروني"
        error="صيغة البريد الإلكتروني غير صحيحة"
      />
      <Button title="إرسال" onPress={() => {}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});