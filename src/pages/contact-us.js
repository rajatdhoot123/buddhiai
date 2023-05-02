import React, { useState } from "react";
import axios from "axios";
import Layout from "../layout/public";

const Paragraph = ({ children, className = "" }) => (
  <p className={`text-[#63657E] font-lg leading-7 my-10 ${className}`}>
    {children}
  </p>
);

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    const formData = new FormData(event.currentTarget);
    let data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    event.preventDefault();

    try {
      setLoading(true);
      const { data: apiData } = await axios.post("/api/send-mail", {
        ...data,
        subject: `${data.subject} - Buddhi Ai`,
      });
      if (apiData.status === "success") {
        event.target.reset();
        if (typeof alert !== "undefined") {
          alert("Thanks for reaching us will be back shortly");
        }
      }
    } catch (err) {
      if (err) {
        if (typeof alert !== "undefined") {
          alert(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="md:w-1/2 flex m-auto py-12 px-5">
        <div>
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-semibold text-white">
              Get in Touch
            </h2>
            <Paragraph className="text-white text-opacity-70">
              Experiencing a technical issue? Have feedback to share about a
              beta feature? Interested in learning more about our Business plan?
              Contact us and let us know how we can assist you.
            </Paragraph>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-white text-opacity-60"
              >
                Your email
              </label>
              <input
                type="email"
                name="mail_id"
                className="shadow-sm bg-gray-50 border border-gray-300 text-black text-opacity-60 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                placeholder="Enter Your Name"
                required
              />
            </div>
            <div>
              <label
                html="subject"
                className="block mb-2 text-sm font-medium text-white text-opacity-60"
              >
                Subject
              </label>
              <input
                type="text"
                name="subject"
                className="block p-3 w-full text-sm text-black text-opacity-60 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Let us know how we can help you"
                required
              />
            </div>
            <div>
              <label
                html="phone_number"
                className="block mb-2 text-sm font-medium text-white text-opacity-60"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phone_number"
                className="block p-3 w-full text-sm text-black text-opacity-60 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-white text-opacity-60"
              >
                Your message
              </label>
              <textarea
                name="message"
                rows="6"
                className="block p-2.5 w-full text-sm text-black text-opacity-60 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Leave a message..."
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                disabled={loading}
                type="submit"
                className="text-white bg-[#293FCC] w-full p-2 rounded-lg"
              >
                {loading && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                Send Message
              </button>
            </div>
          </form>
          <div className="divider my-12"></div>
          <a
            href="https://api.whatsapp.com/send?phone=916267967184"
            className="p-5 h-6 rounded-md flex justify-center items-center bg-[#128c7e]"
          >
            <span className="text-sm text-white mr-2">
              Send us hi on whatsapp
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-7 h-7 text-white"
            >
              <path
                fill="currentColor"
                d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
              />
            </svg>
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default ContactForm;
