
import { listLinks } from "@/lib/links";      // ← ADD THIS
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const links = await listLinks();           // now works
  return <DashboardClient initialLinks={links} />;
}
