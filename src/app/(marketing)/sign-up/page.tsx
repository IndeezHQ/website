import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Create account",
  description: "Creating an account on the web is on its way.",
  robots: { index: false, follow: true },
};

export default function SignUpPage() {
  return (
    <ComingSoon
      title="Creating an account on the web is on its way"
      body="For now, accounts are made in the Indeez app. Sign up on the web is the next thing being built, so this page will do the job before long."
    />
  );
}
