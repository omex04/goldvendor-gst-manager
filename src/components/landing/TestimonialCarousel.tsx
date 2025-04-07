
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import useEmblaCarousel from 'embla-carousel-react';

interface Testimonial {
  quote: string;
  name: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Gold GST Manager has simplified our invoicing process. We've saved hours each week on paperwork.",
    name: "Rajesh Jewelers",
    location: "Mumbai"
  },
  {
    quote: "The GST calculations are always accurate, and customer support is excellent. Highly recommended.",
    name: "Golden Touch Emporium",
    location: "Delhi"
  },
  {
    quote: "As a small business, the affordable pricing and professional invoices have helped us look more established.",
    name: "Sunshine Jewelry",
    location: "Bangalore"
  },
  {
    quote: "The platform has streamlined our entire invoicing process. It's intuitive and easy to use.",
    name: "Royal Gold",
    location: "Chennai"
  },
  {
    quote: "I've been able to focus more on my craft and less on paperwork since using this platform.",
    name: "Heritage Jewels",
    location: "Jaipur"
  }
];

const TestimonialCarousel = () => {
  const [api, setApi] = useState<ReturnType<typeof useEmblaCarousel>[1]>();
  
  // Auto-play configuration
  useEffect(() => {
    if (!api) return;
    
    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Scroll every 5 seconds
    
    return () => {
      clearInterval(autoplayInterval);
    };
  }, [api]);
  
  return (
    <Carousel 
      className="w-full max-w-5xl mx-auto" 
      opts={{
        align: "start",
        loop: true
      }}
      setApi={setApi}
    >
      <CarouselContent>
        {testimonials.map((testimonial, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-1">
            <div className="p-1">
              <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardContent className="pt-6">
                  <p className="italic text-gray-600 dark:text-gray-300 mb-4">
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-6 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gold-200 dark:bg-gold-900/40 flex items-center justify-center text-gold-800 dark:text-gold-300 font-bold mr-3">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-4">
        <CarouselPrevious className="relative static left-0 translate-y-0 mr-2" />
        <CarouselNext className="relative static right-0 translate-y-0 ml-2" />
      </div>
    </Carousel>
  );
};

export default TestimonialCarousel;
