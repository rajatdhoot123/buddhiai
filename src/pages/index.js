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
    <div className="bg-[#0D0C16] py-12 md:flex items-center gap-12 md:px-24">
      <div className="h-[400px] w-full relative">
        <Image className="object-contain" src="/hero.png" fill />
      </div>
      <div className="text-white">
        <div className="font-bold	text-3xl">
          Your next decision could be thanks to the analyzes
        </div>
        <p>
          Every detail has been designed for high efficiency when it comes to
          teamwork, the maximum performance at the lowest cost in the entire
          market.
        </p>
      </div>
    </div>
  </Layout>
);

export default Landing;
