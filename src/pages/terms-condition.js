import { SUPPORT_MAIL } from "../constant";
import Layout from "../layout/public";

const DATA = [
  {
    title: "Introduction",
    description:
      "Welcome to our AI Chat Bot based on ai tools and using Supabase as a database (hereafter referred to as 'the Chat Bot'). By using the Chat Bot, you agree to the following Terms and Conditions.",
  },

  {
    title: "Access and Use",
    description:
      "Access to the Chat Bot is provided to you free of charge for your personal use only. You may not use the Chat Bot for commercial purposes or for any unlawful or unauthorized purpose. You are solely responsible for any actions taken through the Chat Bot, and we are not liable for any damages resulting from your use of the Chat Bot.",
  },

  {
    title: "Privacy Policy",
    description:
      "We take your privacy seriously. Please refer to our Privacy Policy for details on how we collect, use, and protect your personal information.",
  },

  {
    title: "Intellectual Property",
    description:
      "The Chat Bot, including all intellectual property rights, is owned by us or our licensors. You may not modify, reproduce, distribute, or create derivative works of the Chat Bot without our express written consent.",
  },

  {
    title: "User Content",
    description:
      "By using the Chat Bot, you may provide us with certain content, such as messages or feedback. You retain ownership of any content you provide, but by providing such content, you grant us a non-exclusive, royalty-free, worldwide, perpetual, and irrevocable license to use, display, reproduce, and distribute such content in connection with the Chat Bot.",
  },

  {
    title: "Disclaimer of Warranties",
    description:
      "The Chat Bot is provided 'as is' and without warranty of any kind, either express or implied, including without limitation, warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Chat Bot will be error-free or uninterrupted, or that defects will be corrected.",
  },

  {
    title: "Limitation of Liability",
    description:
      "To the fullest extent permitted by law, we are not liable for any damages, including without limitation, direct, indirect, incidental, special, consequential, or punitive damages, arising out of or in connection with your use of the Chat Bot, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses.",
  },

  {
    title: "Indemnification",
    description:
      "You agree to indemnify and hold us harmless from and against any claims, damages, liabilities, and expenses, including reasonable attorneys' fees, arising out of your use of the Chat Bot or your breach of these Terms and Conditions.",
  },

  {
    title: "Modification and Termination",
    description:
      "We reserve the right to modify, suspend, or terminate the Chat Bot at any time, without notice, for any reason. We may also modify these Terms and Conditions at any time by posting the modified terms on our website. Your continued use of the Chat Bot after any such modifications shall constitute your acceptance of such modifications.",
  },

  {
    title: "Governing Law and Jurisdiction",
    description:
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction where we are located. Any disputes arising out of or in connection with these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts located in that jurisdiction.",
  },

  {
    title: "Entire Agreement",
    description:
      "These Terms and Conditions constitute the entire agreement between you and us with respect to your use of the Chat Bot, and supersede all prior or contemporaneous communications and proposals, whether oral or written, between you and us.",
  },

  {
    title: "Contact Us",
    description: `If you have any questions or concerns about these Terms and Conditions or the Chat Bot, please contact us at ${SUPPORT_MAIL}`,
  },
];

const TermsCondition = () => {
  return (
    <Layout>
      <div className="my-12">
        <h1 className="text-center text-3xl text-white">
          Terms and Conditions
        </h1>
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

export default TermsCondition;
