import Footer from "@/components/layouts/footer";
import { AiBenefits } from "@/components/sections/ai-benefits";
import { AiHero } from "@/components/sections/ai-hero";
import { AiPortfolio } from "@/components/sections/ai-portfolio";
import { AiProcess } from "@/components/sections/ai-process";
import { AiProjectEstimator } from "@/components/sections/ai-project-estimator";
import { AiRelatedBlogs } from "@/components/sections/ai-related-blogs";
import { AiSolutions } from "@/components/sections/ai-solutions";

export default function AiPage() {
  return (
    <>
      <main>
        <AiHero />
        <AiSolutions />
        <AiPortfolio />
        <AiBenefits />
        <AiProcess />
        <AiProjectEstimator />
        <AiRelatedBlogs />
      </main>
      <Footer />
    </>
  );
}
