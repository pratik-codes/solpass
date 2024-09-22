"use client";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function Footer() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data: any) => {
        // Handle form submission logic here
    };

    return (
        <footer className="border-t dark:bg-black">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2">
                    <div className="border-b py-8 lg:order-last lg:border-b-0 lg:border-s lg:py-16 lg:ps-16">
                        <div className="mt-8 space-y-4 lg:mt-0">
                            <div>
                                <h3 className="text-2xl font-medium">
                                    Stay Updated with Solpass
                                </h3>
                                <p className="mt-4 max-w-lg">
                                    Sign up for our newsletter to get the latest updates on
                                    Solpass and blockchain security features.
                                </p>
                            </div>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-col border rounded-xl p-4 gap-3 mt-6 w-full">
                                <Input
                                    {...register("email", { required: true })}
                                    placeholder="Enter your email"
                                    className="rounded-xl"
                                    type="email"
                                />
                                <Button type="submit" className="rounded-xl">Sign Up</Button>
                            </form>
                        </div>
                    </div>

                    <div className="py-8 lg:py-16 lg:pe-16">
                        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
                            <div>
                                <p className="font-medium">Follow Us</p>

                                <ul className="mt-6 space-y-4 text-sm">
                                    <li>
                                        <a
                                            href="https://twitter.com/solpass"
                                            target="_blank"
                                            className="transition hover:opacity-75">
                                            Twitter
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://www.youtube.com/@solpass"
                                            target="_blank"
                                            className="transition hover:opacity-75">
                                            YouTube
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <p className="font-medium">Resources</p>

                                <ul className="mt-6 space-y-4 text-sm">
                                    <li>
                                        <a
                                            target="_blank"
                                            href="/docs"
                                            rel="noopener noreferrer"
                                            className="transition hover:opacity-75">
                                            Docs
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/methodology"
                                            className="transition hover:opacity-75">
                                            Methodology
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 border-t pt-8">
                            <ul className="flex flex-wrap gap-4 text-xs">
                                <li>
                                    <a
                                        href="/terms"
                                        target="_blank"
                                        className="transition hover:opacity-75">
                                        Terms & Conditions
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/privacy"
                                        target="_blank"
                                        className="transition hover:opacity-75">
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>

                            <p className="mt-8 text-xs">
                                &copy; 2024 Solpass. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
