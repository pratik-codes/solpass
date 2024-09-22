import { GithubIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import HeroAnimated from "./HeroAnimated";
import Link from "next/link";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

const THUMBNAIL_SRC =
  "https://cdn.dribbble.com/users/542812/screenshots/13934313/media/7a7e8cf1d1c769663bdf8455fac6d3db.png";

const HeroSection = () => {
  return (
    <>
      <section className="min-h-[800px] w-full mt-0 md:mt-16 relative p-4 md:p-0">
        <div className="absolute -z-1 inset-0 opacity-5  h-[1000px] w-full bg-transparent  bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <img
          className="absolute inset-x-0 -top-20 opacity-75 "
          src={
            "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fhero-left.png&w=384&q=75"
          }
          width={1000}
          height={1000}
          alt="back bg"
        />
        <div className="relative z-10 max-w-4xl translate-y-[33%]  mx-auto space-y-4">
          <HeroAnimated
            header="Secure Your Digital Life with Decentralized Precision"
            headerClassName="text-center max-w-5xl text-5xl md:text-6xl tracking-tighter mx-auto lg:text-7xl font-bold font-geist  font-normal  text-transparent bg-clip-text bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] leading-0 md:leading-0 md:pb-0 mt-1"
            description="Manage your passwords with unmatched security and privacy on the Solana blockchain. Experience the future of password management today."
            descriptionClassName="mx-auto text-zinc-400 text-center text-md lg:max-w-2xl md:py-5">
            <div className="flex flex-wrap items-center justify-center  gap-3">
              <Link
                href="/home"
                className="rounded-xl inline-flex text-center group items-center w-full justify-center bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent bg-transparent  border-input border-[1px] hover:bg-transparent/10 transition-colors sm:w-auto py-4 px-10">
                Get started
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 duration-300" />
              </Link>
              <Link
                href="https://github.com/pratik-codes/SolPass"
                className="rounded-xl inline-flex w-full justify-center items-center gap-x-2 border border-zinc-800 hover:border-zinc-600 bg-zinc-950 hover:text-zinc-100 duration-200 sm:w-auto py-4 px-10"
                target="_blank">
                <GithubIcon className="w-5 h-5" />
                Star on GitHub
              </Link>
            </div>
          </HeroAnimated>
        </div>
        
        <HeroAnimated header="" description="">
          <div className="relative md:w-8/12 mx-auto mt-[10rem]">
            <HeroVideoDialog
              className="dark:hidden block"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/97UwQiFZOKU?si=NN6zOPnb4bcFaP44"
              thumbnailSrc={THUMBNAIL_SRC}
              thumbnailAlt="Hero Video"
            />
            <HeroVideoDialog
              className="hidden dark:block"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/97UwQiFZOKU?si=NN6zOPnb4bcFaP44"
              thumbnailSrc={THUMBNAIL_SRC}
              thumbnailAlt="Hero Video"
            />
          </div>
        </HeroAnimated>
      </section>
    </>
  );
};
export default HeroSection;
