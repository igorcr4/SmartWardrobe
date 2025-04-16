
import Layout from "@/components/Layout";
import OutfitCard from "@/components/OutfitCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Plus, RefreshCw } from "lucide-react";

const Inspiratie = () => {
  // Mock outfits for inspiration
  const inspirationItems = [
    { id: 1, src: "/placeholder.svg", alt: "Red coat outfit" },
    { id: 2, src: "/placeholder.svg", alt: "Beige coat outfit" },
    { id: 3, src: "/placeholder.svg", alt: "Brown blazer outfit" },
    { id: 4, src: "/placeholder.svg", alt: "Pleated skirt outfit" },
    { id: 5, src: "/placeholder.svg", alt: "Gray blazer outfit" },
    { id: 6, src: "/placeholder.svg", alt: "Black outfit" },
    { id: 7, src: "/placeholder.svg", alt: "White outfit" },
    { id: 8, src: "/placeholder.svg", alt: "Blue outfit" },
  ];
  
  const categories = [
    { name: "Office", count: 12 },
    { name: "Casual", count: 16 },
    { name: "Evening", count: 8 },
    { name: "Sport", count: 5 },
  ];

  return (
    <Layout>
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-wardrobe-blue p-3 rounded-full">
          <Palette size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Inspirație</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {categories.map((category, idx) => (
          <Card key={idx} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center py-6">
              <h3 className="text-lg font-bold">{category.name}</h3>
              <p className="text-gray-500">{category.count} ținute</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ținute recomandate</h2>
          <Button variant="outline" size="sm">
            <Plus size={16} className="mr-1" />
            <span>Adaugă</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {inspirationItems.slice(0, 4).map(item => (
            <OutfitCard key={item.id} imageSrc={item.src} alt={item.alt} />
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Inspirație recentă</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {inspirationItems.slice(4, 8).map(item => (
            <OutfitCard key={item.id} imageSrc={item.src} alt={item.alt} />
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-8 gap-4">
        <Button variant="outline" className="rounded-full h-12 w-12 p-0">
          <RefreshCw size={18} />
        </Button>
        <Button className="rounded-full h-12 w-12 p-0 bg-wardrobe-blue hover:bg-wardrobe-blue/90">
          <Plus size={18} />
        </Button>
      </div>
    </Layout>
  );
};

export default Inspiratie;
