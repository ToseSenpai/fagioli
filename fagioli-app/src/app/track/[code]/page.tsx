import { TrackingPage } from "@/components/tracking/TrackingPage";
import { isValidTrackingCode, normalizeTrackingCode } from "@/lib/tracking-code";
import { notFound } from "next/navigation";

interface TrackingPageRouteProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: TrackingPageRouteProps) {
  const resolvedParams = await params;
  const code = normalizeTrackingCode(resolvedParams.code);

  return {
    title: `Tracking ${code} | Carrozzeria Fagioli`,
    description: `Segui lo stato della tua riparazione - Codice: ${code}`,
  };
}

export default async function TrackingPageRoute({ params }: TrackingPageRouteProps) {
  const resolvedParams = await params;
  const code = normalizeTrackingCode(resolvedParams.code);

  // Validate tracking code format
  if (!isValidTrackingCode(code)) {
    notFound();
  }

  return <TrackingPage trackingCode={code} />;
}
