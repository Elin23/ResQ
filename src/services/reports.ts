import { mockReports } from "../data/mockData";
import { Report } from "../types";

const USE_MOCK = true; //هي بنغيرها ل false بس نضيف الباك
const API_URL = "http://your-backend-later.com/api";

// تأخير وهمي ليشبه طلب إنترنت حقيقي
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getReports(): Promise<Report[]> {
  if (USE_MOCK) {
    await delay(500);
    return mockReports;
  }
  const res = await fetch(`${API_URL}/reports`);
  if (!res.ok) throw new Error("فشل تحميل البلاغات");
  return res.json();
}

export async function getReportById(id: string): Promise<Report | undefined> {
  if (USE_MOCK) {
    await delay(300);
    return mockReports.find((r) => r.id === id);
  }
  const res = await fetch(`${API_URL}/reports/${id}`);
  return res.json();
}
