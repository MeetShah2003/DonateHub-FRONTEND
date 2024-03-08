import AboutUs from "@/components/AboutUs";
import UserRoute from "@/components/UserRoute/UserRoute";
import Visitor from "@/components/Visitor";

const UserAboutUs = () => {
  return (
    <div>
      <div className="sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      <h1 className="font-inter p-5 font-semibold text-steelGray text-xl sm:text-2xl">
        About Us
      </h1>
      <div className="p-5">
        <AboutUs />
      </div>
    </div>
  );
};

export default UserRoute(UserAboutUs);
