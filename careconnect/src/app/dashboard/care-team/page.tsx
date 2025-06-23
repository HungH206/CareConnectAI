import type { Metadata } from "next"
import CareTeamClientPage from "./CareTeamClientPage"

export const metadata: Metadata = {
  title: "Care Team - CareConnect",
  description: "Connect with your healthcare providers through 5G technology",
}

export default function CareTeamPage() {
  return <CareTeamClientPage />
}
