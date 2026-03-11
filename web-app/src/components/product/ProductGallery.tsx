import { useState } from "react"

type Props = {
    images: string[]
    title: string
}

export default function ProductGallery({ images, title }: Props) {
    const [selectedImage, setSelectedImage] = useState(images[0])

    return (
        <div className="flex flex-col gap-4">

            <div className="aspect-square bg-surface rounded-lg overflow-hidden border">
                <img
                    src={selectedImage}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex gap-3">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        className={`border rounded-md overflow-hidden 
                        ${selectedImage === img ? "border-primary" : "border-gray-200"}`}
                    >
                        <img
                            src={img}
                            alt={`${title}-${index}`}
                            className="w-20 h-20 object-cover"
                        />
                    </button>
                ))}
            </div>

        </div>
    )
}