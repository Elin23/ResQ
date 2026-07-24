import { AdoptionPost, FeedingPoint, Report } from "../types";

export const mockReports: Report[] = [
  {
    id: "1",
    description: "قطة مصابة برجلها قرب الجامع",
    imageUrl: "https://placekitten.com/300/200",
    latitude: 33.5138,
    longitude: 36.2765,
    status: "approved",
    createdAt: "2026-07-15T10:30:00",
    userId: "u1",
  },
  {
    id: "2",
    description: "كلب صغير ضايع بالحديقة",
    imageUrl: "https://placekitten.com/301/200",
    latitude: 33.5102,
    longitude: 36.2913,
    status: "pending",
    createdAt: "2026-07-16T14:00:00",
    userId: "u1",
  },
  {
    id: "3",
    description: "قطة جوعانة مع صغارها",
    imageUrl: "https://placekitten.com/302/200",
    latitude: 33.5201,
    longitude: 36.282,
    status: "closed",
    createdAt: "2026-07-10T09:15:00",
    userId: "u2",
  },
];

export const mockFeedingPoints: FeedingPoint[] = [
  {
    id: "f1",
    name: "نقطة إطعام الحديقة",
    latitude: 33.5155,
    longitude: 36.29,
    description: "أكل وماء يومياً الساعة 6 مساءً",
    userId: "u1",
  },
];

export const mockAdoptionPosts: AdoptionPost[] = [
  {
    id: "a1",
    animalName: "لولو",
    animalType: "قطة",
    description: "قطة شيرازية عمرها سنة، ملقحة وهادية",
    imageUrl: "https://placekitten.com/303/200",
    userId: "u2",
    createdAt: "2026-07-12T11:00:00",
  },
];
