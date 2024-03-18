import AboutUs from "@/components/AboutUs";
import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";

const AboutUsPage = () => {
  return (
    <TrustNavbar title="About Us">
      <AboutUs />
    </TrustNavbar>
  );
};

export default TrustRoute(AboutUsPage);
