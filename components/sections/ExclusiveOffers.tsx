import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { exclusiveOffers } from "@/app/assets/assets";

export function ExclusiveOffers() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Exclusive Offers</h2>
          <Link
            href="/list-rooms"
            className="text-sm font-medium flex items-center hover:underline"
          >
            View All Offers <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Take advantage of our limited-time offers and special packages to
          enhance your stay and create unforgettable memories.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {exclusiveOffers.map((offer) => (
            <div
              key={offer._id}
              className="relative rounded-lg overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
              <Image
                src={offer.image}
                alt={offer.title}
                width={400}
                height={250}
                className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 z-20">
                <Badge className="bg-rose-600 hover:bg-rose-700">
                  {offer.priceOff}% OFF
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                <h3 className="font-bold text-lg mb-1">{offer.title}</h3>
                <p className="text-sm text-white/90 mb-3">
                  {offer.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    Valid until {offer.expiryDate}
                  </span>
                  <Link
                    href="/list-rooms"
                    className="text-sm font-medium flex items-center hover:underline"
                  >
                    View Offers <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
