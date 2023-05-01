import { SUPPORT_MAIL } from "@/constant";
import Layout from "@/layout/public";

const DATA = [
  {
    title: "Introduction",
    description:
      "We take your privacy seriously and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your personal information in connection with our AI Chat Bot based on ai tools and using Supabase as a database (hereafter referred to as 'the Chat Bot').",
  },

  {
    title: "Information We Collect",
    description:
      "When you use the Chat Bot, we may collect certain personal information, such as your name, email address, and other contact information. We may also collect information about your interactions with the Chat Bot, such as the questions you ask and the responses provided.",
  },

  {
    title: "Use of Information",
    description:
      "We use the personal information we collect to provide and improve the Chat Bot, respond to your inquiries, and communicate with you about the Chat Bot. We may also use your personal information for marketing purposes, such as sending you promotional emails about our products and services, unless you opt-out of such communications.",
  },

  {
    title: "Sharing of Information",
    description:
      "We do not sell, rent, or otherwise share your personal information with third parties, except as described in this Privacy Policy. We may share your personal information with our service providers, such as our hosting provider and analytics provider, to help us operate and improve the Chat Bot. We may also disclose your personal information if required by law or in connection with a legal proceeding.",
  },

  {
    title: "Data Security",
    description:
      "We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no data transmission over the Internet or electronic storage system can be guaranteed to be 100% secure. Therefore, we cannot guarantee the absolute security of your personal information.",
  },

  {
    title: "Cookies",
    description:
      "We use cookies and similar technologies to operate and improve the Chat Bot. Cookies are small text files that are placed on your device when you visit our website. We use cookies to personalize your experience, remember your preferences, and analyze how users interact with the Chat Bot. You can manage your cookie preferences through your web browser settings.",
  },

  {
    title: "Third-Party Links",
    description:
      "The Chat Bot may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third-party websites or services. We encourage you to review the privacy policies of these third parties.",
  },

  {
    title: "Children's Privacy",
    description:
      "The Chat Bot is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will delete such information.",
  },

  {
    title: "Changes to this Privacy Policy",
    description:
      "We may update this Privacy Policy from time to time by posting the updated policy on our website. Your continued use of the Chat Bot after such changes will constitute your acceptance of the updated Privacy Policy.",
  },

  {
    title: "Contact Us",
    description: `If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at ${SUPPORT_MAIL}`,
  },
];

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="my-12">
        <h1 className="text-center text-3xl text-white">Privacy Policy</h1>
        <ul className="space-y-5 md:px-44 p-5">
          {DATA.map(({ title, description }) => (
            <li key={title}>
              <div className="font-bold text-white text-opacity-80">
                {title}
              </div>
              <div className="text-white text-opacity-60">{description}</div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
