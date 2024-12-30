"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <>
      <div className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-r from-green-300 via-teal-200 to-green-400 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900">
        <h1 className="mx-auto max-w-4xl font-display text-4xl md:text-6xl font-extrabold tracking-tight text-gray-800 dark:text-gray-200">
          Tell it like it is—nobody’s watching.
          <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-600">
            Lowkey roasting,
            <br /> highkey impactful.
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl">
          Your personal NGL experience—delivering raw, unfiltered feedback with
          a touch of fun!
        </p>
        <Carousel
          plugins={[Autoplay({ delay: 3000 })]}
          className="mt-8 w-full max-w-lg md:max-w-2xl bg-yellow-200 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-teal-500 text-white dark:bg-gray-700 ml-4">
                  <CardHeader>
                    <CardTitle className="text-orange-300 text-lg md:text-xl">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="text-orange-300 flex-shrink-0" />
                      <p>{message.content}</p>
                    </div>
                    <p className="text-xs text-gray-200">
                      Received: {message.received}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <Link
          href="/get-started"
          className="mt-8 inline-block bg-orange-600 hover:bg-orange-500 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>

      {/* Footer */}
      <footer className=" w-full text-center p-4 bg-gray-900 text-gray-200">
        <p className="text-sm md:text-base">
          © 2024 Feedback Ninjas! All rights reserved.
        </p>
        <p className="mt-2 text-xs md:text-sm">
          Built with ❤️ by our amazing team.
        </p>
      </footer>
    </>
  );
}
