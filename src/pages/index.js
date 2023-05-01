import BookDemo from "@/components/BookDemo";
import Layout from "@/layout/public";
import Image from "next/image";

const Landing = () => (
  <Layout>
    <div className="min-h-[80vh] bg-[#1F222C] flex justify-center items-center">
      <div>
        <div className="text-4xl font-semibold text-center text-white">
          Transform Your Data <br />
          into Chatbots - Instantly
        </div>
        <div className="my-5 font-normal text-center text-[#9EA4B2]">
          The best Ai Chatbot. <br />
          Revolutionary bot for the world.
        </div>
        <div className="text-center my-12">
          <BookDemo />
        </div>
      </div>
    </div>
    <div className="min-h-[80vh] flex justify-center items-center relative">
      <div className="h-[400px] w-full absolute -top-36">
        <Image className="object-contain" src="/hero.png" fill />
      </div>
    </div>
    <section className="bg-[#0D0C16] ">
      <div className="py-8 px-5 mx-auto max-w-screen-xl sm:py-16">
        <div className="my-12 text-center lg:px-44">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
            BuddhiAi: Your Intelligent Companion for the Digital World
          </h2>
          <p className="text-white text-opacity-75 sm:text-xl ">
            Navigate the digital world with ease - BuddhiAi guide is always
            at your service!
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          {[
            {
              title: "Education",
              description:
                "Convert educational materials into chatbots with our AI product to offer customized learning experiences, help students with their homework, provide instant feedback, and allow students to make notes and organize their learning materials in a personalized and efficient way.",
            },
            {
              title: "Documentation",
              description:
                "Convert client data into chatbots with our AI product to simplify communication, reduce errors, and improve efficiency. The chatbot can also provide real-time insights, remind clients about important deadlines, and offer personalized advice to improve financial performance.",
            },
            {
              title: "And many more",
              description:
                "Convert Excel, Docs, text, images, and diagrams into chatbots with our AI product. Simplify communication, reduce errors, and improve efficiency.",
            },
          ].map(({ title, description }) => (
            <div key={title}>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-indigo-500 lg:h-12 lg:w-12 ">
                <svg
                  className="w-5 h-5 text-white lg:w-6 lg:h-6 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
              <p className="text-white text-opacity-75">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Landing;
