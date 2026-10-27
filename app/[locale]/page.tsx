import Footer from "@/components/layouts/footer";
import { HomePage } from "@/components/sections/home";

const Page = () => {
  return (
    <>
      <main className="bg-[#0c1222]">
        <HomePage />
      </main>
      <div className="bg-[#0c1222]">
        <Footer />
      </div>
    </>
  );
};

export default Page;
