import WelcomePage from "@/components/WelcomePage";
import TickIcon from "@/icons/TickIcon";
import Link from "next/link";

const PasswordChangeSuccess = () => {
  return (
    <WelcomePage title="Password" secondTitle="Changed Success">
      <form className="mx-5 lg:mx-20 py-10 gap-20">
        <div className="flex justify-center px-2 py-1 focus-within:border-primary">
          <TickIcon />
        </div>
        <div className="flex flex-col justify-center items-center px-2 my-10 focus-within:border-primary">
          <h3 className="font-inter text-2xl drop-shadow-2xl tracking-wider font-bold mb-3">
            Password Changed
          </h3>
          <p className="text-center text-gray-400 mb-5">
            Your password has been changed successfully. You can now login with
            your new password.
          </p>

          <Link
            href={"/login"}
            className="flex flex-col border-2 mt-5 text-white bg-primary shadow-sm rounded-lg px-3 py-2"
          >
            Login Now
          </Link>
        </div>
      </form>
    </WelcomePage>
  );
};

export default PasswordChangeSuccess;
