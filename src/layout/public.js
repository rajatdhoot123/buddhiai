import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="absolute bg-[#1F222C] w-full">
      <div className="fixed w-full top-0 p-5 bg-[#1F222C]">
        <Navbar />
      </div>
      <div className="pt-24 w-full">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
