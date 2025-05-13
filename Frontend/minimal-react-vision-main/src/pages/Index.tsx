
import React from "react";
import Layout from "@/components/Layout";
import ClothingGrid from "@/components/ClothingGrid";
import ClothingItem from "@/components/ClothingItem";
import PlannerEvent from "@/components/PlannerEvent";
import StatCard from "@/components/StatCard";
import WeatherOutfit from "@/components/WeatherOutfit";
import OutfitCard from "@/components/OutfitCard";
import { Mic, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Mock clothing items
  const clothingItems = [
    { id: 1, src: "/lovable-uploads/1376999b-afa9-4b3e-8574-bd2d44992939.png", alt: "Blue sweater" },
    { id: 2, src: "/placeholder.svg", alt: "White t-shirt" },
    { id: 3, src: "/placeholder.svg", alt: "Blue jeans" },
    { id: 4, src: "/placeholder.svg", alt: "Patterned shirt" },
    { id: 5, src: "/placeholder.svg", alt: "Beige coat" },
    { id: 6, src: "/placeholder.svg", alt: "Brown bag" },
    { id: 7, src: "/placeholder.svg", alt: "Plaid skirt" },
    { id: 8, src: "/placeholder.svg", alt: "Black boots" },
    { id: 9, src: "/placeholder.svg", alt: "Brown boots" },
  ];
  
  // Mock outfits for inspiration
  const inspirationItems = [
    { id: 1, src: "/placeholder.svg", alt: "Red coat outfit" },
    { id: 2, src: "/placeholder.svg", alt: "Beige coat outfit" },
    { id: 3, src: "/placeholder.svg", alt: "Brown blazer outfit" },
    { id: 4, src: "/placeholder.svg", alt: "Pleated skirt outfit" },
    { id: 5, src: "/placeholder.svg", alt: "Gray blazer outfit" },
  ];
  
  // Weather outfit items
  const weatherOutfits = [
    { image: "/placeholder.svg", alt: "Coat" },
    { image: "/placeholder.svg", alt: "Boots" },
  ];

  return (
    <Layout>
      {/* Voice Assistant */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-shrink-0">
          <div className="bg-wardrobe-blue rounded-full p-6 inline-flex">
            <Mic size={30} className="text-white" />
          </div>
        </div>
        
        <div className="flex-grow">
          <h2 className="text-2xl font-bold mb-1">Cu ce mă îmbrac azi?</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Wardrobe Section */}
        <div className="col-span-1 lg:col-span-2">
          <ClothingGrid 
            title="Garderobă" 
            action={<Button variant="outline" size="sm">Scanează articol</Button>}
          >
            {clothingItems.map(item => (
              <ClothingItem key={item.id} imageSrc={item.src} alt={item.alt} />
            ))}
          </ClothingGrid>
          
          {/* Planner Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Planer</h2>
              <Button variant="ghost" size="sm">
                <Plus size={18} />
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <PlannerEvent day={26} type="BUSINESS" description="Ocupal al întăinere" />
              <PlannerEvent day={27} type="TRAVEL" description="La Paris" />
            </div>
          </div>
        </div>
        
        <div className="col-span-1">
          {/* AI Recommendations */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recomandări AI personalizate</h2>
            <WeatherOutfit 
              temperature={15} 
              condition="Ploaie" 
              outfits={weatherOutfits} 
            />
          </div>
          
          {/* Statistics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Statistici</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 gap-4">
                <StatCard 
                  title="Ținute solvate" 
                  value={8} 
                  icon={<div className="bg-wardrobe-lightblue p-2 rounded-md">
                    <img src="/placeholder.svg" alt="Shirt" className="w-10 h-10" />
                  </div>} 
                />
                <StatCard 
                  title="Culori dominante" 
                  value="" 
                  icon={<div className="w-16 h-16 rounded-full overflow-hidden">
                    <div className="flex h-full">
                      <div className="bg-wardrobe-blue w-1/2"></div>
                      <div className="bg-wardrobe-beige w-1/2"></div>
                    </div>
                  </div>} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
