import { Calculator } from "@/components/Calculator";
import { Catalog } from "@/components/Catalog";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Markets } from "@/components/Markets";
import { MobileBar } from "@/components/MobileBar";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Markets />
        <Catalog />
        <Calculator />
        <Process />
        <Services />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
