import Link from "next/link"
import { LegalPage } from "@/components/legal-page"
import { LEGAL_CONTACT_EMAIL, LEGAL_OWNER } from "@/lib/legal"
import { DPO_CLAUSE } from "@/lib/dpo"

export const metadata = {
  title: "Privacy policy | NeuRafiki",
  description: "What NeuRafiki collects, why, who processes it, and how to access or delete your data.",
}

const email = <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro={`NeuRafiki is a neurodiversity screening and check-in tool run by ${LEGAL_OWNER}. This policy explains, in plain language, what information we collect, why, who helps us process it, and the choices you have. It is designed to support applicable data-protection requirements; it doesn't claim certification under any particular law.`}
      sections={[
        {
          id: "collect",
          heading: "What we collect",
          body: (
            <ul>
              <li>
                <strong>Your account:</strong> name, email address and sign-in details.
              </li>
              <li>
                <strong>Profiles:</strong> the people you screen, which may include a child you are the parent or
                guardian of.
              </li>
              <li>
                <strong>Screening answers and results:</strong> your responses across areas such as autism, ADHD,
                dyslexia, dyspraxia, sensory processing and executive function, and the results worked out from them.
              </li>
              <li>
                <strong>Check-ins:</strong> the options you choose and any notes you add.
              </li>
              <li>
                <strong>Consents:</strong> what you agreed to, for whom, and when.
              </li>
              <li>
                <strong>Payments:</strong> your plan, payment status and reference numbers. Card and mobile-money
                details are handled by our payment provider and never reach us.
              </li>
              <li>
                <strong>Messages you send us</strong> through the contact form.
              </li>
            </ul>
          ),
        },
        {
          id: "children",
          heading: "Children",
          body: (
            <p>
              Some of what is stored is about children and is sensitive. We only collect a child&apos;s screening
              answers with the explicit consent of their parent or legal guardian, asked for immediately before the
              screening begins. That consent can be withdrawn at any time.
            </p>
          ),
        },
        {
          id: "use",
          heading: "How we use it",
          body: (
            <ul>
              <li>To run screenings, work out results and show you reports.</li>
              <li>To save check-ins and send follow-up reminders you ask for.</li>
              <li>To take payments and manage your plan.</li>
              <li>To answer your messages, keep the service secure and fix problems.</li>
            </ul>
          ),
        },
        {
          id: "ai",
          heading: "The AI companion",
          body: (
            <p>
              The companion is optional and asks for your consent before first use. It receives the message you type
              and, during a screening, the wording of the current question and its answer options. It never receives
              your answers. It runs on Cloudflare Workers AI, using an open AI model. We don&apos;t save your
              conversations.
            </p>
          ),
        },
        {
          id: "anda",
          heading: "Sharing with ANDA",
          body: (
            <p>
              ANDA, the African Neurodiversity Alliance, is our sister product for support plans, with its own
              account and billing. If you link the two, NeuRafiki sends ANDA a structured summary of a screening or
              check-in (for example the areas explored and options chosen), and only when you tick the sharing box for
              it. Raw screening answers and private notes are never shared. You can unlink at any time in your
              account.
            </p>
          ),
        },
        {
          id: "processors",
          heading: "Who helps us process data",
          body: (
            <>
              <ul>
                <li>
                  <strong>Supabase:</strong> database and sign-in.
                </li>
                <li>
                  <strong>Vercel:</strong> hosting, plus Vercel Analytics for anonymous, aggregated page-visit counts.
                </li>
                <li>
                  <strong>Flutterwave:</strong> payments.
                </li>
                <li>
                  <strong>Cloudflare:</strong> the AI companion, only as described above.
                </li>
                <li>
                  <strong>Sentry:</strong> error reports, so we can find and fix bugs.
                </li>
                <li>
                  <strong>Our email provider:</strong> sending reminders and forwarding contact messages.
                </li>
              </ul>
              <p>We don&apos;t sell personal information, and we don&apos;t use it for advertising.</p>
            </>
          ),
        },
        {
          id: "security",
          heading: "Keeping it safe",
          body: (
            <p>
              Data is encrypted in transit. Screening answers and results are also encrypted in the database, and only
              our server can decrypt them. Results are worked out on the server so they can&apos;t be tampered with.
              Database rules limit every account to its own records. No system is perfectly secure, so please use a
              strong password and tell us straight away if you think your account has been misused.
            </p>
          ),
        },
        {
          id: "rights",
          heading: "Your choices and rights",
          body: (
            <ul>
              <li>
                See and update your information in your <Link href="/account">account</Link>.
              </li>
              <li>Withdraw consent for a profile, the companion or ANDA sharing at any time.</li>
              <li>
                Ask for a copy of your data, a correction, or deletion of your account and its data by emailing {email}.
              </li>
            </ul>
          ),
        },
        {
          id: "retention",
          heading: "How long we keep it",
          body: (
            <p>
              We keep your information while your account is open, or until you ask us to delete it. Withdrawing
              consent stops further use of that data for screening; ask us separately if you also want it deleted.
              Payment records are kept, anonymised, for as long as the law requires.
            </p>
          ),
        },
        {
          id: "dpo",
          heading: DPO_CLAUSE.heading,
          body: (
            <>
              <p>{DPO_CLAUSE.intro}</p>
              <p>{DPO_CLAUSE.lead}</p>
              <ul>
                {DPO_CLAUSE.details.map(([label, value]) => (
                  <li key={label}>
                    {label}:{" "}
                    {label === "Official Contact Email" ? (
                      <a href={`mailto:${value}`}>{value}</a>
                    ) : label === "Contact Phone Number" ? (
                      <a href={`tel:${value}`}>{value}</a>
                    ) : (
                      value
                    )}
                  </li>
                ))}
              </ul>
              <p>{DPO_CLAUSE.closing}</p>
            </>
          ),
        },
        {
          id: "changes",
          heading: "Changes and contact",
          body: (
            <p>
              If we change this policy in a way that matters, we&apos;ll update the date above and tell you in the app
              or by email. Questions or requests: {email}. NeuRafiki is run by {LEGAL_OWNER}.
            </p>
          ),
        },
      ]}
    />
  )
}
