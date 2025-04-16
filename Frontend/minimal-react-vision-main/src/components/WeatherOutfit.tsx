
import { Button } from "@/components/ui/button";

interface WeatherOutfitProps {
  temperature: number;
  condition: string;
  outfits: {
    image: string;
    alt: string;
  }[];
}

const WeatherOutfit = ({ temperature, condition, outfits }: WeatherOutfitProps) => {
  return (
    <div className="bg-wardrobe-beige rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">
        {temperature}° {condition}
      </h3>
      
      <div className="flex gap-4 mb-4">
        {outfits.map((outfit, index) => (
          <div key={index} className="bg-white p-2 rounded-md shadow-sm">
            <img src={outfit.image} alt={outfit.alt} className="h-24 object-contain" />
          </div>
        ))}
      </div>
      
      <Button className="w-full bg-wardrobe-yellow text-black hover:bg-wardrobe-yellow/90">
        AFIȘEAZĂ ȚINUTA
      </Button>
    </div>
  );
};

export default WeatherOutfit;
