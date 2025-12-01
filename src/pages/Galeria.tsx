import { useState } from "react";
import { X } from "lucide-react";
import { mockGalleryImages } from "@/data/mockData";

export default function Galeria() {
  const [selectedImage, setSelectedImage] = useState<typeof mockGalleryImages[0] | null>(null);

  // Show max 30 images
  const images = mockGalleryImages.slice(0, 30);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Galería</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Registro fotográfico de las actividades, eventos y momentos destacados del Colegio de Antropología.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="aspect-square overflow-hidden rounded-lg group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img
                  src={image.imageUrl}
                  alt={image.altText}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </button>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay imágenes disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-8 h-8" />
          </button>
          <div 
            className="max-w-4xl max-h-[90vh] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.altText}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-primary-foreground text-center mt-4">{selectedImage.altText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
