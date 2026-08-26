import { BusinessSolutions } from "@/components/sections/business-solutions";
import { FeaturedServices } from "@/components/sections/featured-services";
import { ServicesHero } from "@/components/sections/services-hero";
import { StoryHero } from "@/components/sections/story-hero";

const Page = () => {
  return (
    <main>
      <StoryHero />
      <ServicesHero />
      <FeaturedServices />
      <BusinessSolutions />
    </main>
  );
};

export default Page;
