//creating another home layout for the home page (and not touch the rootlayout) which will apply for all pages inside the (home) folder
import Navbar from "./navbar";
import Footer from "./footer";

interface Props {
  children: React.ReactNode;
}

const layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
