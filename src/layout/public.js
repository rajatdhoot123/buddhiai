import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="absolute bg-[#1A1923] w-full">
      <div className="h-24 sticky w-full top-0 p-5 bg-[#1F222C]">
        <Navbar />
      </div>
      <div className="w-full">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
