// حالات البلاغ ـ 
export type ReportStatus = 'pending' | 'approved' | 'closed';

export interface Report {
    id: string;
    description: string;      // وصف الحالة
    imageUrl: string;         // صورة الحالة
    latitude: number;         // الموقع الجغرافي
    longitude: number;
    status: ReportStatus;
    createdAt: string;        // تاريخ البلاغ
    userId: string;           // صاحب البلاغ
}

export interface FeedingPoint {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    description: string;
    userId: string;           // مين ضافها (لأن كل مستخدم بيعدل بس نقاطو)
}

export interface AdoptionPost {
    id: string;
    animalName: string;
    animalType: string;       // قط، كلب...
    description: string;
    imageUrl: string;
    userId: string;
    createdAt: string;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
}