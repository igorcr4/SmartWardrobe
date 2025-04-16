
interface ClothingItemProps {
  imageSrc: string;
  alt: string;
}

const ClothingItem = ({ imageSrc, alt }: ClothingItemProps) => {
  return (
    <div className="wardrobe-item flex items-center justify-center aspect-square">
      <img src={imageSrc} alt={alt} className="max-h-full object-contain" />
    </div>
  );
};

export default ClothingItem;
