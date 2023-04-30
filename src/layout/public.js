import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="absolute">
      <div className="fixed w-full top-0 bg-blue-200 p-5">
        <Navbar />
      </div>
      <div className="pt-24">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
