import { ColorPicker } from "@/components/color-picker";
import { Hero } from "@/components/hero";
import { Contacts, Faq, Reviews } from "@/components/info";
import { Prices } from "@/components/prices";
import { BeforeAfter, ForBusiness, Process, WheelsForSale, WhyPowder } from "@/components/sections";
import { WorksStrip } from "@/components/works-strip";

export default function Home() {
  return (
    <main>
      <Hero />
      <WorksStrip />
      <Prices />
      <ColorPicker />
      <BeforeAfter />
      <Process />
      <WhyPowder />
      <ForBusiness />
      <WheelsForSale />
      <Reviews />
      <Faq />
      <Contacts />
    </main>
  );
}
