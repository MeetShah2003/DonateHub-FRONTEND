import ContactUs from "@/components/ContactUs";
<<<<<<< HEAD
=======
import ContactUsTrust from "@/components/ContactUsTrust";
>>>>>>> 3e757c6e68be813167c7a3650ac14186dc26079e
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
