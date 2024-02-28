import SignUp from "@/components/SignUp";
import Visitor from "@/components/Visitor";
import UserFrame from "@/components/Visitor";
import WelcomePage from "@/components/WelcomePage";

const home = () => {
  return (
    <div>
      <div className="navbar sticky top-0 bg-white z-10">
        <Visitor />
      </div>
      {/* <SignUp /> */}
    </div>
  );
};

export default home;
