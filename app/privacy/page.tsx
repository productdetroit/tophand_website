import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy — TopHand · Product Detroit LLC",
  description:
    "Privacy Policy for TopHand, operated by Product Detroit LLC, including how we handle SMS opt-in data.",
};

export default function PrivacyPage() {
  return (
    <LegalShell kicker="Privacy Policy" title="TopHand Privacy Policy" updated="July 27, 2026">
      <p>
        This Privacy Policy explains how Product Detroit LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
        &ldquo;our&rdquo;) collects, uses, and protects information when you use TopHand
        (tophand.ag and app.tophand.ag). By using TopHand, you agree to the practices described
        here.
      </p>

      <h2>Information we collect</h2>
      <p>We collect information you provide and information generated as you use TopHand, including:</p>
      <ul>
        <li>
          <strong>Account and profile information</strong> — such as your name, email address, and
          mobile phone number.
        </li>
        <li>
          <strong>Farm and operational data</strong> — the information you enter to manage your
          farm, such as fields, crops, animals, tasks, events, and equipment.
        </li>
        <li>
          <strong>Consent records</strong> — if you enable text notifications, the date, time, and
          method of your opt-in.
        </li>
        <li>
          <strong>Usage and analytics information</strong> — how you interact with TopHand (pages
          and features used, actions taken, device and log data), collected to operate, secure, and
          improve the product. We use a third-party product-analytics provider (Pendo) to help us
          understand and improve usage, as described below.
        </li>
      </ul>

      <h2>How we use information</h2>
      <p>
        We use your information to provide and improve TopHand, to send the notifications you
        request, to secure your account, and to comply with legal obligations. We do not sell your
        personal information.
      </p>

      <div className="legal-callout">
        <h2>Text messaging (SMS)</h2>
        <p>
          When you enable text notifications, we collect your mobile phone number and your consent
          record (the date, time, and method of opt-in) to operate the TopHand SMS notification
          program.
        </p>
        <p>
          We use your mobile number only to send the TopHand notifications you opted into (task
          reminders, event and calendar alerts, field-condition alerts, and account notifications)
          and to respond to <span className="kbd">STOP</span> and <span className="kbd">HELP</span>{" "}
          requests.
        </p>
        <p>
          <strong>
            We do not sell, rent, or share your mobile opt-in information or phone number with
            third parties or affiliates for their marketing or promotional purposes.
          </strong>{" "}
          We share it only with the messaging service providers (such as our SMS carrier) needed to
          deliver the messages you requested, and only as required to operate the Program or comply
          with law.
        </p>
        <p>
          You can withdraw consent at any time by replying <span className="kbd">STOP</span> to any
          message or by turning off text notifications on your profile. See our{" "}
          <a href="/messaging-terms">Messaging Terms</a> for details.
        </p>
      </div>

      <h2>Analytics and product usage</h2>
      <p>
        We use Pendo, a third-party product-analytics service, to understand how TopHand is used so
        we can improve it. Pendo may collect usage and interaction data and account identifiers
        (such as a user or account ID) to attribute activity, and may use cookies or similar in-app
        technologies. Pendo processes this data on our behalf as our service provider and is
        contractually restricted to that purpose.
      </p>
      <p>
        <strong>
          We do not include SMS opt-in phone numbers or SMS consent records in our product
          analytics.
        </strong>{" "}
        That data is used only to operate the SMS program and is shared only with our messaging
        provider, as described in the Text messaging section above.
      </p>

      <h2>How we share information — service providers</h2>
      <p>
        We share information only with the service providers (subprocessors) that help us operate
        TopHand, and only as needed to deliver the service or comply with law. We do not sell your
        personal information, and mobile opt-in data is never shared for third-party marketing. The
        providers we rely on are:
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Data it may receive</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Twilio</td>
              <td>SMS/text message delivery</td>
              <td>Mobile phone number and message content for notifications you opted into</td>
            </tr>
            <tr>
              <td>Pendo</td>
              <td>Product analytics (usage insights to improve TopHand)</td>
              <td>Usage and interaction data, account/user identifiers; not SMS opt-in data</td>
            </tr>
            <tr>
              <td>Neon</td>
              <td>Database and backend hosting</td>
              <td>Account, profile, and farm/operational data you enter into TopHand</td>
            </tr>
            <tr>
              <td>Vercel</td>
              <td>Application hosting and delivery</td>
              <td>Technical and log data needed to serve the application</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        We may update this list as our providers change. We may also disclose information when
        required by law or to protect the rights, safety, and security of TopHand and its users.
      </p>

      <h2>Your choices</h2>
      <p>
        You can update your profile information, manage your notification preferences, and opt out
        of text messages at any time from within TopHand. To request access to or deletion of your
        data, contact us using the details below.
      </p>

      <h2>Data retention and security</h2>
      <p>
        We retain your information for as long as your account is active or as needed to provide
        the service and meet legal requirements. We use reasonable administrative and technical
        safeguards to protect your information.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be reflected on
        this page with a new &ldquo;last updated&rdquo; date.
      </p>

      <h2>Contact</h2>
      <p>
        <strong>Product Detroit LLC</strong>
        <br />
        <a href="mailto:support@tophand.ag">support@tophand.ag</a>
      </p>
    </LegalShell>
  );
}
