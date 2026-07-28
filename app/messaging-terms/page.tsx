import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Messaging Terms & Conditions — TopHand · Product Detroit LLC",
  description:
    "Messaging Terms & Conditions for the TopHand SMS notification program, operated by Product Detroit LLC.",
};

export default function MessagingTermsPage() {
  return (
    <LegalShell
      kicker="Messaging Terms"
      title="TopHand Messaging Terms & Conditions"
      updated="July 27, 2026"
    >
      <p>
        These Messaging Terms &amp; Conditions govern the TopHand SMS notification program (the
        &ldquo;Program&rdquo;), operated by Product Detroit LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
        &ldquo;our&rdquo;). TopHand is a farm management platform at tophand.ag and app.tophand.ag.
      </p>

      <h2>Program description</h2>
      <p>
        The Program sends operational text messages to TopHand users who opt in — task and chore
        reminders, event and calendar alerts, field-condition alerts, and account notifications
        related to the TopHand service.
      </p>

      <h2>Opt-in</h2>
      <p>
        You will only receive Program messages if you provide your mobile number and expressly turn
        on text notifications in your TopHand account. Consent to receive text messages is not a
        condition of purchasing any goods or services.
      </p>

      <h2>Message frequency</h2>
      <p>
        Message frequency varies based on your farm&rsquo;s activity and the notification
        preferences you select. You can reduce or increase the notifications you receive at any
        time in your TopHand notification settings.
      </p>

      <h2>Fees</h2>
      <p>
        Message and data rates may apply to messages sent to and from you. These charges are billed
        by and payable to your mobile carrier according to your mobile plan. Product Detroit does
        not charge for Program messages.
      </p>

      <h2>Opting out</h2>
      <p>
        Reply <span className="kbd">STOP</span> to any TopHand message to cancel SMS notifications
        at any time. After you send <span className="kbd">STOP</span>, we will send one final
        message confirming you have been unsubscribed. You can also turn off text notifications in
        your TopHand account settings, and you may re-subscribe at any time by opting back in.
      </p>

      <h2>Help and support</h2>
      <p>
        Reply <span className="kbd">HELP</span> to any TopHand message for assistance, or contact
        us at <a href="mailto:support@tophand.ag">support@tophand.ag</a>.
      </p>

      <h2>Carrier disclaimer</h2>
      <p>
        Carriers are not liable for delayed or undelivered messages. Message delivery is subject to
        effective transmission by your mobile carrier and is not guaranteed.
      </p>

      <h2>Eligibility</h2>
      <p>
        The Program is available on supported U.S. carriers. You represent that you are the account
        holder for the mobile number you provide, or that you have the account holder&rsquo;s
        permission, and you agree to notify us if you change or deactivate that number.
      </p>

      <h2>Privacy</h2>
      <p>
        Information collected in connection with the Program is handled as described in our{" "}
        <a href="/privacy">Privacy Policy</a>. Mobile opt-in data and consent records are not sold
        or shared with third parties or affiliates for their marketing or promotional purposes.
      </p>

      <h2>Changes and contact</h2>
      <p>
        We may update these Messaging Terms from time to time; the &ldquo;last updated&rdquo; date
        above reflects the current version. Questions about the Program can be sent to Product
        Detroit LLC at <a href="mailto:support@tophand.ag">support@tophand.ag</a>.
      </p>
    </LegalShell>
  );
}
