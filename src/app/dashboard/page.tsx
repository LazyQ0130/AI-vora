import { Dashboard } from "@/components/dashboard";
import { lessonSummaries } from "@/lib/course-engine";
export const metadata = { title: "学习中心" };
export default function DashboardPage() {
  return <Dashboard lessons={lessonSummaries} />;
}
