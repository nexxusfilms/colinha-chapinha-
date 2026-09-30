import Header from "@/components/Header";
import CampaignHero from "@/components/CampaignHero";
import ColinhaApp from "@/components/ColinhaApp";
import VotingOrder from "@/components/VotingOrder";
import PrivacyNotice from "@/components/PrivacyNotice";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <CampaignHero />
        <ColinhaApp />
        <VotingOrder />
        <PrivacyNotice />
      </main>
      <Footer />
    </>
  );
}
