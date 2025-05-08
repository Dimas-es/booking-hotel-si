import Image from "next/image"

interface PhotoGalleryProps {
  images: string[]
}

export function PhotoGallery({ images }: PhotoGalleryProps) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-8">
      {images.map((image, index) => (
        <div 
          key={index} 
          className={`relative h-full ${
            index === 0 
              ? 'min-h-[200px] col-span-3 md:col-span-1 row-span-2' 
              : 'min-h-[150px] col-span-3 md:col-span-1'
          }`}
        >
          <Image
            src={image}
            alt={`Hotel room ${index + 1}`}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  )
} 