"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  generateSeedPhrase,
  saveKeys,
  generateKeysFromSeedPhrase,
  encryptData,
  validatePin,
} from "@/lib/utils";
import { toast } from "sonner";
import { Clipboard } from "lucide-react";
import { BlueButton, GrayButton } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";

export default function AnonyomousAuth({ type }: { type: string }) {
  const [step, setStep] = React.useState(type || "login");
  const [keys, setKeys] = React.useState<{
    publicKey: string;
    privateKey: string;
  } | null>(null);
  const [seedPhrases, setSeedPhrases] = React.useState<string[]>([]);
  const [pin, setPin] = React.useState("");

  // function that generates seed phrases
  const generateSeedPhrases = () => {
    const seed = generateSeedPhrase();
    setSeedPhrases(seed.split(" "));
    setKeys(generateKeysFromSeedPhrase(seed));
    // get the encryption key from the environment variable
    const success = saveKeys(seed, process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
    if (!success) {
      toast("Failed to save keys");
      return;
    }

    setStep("confirm");
  };

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast("Copied to clipboard");
        console.log("Seed phrases copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // function that handles the pin additin on setup page 
  const PinSuccess = (e: any) => {
    e.preventDefault();
    const isOtpValid = pin !== "" && pin.length === 6;
    if (!isOtpValid) {
      toast.error("Invalid pin");
      return;
    }

    // saving the pin after encrypting it to avoid any security issues
    const encryptedPin = encryptData(pin);
    if (encryptedPin === "") {
      toast.error("Failed to save pin, try again...");
      return;
    }

    // save the pin
    localStorage.setItem("pin", encryptedPin);

    toast("signup succeded");

    setStep("done");
    console.log("success", pin);
  };

  // as the name suggests its the login handler
  const loginHandler = (e: any) => {
    e.preventDefault();
    const seed = e.target[0].value;
    const pin = e.target[1].value;

    // validate the seed phrase
    if (seed === "") {
      toast.error("Seed phrase is required");
      return;
    }

    // checking valid seed phrases
    const seedPhrases = seed.split(" ");
    if (seedPhrases.length !== 12) {
      toast.error("Invalid seed phrase");
      return;
    }

    const keys = generateKeysFromSeedPhrase(seed);

    // save the pin
    const isSaveValid = validatePin(pin, keys?.publicKey, keys?.privateKey);
    if (!isSaveValid) {
      toast.error("Please add a valid pin");
      return;
    }

    const isValidSave = saveKeys(seed, process.env.NEXT_PUBLIC_ENCRYPTION_KEY);
    if (!isValidSave) {
      toast.error("Failed to save keys");
      return;
    }

    toast("login succeded");
    setStep("done"); 
  }

  useEffect(() => {
    if (step === "done") {
      document.cookie = "pk=true";
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    }
  }, [step]);

  if (step === "done") {
    return (
      <main className="w-full min-h-screen flex overflow-y-hidden">
        <div className="flex-1 relative flex items-center justify-center min-h-full">
          <img
            className="absolute inset-x-0 -z-1 -top-20 opacity-75 "
            src={
              "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fhero-left.png&w=384&q=75"
            }
            width={1000}
            height={1000}
            alt="back bg"
          />
          <div className="w-full max-w-md md:max-w-lg space-y-8 px-4  text-gray-600 sm:px-0 z-20">
            <div className="relative">
              <img
                src="https://farmui.com/logo.svg"
                width={100}
                className="lg:hidden rounded-full"
              />
              <div className="mt-5 space-y-4 flex flex-col items-center">
                <Image
                  src="https://media1.tenor.com/m/PJUSkqvU4cgAAAAC/spongebob-done.gif"
                  width={1000}
                  height={1000}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === "password") {
    return (
      <main className="w-full min-h-screen flex overflow-y-hidden">
        <div className="flex-1 relative flex items-center justify-center min-h-full">
          <img
            className="absolute inset-x-0 -z-1 -top-20 opacity-75 "
            src={
              "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fhero-left.png&w=384&q=75"
            }
            width={1000}
            height={1000}
            alt="back bg"
          />
          <div className="w-full max-w-md md:max-w-lg space-y-8 px-4  text-gray-600 sm:px-0 z-20">
            <div className="relative">
              <img
                src="https://farmui.com/logo.svg"
                width={100}
                className="lg:hidden rounded-full"
              />
              <div className="mt-5 space-y-2">
                <h3 className="text-gray-900 dark:text-gray-200 text-3xl  font-semibold tracking-tighter sm:text-4xl">
                  Set your pin
                </h3>
                <p className="text-gray-900 dark:text-gray-400">
                  This pin will be used to login to your account as a 2FA
                  credentials.
                </p>
              </div>
            </div>
            <Separator className="h-px bg-white/20 dark:bg-gray-800" />
            <form onSubmit={PinSuccess} className="space-y-5 z-20">
              <div className="w-full flex justify-center mb-8">
                <InputOTP
                  maxLength={6}
                  value={pin}
                  onChange={(value) => setPin(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <BlueButton>Signup</BlueButton>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (step === "confirm") {
    return (
      <main className="w-full min-h-screen flex overflow-y-hidden">
        <div className="flex-1 relative flex items-center justify-center min-h-full">
          <img
            className="absolute inset-x-0 -z-1 -top-20 opacity-75 "
            src={
              "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fhero-left.png&w=384&q=75"
            }
            width={1000}
            height={1000}
            alt="back bg"
          />
          <div className="w-full max-w-md md:max-w-lg space-y-8 px-4  text-gray-600 sm:px-0 z-20">
            <div className="relative">
              <img
                src="https://farmui.com/logo.svg"
                width={100}
                className="lg:hidden rounded-full"
              />
              <div className="mt-5 space-y-2">
                <h3 className="text-gray-900 dark:text-gray-200 text-3xl  font-semibold tracking-tighter sm:text-4xl">
                  Confirm your seed phrases
                </h3>
                <p className="text-gray-900 dark:text-gray-400">
                  Have a account already?{" "}
                  <Link
                    href="/anonymous"
                    className="font-medium text-indigo-600 hover:text-indigo-500">
                    login{" ->"}
                  </Link>
                </p>
              </div>
            </div>
            <Separator className="h-px bg-white/20 dark:text-gray-400 text-gray-900" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {seedPhrases.map((phrase, index) => (
                <div
                  key={index}
                  className="rounded-xl inline-flex text-center group items-center justify-center bg-gradient-to-tr from-zinc-300/5 via-gray-400/5 to-transparent bg-transparent border-input border-[1px] hover:bg-transparent/10 transition-colors py-4 px-6">
                  <span className="text-gray-900 dark:text-gray-400">
                    {phrase}
                  </span>
                </div>
              ))}
            </div>
            {/* <div>
              <label className="font-medium text-gray-900 dark:text-gray-400 font-geist placeholder:text-gray-900 mb-6">
                Private key
              </label>
              <div className="flex justify-between items-center border-2 rounded-xl p-4 mt-2">
                <p className="text-gray-900 dark:text-gray-400">
                  {keys?.privateKey.substring(0, 40)}...{" "}
                </p>
                <div
                  onClick={() => {
                    copyToClipboard(keys?.privateKey || "");
                  }}
                  className="border rounded-xl p-2 cursor-pointer hover:bg-gray-900">
                  <Clipboard className="w-6 h-6 text-gray-900 dark:text-gray-400" />
                </div>
              </div>
            </div> */}
            <p className="text-gray-900 dark:text-gray-400">
              Please copy the seed phrases and store them in
              a safe place. You will need them to login to your account.
            </p>
            <div className="space-y-4">
              <GrayButton
                className="mt-2"
                onClick={() => {
                  copyToClipboard(seedPhrases.join(" "));
                }}>
                Copy seed phrases
              </GrayButton>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep("password");
                }}
                className="z-20">
                <BlueButton>Saved & Continue</BlueButton>
              </form>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (step === "setup") {
    return (
      <main className="w-full min-h-screen flex overflow-y-hidden">
        <div className="flex-1 relative flex items-center justify-center min-h-full">
          <img
            className="absolute inset-x-0 -z-1 -top-20 opacity-75 "
            src={
              "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fhero-left.png&w=384&q=75"
            }
            width={1000}
            height={1000}
            alt="back bg"
          />
          <div className="w-full max-w-md md:max-w-lg space-y-8 px-4  text-gray-600 sm:px-0 z-20">
            <div className="relative">
              <img
                src="https://farmui.com/logo.svg"
                width={100}
                className="lg:hidden rounded-full"
              />
              <div className="mt-5 space-y-2">
                <h3 className="text-gray-900 dark:text-gray-200 text-3xl  font-semibold tracking-tighter sm:text-4xl">
                  Lets get you setup
                </h3>
                <p className="text-gray-900 dark:text-gray-400">
                  Have a account already?{" "}
                  <Link
                    href="/anonymous"
                    className="font-medium text-indigo-600 hover:text-indigo-500">
                    login{" ->"}
                  </Link>
                </p>
              </div>
            </div>
            <Separator className="h-px bg-white/20 dark:text-gray-400 text-gray-900" />
            <p className="text-gray-900 dark:text-gray-400">
              When you click this button, a 12-word seed phrase will be
              generated for you. This seed phrase is a unique and essential key
              to secure access to your account and recover it in case you lose
              access. It acts as a backup for your private key, which is
              required to manage and retrieve your passwords.
            </p>
            <form
              onSubmit={(e) => {
                console.log("clicked");
                e.preventDefault();
                generateSeedPhrases();
              }}>
              <BlueButton>Generate seed phrases</BlueButton>
            </form>
          </div>
        </div>
      </main>
    );
  }

  if (step === "login") {
    return (
      <main className="w-full min-h-screen flex overflow-y-hidden">
        <div className="flex-1 relative flex items-center justify-center min-h-full">
          <img
            className="absolute inset-x-0 -z-1 -top-20 opacity-75 "
            src={
              "https://pipe.com/_next/image?url=%2Fassets%2Fimg%2Fhero-left.png&w=384&q=75"
            }
            width={1000}
            height={1000}
            alt="back bg"
          />
          <div className="w-full max-w-md md:max-w-lg space-y-8 px-4  text-gray-600 sm:px-0 z-20">
            <div className="relative">
              <img
                src="https://farmui.com/logo.svg"
                width={100}
                className="lg:hidden rounded-full"
              />
              <div className="mt-5 space-y-2">
                <h3 className="text-gray-900 dark:text-gray-200 text-3xl  font-semibold tracking-tighter sm:text-4xl">
                  Enter your detiails to login
                </h3>
                <p className="text-gray-900 dark:text-gray-400">
                  Dont have an account?{" "}
                  <Link
                    href="/anonymous/setup"
                    className="font-medium text-indigo-600 hover:text-indigo-500">
                    lets get you setup {"->"}
                  </Link>
                </p>
              </div>
            </div>
            <Separator className="h-px bg-white/20 dark:bg-gray-800" />
            <form
              onSubmit={loginHandler}
              className="space-y-5 z-20">
              <div>
                <label className="font-medium text-gray-900 dark:text-gray-400 font-geist placeholder:text-gray-900">
                  Enter your seed phrases 
                </label>
                <Input
                  type="text"
                  required
                  className="mb-6 w-full mt-2 px-3 py-5 text-gray-500 dark:text-gray-300 bg-transparent outline-none border dark:border-gray-700 focus:border-purple-600 shadow-sm rounded-lg"
                />

                <label className=" font-medium text-gray-900 dark:text-gray-400 font-geist placeholder:text-gray-900">
                  Enter your pin
                </label>
                <Input
                  type="number"
                  required
                  className="w-full mt-2 px-3 py-5 text-gray-500 dark:text-gray-300 bg-transparent outline-none border dark:border-gray-700 focus:border-purple-600 shadow-sm rounded-lg"
                />
              </div>
              <BlueButton>login</BlueButton>
            </form>
          </div>
        </div>
      </main>
    );
  }
}
