import Footer from "@/components/layouts/footer";
import { AiProjectEstimator } from "@/components/sections/ai-project-estimator";
import { AiRelatedBlogs } from "@/components/sections/ai-related-blogs";
import { BusinessSolutions } from "@/components/sections/business-solutions";
import { FeaturedServices } from "@/components/sections/featured-services";
import { ServicesHero } from "@/components/sections/services-hero";
import { StoryHero } from "@/components/sections/story-hero";

const Page = () => {
  return (
    <>
      <main>
        <StoryHero />
        <ServicesHero />
        <FeaturedServices />
        <BusinessSolutions />
        <AiProjectEstimator />
        <AiRelatedBlogs
          title="وبلاگ‌های اخیر"
          description="جدیدترین مقالات و مطالب تخصصی درباره طراحی سایت، اپلیکیشن، هوش مصنوعی و فناوری‌های روز را دنبال کنید."
        />
      </main>
      <Footer />
    </>
  );
};

export default Page;
