import { getCollection } from './mongodb';

export async function seedDatabase() {
  try {
    // Seed Countries
    const countriesCol = await getCollection('countries');
    const countriesCount = await countriesCol.countDocuments();
    
    if (countriesCount === 0) {
      await countriesCol.insertMany([
        { name: 'United States', code: 'US', flag: '🇺🇸', isActive: true },
        { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', isActive: true },
        { name: 'India', code: 'IN', flag: '🇮🇳', isActive: true },
        { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', isActive: true },
        { name: 'China', code: 'CN', flag: '🇨🇳', isActive: true },
        { name: 'Germany', code: 'DE', flag: '🇩🇪', isActive: true },
        { name: 'Japan', code: 'JP', flag: '🇯🇵', isActive: true },
      ]);
      console.log('✅ Countries seeded');
    }

    // Seed Warehouses
    const warehousesCol = await getCollection('warehouses');
    const warehousesCount = await warehousesCol.countDocuments();
    
    if (warehousesCount === 0) {
      await warehousesCol.insertMany([
        { country: 'US', city: 'New York', address: '1234 Broadway, NY 10001', code: 'US-NY-001', isActive: true },
        { country: 'GB', city: 'London', address: '56 Oxford Street, London W1D 1BS', code: 'GB-LDN-001', isActive: true },
        { country: 'IN', city: 'Mumbai', address: 'Andheri East, Mumbai 400069', code: 'IN-MUM-001', isActive: true },
        { country: 'AE', city: 'Dubai', address: 'Dubai Silicon Oasis, Dubai', code: 'AE-DXB-001', isActive: true },
        { country: 'CN', city: 'Shanghai', address: 'Pudong New Area, Shanghai', code: 'CN-SHA-001', isActive: true },
        { country: 'DE', city: 'Berlin', address: 'Alexanderplatz, Berlin 10178', code: 'DE-BER-001', isActive: true },
        { country: 'JP', city: 'Tokyo', address: 'Shibuya, Tokyo 150-0002', code: 'JP-TKY-001', isActive: true },
      ]);
      console.log('✅ Warehouses seeded');
    }

    // Seed Shipping Rates
    const ratesCol = await getCollection('shippingRates');
    const ratesCount = await ratesCol.countDocuments();
    
    if (ratesCount === 0) {
      const carriers = ['DHL', 'FedEx', 'UPS', 'Aramex'];
      const countries = ['US', 'GB', 'IN', 'AE', 'CN', 'DE', 'JP'];
      const rates = [];
      
      for (const from of countries) {
        for (const to of countries) {
          if (from !== to) {
            for (const carrier of carriers) {
              rates.push({
                fromCountry: from,
                toCountry: to,
                carrier: carrier,
                baseRate: Math.floor(Math.random() * 20) + 10,
                perKgRate: Math.floor(Math.random() * 10) + 5,
                estimatedDays: Math.floor(Math.random() * 7) + 3,
              });
            }
          }
        }
      }
      
      await ratesCol.insertMany(rates);
      console.log('✅ Shipping rates seeded');
    }

    // Seed Membership Plans
    const plansCol = await getCollection('membershipPlans');
    const plansCount = await plansCol.countDocuments();
    
    if (plansCount === 0) {
      await plansCol.insertMany([
        {
          name: 'Free',
          price: 0,
          features: ['1 virtual address', '30 days storage', 'Standard support'],
          storageLimit: 30,
          consolidationFree: false,
        },
        {
          name: 'Basic',
          price: 9.99,
          features: ['3 virtual addresses', '60 days storage', 'Priority support', '1 free consolidation/month'],
          storageLimit: 60,
          consolidationFree: true,
        },
        {
          name: 'Pro',
          price: 29.99,
          features: ['7 virtual addresses', '90 days storage', '24/7 support', 'Unlimited consolidations', 'Package photos'],
          storageLimit: 90,
          consolidationFree: true,
        },
        {
          name: 'Business',
          price: 99.99,
          features: ['Unlimited addresses', '180 days storage', 'Dedicated support', 'Unlimited consolidations', 'API access', 'Bulk shipping'],
          storageLimit: 180,
          consolidationFree: true,
        },
      ]);
      console.log('✅ Membership plans seeded');
    }

    console.log('🎉 Database seeded successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Seed error:', error);
    return { success: false, error: error.message };
  }
}