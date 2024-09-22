import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { TITLE_TAILWIND_CLASS } from "@/utils/constants"

const faqs = [
  {
    question: "What is Solpass?",
    answer:
      "Solpass is a decentralized password manager built on the Solana blockchain. It allows users to securely store and manage their passwords without relying on centralized servers, ensuring privacy and security through encryption with public and private keys.",
  },
  {
    question: "How does Solpass ensure my passwords are secure?",
    answer:
      "Solpass uses blockchain encryption where a unique 16-seed phrase and a public-private key pair are generated for each user. Only the private key can decrypt your data, ensuring that only you have access to your passwords.",
  },
  {
    question: "Can I recover my account if I lose my private key?",
    answer:
      "No. Your private key and seed phrase are the only ways to access your account. If lost, your data cannot be recovered due to the decentralized nature of Solpass.",
  },
  {
    question: "How does Solpass differ from traditional password managers?",
    answer:
      "Traditional password managers store your data on centralized servers, making them vulnerable to breaches. Solpass uses a decentralized approach with blockchain technology, ensuring that only you control your passwords, eliminating the risk of third-party access.",
  },
  {
    question: "What is a seed phrase, and why is it important?",
    answer:
      "A seed phrase is a series of 16 random words generated when you create a Solpass account. It acts as the master key to your account, allowing you to recover access in case of device loss or reset.",
  },
  {
    question: "Can I share my Solpass account with someone else?",
    answer:
      "Since Solpass is built on a public-private key system, sharing your private key would give full access to your account. We highly recommend not sharing your private key with anyone.",
  },
  {
    question: "How do I create a Solpass account?",
    answer:
      "Simply sign up on the Solpass platform. When you create an account, a 16-seed phrase and a public-private key pair will be generated. Make sure to securely store your private key and seed phrase for future access.",
  },
];


export function AccordionComponent() {
    return (
        <div className="flex flex-col w-[70%] lg:w-[50%]">
            <h2 className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold text-center tracking-tight dark:text-white text-gray-900`}>
                Frequently Asked Questions (FAQs)
            </h2>
            <Accordion type="single" collapsible className="w-full mt-2 mb-[6rem]">
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>
                            <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <p>{faq.answer}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
