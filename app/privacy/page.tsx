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
                  <strong>Cloudflare:</strong> the AI companion, only as described above, and the Turnstile
                  security check on sign-up and sign-in.
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
          id: "legal-basis",
          heading: "Why we're allowed to use it",
          body: (
            <ul>
              <li>
                <strong>To provide the service you signed up for:</strong> your account, profiles, screenings, results and check-ins.
              </li>
              <li>
                <strong>Your consent:</strong> for information about a person&apos;s health, development or support
                needs, and for screenings, the AI companion and sharing with ANDA. You can withdraw it at any time.
              </li>
              <li>
                <strong>The law:</strong> keeping payment records.
              </li>
              <li>
                <strong>Keeping the service safe:</strong> preventing abuse and fixing problems.
              </li>
            </ul>
          ),
        },
        {
          id: "transfers",
          heading: "Where your data is processed",
          body: (
            <p>
              The providers listed above may store or process data outside your country, including in the United
              States and the European Union. We use providers whose data-processing terms commit them to protect it, and
              we only send each one what its job needs.
            </p>
          ),
        },
        {
          id: "cookies",
          heading: "Cookies and similar storage",
          body: (
            <>
              <p>We only use what the site needs to work:</p>
              <ul>
                <li>a sign-in cookie, so you stay signed in;</li>
                <li>Cloudflare Turnstile, a security check on the sign-up and sign-in forms that tells people from bots;</li>
                <li>your display choices, saved in your browser&apos;s local storage.</li>
              </ul>
              <p>
                Vercel Analytics counts page visits without cookies and without identifying you. We don&apos;t use
                advertising or cross-site tracking, and we don&apos;t allow other companies to track you across
                websites through our service. Because we don&apos;t track you across sites, we respond to a browser&apos;s
                &quot;Do Not Track&quot; signal in the same way as when there is no signal.
              </p>
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
                Delete your account and all its data yourself, at any time, from your{" "}
                <Link href="/account">account page</Link>.
              </li>
              <li>Ask for a copy of your data or a correction by emailing {email}.</li>
              <li>
                If you&apos;re unhappy with how we handle your data, you can complain to the Nigeria Data Protection
                Commission (<a href="https://ndpc.gov.ng">ndpc.gov.ng</a>) or to the data-protection authority where you
                live. We&apos;d like the chance to put it right first, so please contact us too.
              </li>
            </ul>
          ),
        },
        {
          id: "retention",
          heading: "How long we keep it",
          body: (
            <p>
              We keep your information while your account is open. When you delete your account, we delete your
              profiles, screening answers and results, follow-ups, check-ins, consents and any link to ANDA.
              Withdrawing consent stops further use of that data for screening; delete your account if you also want
              it removed. Our payment provider keeps its own payment records for as long as the law requires.
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
