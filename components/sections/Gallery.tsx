import Image from "next/image";

const galleryImages = [
  {
    id: 1,
    image: "/gallery/room1.png",
  },
  {
    id: 2,
    image: "/gallery/pool.png",
  },
  {
    id: 3,
    image: "/gallery/room2.png",
  },
  {
    id: 4,
    image: "/gallery/room3.png",
  },
  {
    id: 5,
    image: "/gallery/gym.jpg",
  },
  {
    id: 6,
    image: "/gallery/room4.png",
  },
];

export function Gallery() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Gallery</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Explore our stunning gallery showcasing the beauty and elegance of
          our hotel. From luxurious rooms to breathtaking views, each image
          captures the essence of a perfect getaway.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((item) => (
            <div
              key={item.id}
              className="relative rounded-lg overflow-hidden group shadow-lg"
            >
              <Image
                src={item.image}
                alt={`Gallery image ${item.id}`}
                width={400}
                height={250}
                className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}