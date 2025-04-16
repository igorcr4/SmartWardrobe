
import Layout from "@/components/Layout";
import WeatherOutfit from "@/components/WeatherOutfit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

const Recomandari = () => {
  // Weather outfit items
  const weatherOutfits = [
    { image: "/placeholder.svg", alt: "Coat" },
    { image: "/placeholder.svg", alt: "Boots" },
  ];
  
  const occasionOutfits = [
    {
      title: "Office",
      items: [
        { image: "/placeholder.svg", alt: "Blazer" },
        { image: "/placeholder.svg", alt: "Trousers" },
      ]
    },
    {
      title: "Casual",
      items: [
        { image: "/placeholder.svg", alt: "Sweater" },
        { image: "/placeholder.svg", alt: "Jeans" },
      ]
    },
    {
      title: "Evening",
      items: [
        { image: "/placeholder.svg", alt: "Dress" },
        { image: "/placeholder.svg", alt: "Heels" },
      ]
    }
  ];

  return (
    <Layout>
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-wardrobe-blue p-3 rounded-full">
          <User size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Recomandări personalizate</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recomandare pentru astăzi</CardTitle>
          </CardHeader>
          <CardContent>
            <WeatherOutfit 
              temperature={15} 
              condition="Ploaie" 
              outfits={weatherOutfits} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top ținute purtate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-md shadow-sm p-2">
                  <img src="/placeholder.svg" alt={`Top outfit ${i}`} className="h-32 w-full object-cover" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold mt-8 mb-4">Recomandări pentru ocazii</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {occasionOutfits.map((occasion, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{occasion.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {occasion.items.map((item, i) => (
                  <div key={i} className="bg-white p-2 rounded-md shadow-sm flex-1">
                    <img src={item.image} alt={item.alt} className="h-24 object-contain mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Recomandari;
