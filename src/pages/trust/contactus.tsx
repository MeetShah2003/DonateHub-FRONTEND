import ContactUs from "@/components/ContactUs";
import TrustContactUs from "@/components/TrustContactUs";
import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";

const ContactUspage = () => {
  return (
    <TrustNavbar title="Contact Us">
      <TrustContactUs />
    </TrustNavbar>
  );
};

export default TrustRoute(ContactUspage);
