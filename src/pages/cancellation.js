import Layout from "../layout/public";
const DATA = [
  {
    title:
      "At BuddhaAI, we strive to provide exceptional SaaS (Software as a Service) solutions to our valued customers. We understand that circumstances may change, and occasionally, you may need to cancel your subscription. This cancellation policy outlines the terms and conditions associated with canceling your subscription for our BuddhaAI SaaS product. Please read this policy carefully.",
  },

  {
    title: "Subscription Cancellation:",
    description: [
      "1.1. Monthly Subscriptions: For customers with a monthly subscription plan, you have the flexibility to cancel your subscription at any time. Once canceled, your subscription will remain active until the end of the current billing cycle, and no further charges will occur.",
      "Annual Subscriptions: For customers with an annual subscription plan, you can request cancellation at any time. However, refunds will be granted based on the following conditions:",
    ],
  },

  {
    title:
      "Cancellation within the first 30 days of the annual subscription: A full refund will be issued for the remaining months of the subscription term.",
  },
  {
    title:
      "Cancellation after the first 30 days of the annual subscription: No refunds will be provided for the remaining months of the subscription term.",
  },
  { title: "Cancellation Process:" },

  {
    title: "To initiate the cancellation process, please follow these steps:",
    description: [
      "Send a written cancellation request to our customer support team via email or through the designated communication channel provided on our website. Include your account details, subscription type, and reason for cancellation.",
      "Our customer support team will review your request and respond within a reasonable timeframe, confirming the cancellation and any associated refund (if applicable).",
      "If you have any outstanding payments, you will remain responsible for settling them in full, even after canceling your subscription.",
    ],
  },

  {
    title: "Termination by BuddhaAI:",
    description: [
      "We reserve the right to suspend or terminate your subscription immediately, without prior notice, if we suspect any misuse, violation of our terms of service, or fraudulent activity associated with your account.",
      "In such cases, no refunds will be provided for any unused portion of your subscription.",
    ],
  },

  {
    title: "Modifications to the Cancellation Policy:",
    description: [
      "BuddhaAI may update or modify this cancellation policy from time to time. Any changes will be communicated to you via email or by posting a revised policy on our website.",
      "Please note that this cancellation policy applies solely to our BuddhaAI SaaS product. Different cancellation policies may apply to other products or services offered by BuddhaAI.",
      "If you have any questions or concerns regarding this policy, please don't hesitate to contact our customer support team for further assistance.",
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="my-12">
        <h1 className="text-center text-3xl text-white">
          Cancellation and Refund
        </h1>
        <ul className="space-y-5 md:px-44 p-5">
          {DATA.map(({ title, description = [] }) => (
            <li key={title}>
              <div className="font-bold text-white text-opacity-80">
                {title}
              </div>
              <div className="text-white text-opacity-60">
                <ul className="space-y-5 p-5">
                  {description.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
