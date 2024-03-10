import ContactUs from "@/components/ContactUs";
import TrustNavbar from "@/components/TrustNavbar";
import TrustRoute from "@/components/TrustRoute/TrustRoute";

const ContactUspage = () => {
  return (
    <TrustNavbar title="Contact Us">
      <ContactUs />
    </TrustNavbar>
  );
};

export default TrustRoute(ContactUspage);
