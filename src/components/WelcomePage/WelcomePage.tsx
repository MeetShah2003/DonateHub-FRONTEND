import FacebookIcon from "@/icons/FacebookIcon";
import { ReactNode } from "react";
import { Typewriter } from "react-simple-typewriter";

const DISPLAY_WORDS: string[] = [
  "Life",
  "Education",
  "Empowerment",
  "Welfare",
  "Reform",
  "Relief",
];

const WelcomePage: React.FC<{
  children: ReactNode;
  title: string;
  secondTitle: string;
}> = ({ children, secondTitle, title }) => {
  return (
    <div className="max-w-full w-full h-screen flex">
      <div className="hidden md:flex md:flex-col md:justify-center w-3/5 gap-3 bg-primary z-50 p-20 justify-start items-start">
        <div className="text-white font-bold flex flex-col text-6xl leading-snug font-josefinSans">
          <p className="drop-shadow-2xl">{title}</p>
          <p className="drop-shadow-2xl">{secondTitle}</p>
        </div>
        <div className="flex text-white text-3xl">
          <p className="mr-2">Help To</p>
          <Typewriter loop={false} cursor words={DISPLAY_WORDS} />
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-center md:w-2/5">
        {children}
      </div>
    </div>
  );
};

export default WelcomePage;
