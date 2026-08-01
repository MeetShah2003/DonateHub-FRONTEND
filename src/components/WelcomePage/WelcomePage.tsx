import Logo from "@/icons/Logo";
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
    <div className="flex h-screen w-full max-w-full overflow-hidden bg-slate-50">
      <div className="hidden w-[58%] flex-col items-start justify-center gap-6 bg-gradient-to-br from-primary via-violet-800 to-slate-950 p-20 md:flex">
        <div className="rounded-[28px] border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-white/80 backdrop-blur-sm">
          DonateHub
        </div>
        <div className="flex flex-col text-6xl font-bold leading-snug text-white font-josefinSans">
          <p className="drop-shadow-2xl">{title}</p>
          <p className="drop-shadow-2xl">{secondTitle}</p>
        </div>
        <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-2xl text-white backdrop-blur-sm">
          <p className="mr-1 text-white/90">Help To</p>
          <Typewriter loop={false} cursor words={DISPLAY_WORDS} />
        </div>
      </div>
      <div className="flex w-full flex-col justify-center gap-10 overflow-hidden bg-slate-50 md:w-[42%]">
        <div className="flex items-center justify-center md:hidden">
          <Logo />
        </div>
        <div className="mx-auto w-full max-w-[520px] px-4 md:px-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
