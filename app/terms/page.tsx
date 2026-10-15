import Link from "next/link"
import { LegalPage } from "@/components/legal-page"
import { LEGAL_CONTACT_EMAIL, LEGAL_OWNER } from "@/lib/legal"

export const metadata = {
  title: "Terms of use | NeuRafiki",
  description: "The rules for using NeuRafiki: screening not diagnosis, accounts, children, payments and the AI companion.",
}

const email = <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      intro={`These terms apply when you use NeuRafiki, run by ${LEGAL_OWNER}. By creating an account or using the site, you agree to them. Please also read our privacy policy.`}
      sections={[
        {
          id: "not-medical",
          heading: "Screening, not diagnosis",
          body: (
            <p>
              NeuRafiki helps identify areas that may benefit from a professional assessment. It doesn&apos;t
              diagnose, treat or replace qualified professionals. Talk to a doctor, psychologist or educational
              professional about decisions for a particular person. In an emergency, contact local emergency services
              or see our <Link href="/support/resources">support resources</Link>.
            </p>
          ),
        },
        {
          id: "children",
          heading: "Screening a child",
          body: (
            <p>
              If you create a profile for a child, you confirm that you are their parent or legal guardian and can
              consent on their behalf. You can withdraw that consent at any time.
            </p>
          ),
        },
        {
          id: "accounts",
          heading: "Your account",
          body: (
            <ul>
              <li>
                Give accurate information and keep your password safe. You&apos;re responsible for activity on your
                account.
              </li>
              <li>Don&apos;t try to get around access controls, including by tampering with how results are worked out.</li>
            </ul>
          ),
        },
        {
          id: "plans",
          heading: "Plans and payments",
          body: (
            <ul>
              <li>
                Some features need a paid plan. Prices and what each plan includes are shown before you pay. Payments
                are processed by Flutterwave.
              </li>
              <li>NeuRafiki and ANDA are billed separately. A plan for one doesn&apos;t include the other.</li>
              <li>For billing questions or refund requests, email {email}.</li>
            </ul>
          ),
        },
        {
          id: "ai",
          heading: "The AI companion",
          body: (
            <p>
              The companion explains questions and offers encouragement. It can be wrong, and it isn&apos;t a
              clinician. Daily limits apply.
            </p>
          ),
        },
        {
          id: "conduct",
          heading: "Using NeuRafiki fairly",
          body: (
            <p>
              Follow our <Link href="/guidelines">community guidelines</Link>. We may close accounts used to harm
              others, misuse someone else&apos;s information or break the law.
            </p>
          ),
        },
        {
          id: "liability",
          heading: "Availability and responsibility",
          body: (
            <p>
              We work to keep NeuRafiki available and accurate, but we can&apos;t promise it will always be
              uninterrupted or error-free. To the extent the law allows, {LEGAL_OWNER} isn&apos;t responsible for
              losses that come from relying on a screening result instead of professional advice. Nothing in these
              terms limits rights you have under the law that can&apos;t be limited.
            </p>
          ),
        },
        {
          id: "ip",
          heading: "Copyright",
          body: (
            <p>
              The NeuRafiki name, design, questions and site content are &copy; {LEGAL_OWNER}, except content owned by
              users or third parties. You may share links to NeuRafiki pages freely.
            </p>
          ),
        },
        {
          id: "changes",
          heading: "Changes and contact",
          body: (
            <p>
              We may update these terms. If a change matters, we&apos;ll update the date above and tell you in the app
              or by email. Questions: {email}.
            </p>
          ),
        },
      ]}
    />
  )
}
