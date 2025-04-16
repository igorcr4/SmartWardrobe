
interface OutfitCardProps {
  imageSrc: string;
  alt?: string;
}

const OutfitCard = ({ imageSrc, alt = "Outfit inspiration" }: OutfitCardProps) => {
  return (
    <div className="bg-white rounded-md shadow-sm hover:shadow-md transition-all overflow-hidden">
      <img src={imageSrc} alt={alt} className="w-full h-full object-cover aspect-[3/4]" />
    </div>
  );
};

export default OutfitCard;
