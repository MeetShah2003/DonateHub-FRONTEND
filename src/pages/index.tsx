import Visitor from "@/components/Visitor";

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
