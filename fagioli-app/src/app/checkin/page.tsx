import { CheckinWizard } from "@/components/checkin/CheckinWizard";

export const metadata = {
  title: "Pre-Check-in | Carrozzeria Fagioli",
  description: "Compila il pre-check-in online e risparmia tempo in carrozzeria",
};

export default function CheckinPage() {
  return <CheckinWizard />;
}
