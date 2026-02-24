'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CountriesPage() {
  const countries = [
    {
      name: 'United States',
      flag: '🇺🇸',
      code: 'US',
      cities: ['New York', 'Los Angeles', 'Miami'],
      description: 'Access to all major US retailers and e-commerce platforms',
    },
    {
      name: 'United Kingdom',
      flag: '🇬🇧',
      code: 'GB',
      cities: ['London', 'Manchester'],
      description: 'Shop from UK stores and European brands',
    },
    {
      name: 'India',
      flag: '🇮🇳',
      code: 'IN',
      cities: ['Mumbai', 'Delhi', 'Bangalore'],
      description: 'Connect with Indian markets and exporters',
    },
    {
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      code: 'AE',
      cities: ['Dubai', 'Abu Dhabi'],
      description: 'Middle Eastern hub for global commerce',
    },
    {
      name: 'China',
      flag: '🇨🇳',
      code: 'CN',
      cities: ['Shanghai', 'Beijing', 'Shenzhen'],
      description: 'Direct access to Chinese manufacturers and suppliers',
    },
    {
      name: 'Germany',
      flag: '🇩🇪',
      code: 'DE',
      cities: ['Berlin', 'Munich', 'Hamburg'],
      description: 'European quality brands and manufacturers',
    },
    {
      name: 'Japan',
      flag: '🇯🇵',
      code: 'JP',
      cities: ['Tokyo', 'Osaka'],
      description: 'Access to Japanese electronics and fashion',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Ship From & To 7+ Countries</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get virtual addresses in multiple countries and ship anywhere in the world
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-6xl mb-4 text-center">{country.flag}</div>
              <h3 className="text-2xl font-bold mb-2 text-center">{country.name}</h3>
              <div className="flex justify-center gap-2 mb-4">
                {country.cities.map((city, idx) => (
                  <Badge key={idx} variant="secondary">{city}</Badge>
                ))}
              </div>
              <p className="text-muted-foreground text-center text-sm">
                {country.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center bg-muted/30 rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">More Countries Coming Soon</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're constantly expanding our network. Request a new country and we'll prioritize it!
        </p>
      </div>
    </div>
  );
}
