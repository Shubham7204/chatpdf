"use client"

import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from 'react';

const features = [
  {
    name: "Store your PDF Documents",
    description:
      "Keep all your important PDF files securely stored and easily accessible anytime, anywhere.",
    icon: GlobeIcon,
  },
  {
    name: "Blazing Fast Responses",
    description:
      "Experience lightning-fast answers to your queries, ensuring you get the information you need instantly.",
    icon: ZapIcon,
  },
  {
    name: "Chat Memorisation",
    description:
      "Our intelligent chatbot remembers previous interactions, providing a seamless and personalized experience.",
    icon: BrainCogIcon,
  },
  {
    name: "Interactive PDF Viewer",
    description:
      "Engage with your PDFs like never before using our intuitive and interactive viewer.",
    icon: EyeIcon,
  },
  {
    name: "Cloud Backup",
    description:
      "Rest assured knowing your documents are safely backed up on the cloud, protected from loss or damage.",
    icon: ServerCogIcon,
  },
  {
    name: "Responsive Across Devices",
    description:
      "Access and chat with your PDFs seamlessly on any device, whether it's your desktop, tablet, or smartphone.",
    icon: MonitorSmartphoneIcon,
  },
];

export default function Home() {
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = imageWrapperRef.current;
    if (!wrapper) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = wrapper.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      const rotateX = (mouseY / height) * 20; // Adjust the 20 for more or less rotation
      const rotateY = (mouseX / width) * 20; // Adjust the 20 for more or less rotation

      wrapper.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      wrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-gray-900 to-gray-800">
      <div className="bg-gray-800 py-24 sm:py-32 rounded-md drop-shadow-xl text-gray-100">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-teal-400">
              Your Interactive Document Companion
            </h2>

            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-teal-400 to-yellow-300 text-transparent bg-clip-text">
              Transform Your PDFs into Interactive Conversations
            </p>

            <p className="mt-6 text-lg leading-8">
              Introducing{" "}
              <span className="font-bold text-teal-400">Chat with PDF.</span>
              <br />
              <br /> Upload your document, and our chatbot will answer
              questions, summarize content, and answer all your Qs. Ideal for
              everyone, <span className="text-teal-400">Chat with PDF</span>{" "}
              turns static documents into{" "}
              <span className="font-bold text-yellow-300">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>

          <Button asChild className="mt-10 bg-teal-500 hover:bg-teal-600 text-white">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>

        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div 
              ref={imageWrapperRef} 
              className="image-wrapper transition-transform duration-300 ease-out"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Image
                alt="App screenshot"
                src="https://i.imgur.com/VciRSTI.jpeg"
                width={2432}
                height={1442}
                className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-700/10"
              />
            </div>
            <div aria-hidden="true" className="relative">
              <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-gray-800/95 pt-[5%]" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-9 group">
                <dt className="inline font-semibold text-teal-400">
                  <feature.icon
                    aria-hidden="true"
                    className="absolute left-1 top-1 h-5 w-5 text-yellow-300 transition-transform duration-300 group-hover:scale-110"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-2">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}