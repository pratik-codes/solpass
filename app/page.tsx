import { AccordionComponent } from "@/components/homepage/accordion-component";
import HeroSection from "@/components/farmui/hero-section";
import Pricing from "@/components/homepage/pricing";
import SideBySide from "@/components/homepage/side-by-side";
import PageWrapper from "@/components/wrapper/page-wrapper";
import config from "@/config";
import Script from "next/script";

export default function Home() {
  return (
    <PageWrapper>
    
      <div className="flex flex-col justify-center items-center w-full mt-[1rem]">
        <HeroSection />
      </div>
      <div className="flex my-[8rem] w-full justify-center items-center">
        <SideBySide />
      </div>
      {(config.auth.enabled && config.payments.enabled) && <div>
        <Pricing />
      </div>}
      <div className="flex justify-center items-center w-full my-[8rem]">
        <AccordionComponent />
      </div>
    </PageWrapper>
  );
}
