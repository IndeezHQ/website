import type { Metadata } from "next";

import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Signing in on the web is on its way.",
  // A placeholder outranking nothing is fine; a placeholder ranking for
  // "Indeez sign in" is not.
  robots: { index: false, follow: true },
};

export default function SignInPage() {
  return (
    <ComingSoon
      title="Signing in on the web is on its way"
      body="Accounts live in the Indeez app for now. Web sign in is the next thing being built, along with password resets and account settings."
    />
  );
}
