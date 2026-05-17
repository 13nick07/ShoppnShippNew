'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  Package,
  MapPin,
  Truck,
  Calculator,
  Loader2,
  Copy,
  CheckCircle,
  Clock,
  Box,
} from 'lucide-react';


export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [packages, setPackages] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [countries, setCountries] = useState([]);
  const [calcLoading, setCalcLoading] = useState(false);
  const [shippingRates, setShippingRates] = useState([]);
  const [bookingType, setBookingType] = useState("LOCKER");
  const [deletingId, setDeletingId] = useState(null); // placeholder, unused without backend

  const [warehouses, setWarehouses] = useState([]);
  const [virtualAddressCount, setVirtualAddressCount] = useState(0);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  const [calculator, setCalculator] = useState({
    from: '',
    to: '',
    weight: '1',
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) { router.push('/login'); return; }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  useEffect(() => {
    setVirtualAddressCount(addresses.length);
  }, [addresses]);

  const loadDashboardData = async () => {
    try {
      const [addressesRes, packagesRes, shipmentsRes, countriesRes, warehousesRes] =
        await Promise.all([
          fetch('/api/addresses', { method: "GET", credentials: "include" }),
          fetch('/api/packages'),
          fetch('/api/shipments'),
          fetch('/api/countries'),
          fetch('/api/warehouses'),
        ]);

      const [addressesData, packagesData, shipmentsData, countriesData, warehousesData] =
        await Promise.all([
          addressesRes.json(),
          packagesRes.json(),
          shipmentsRes.json(),
          countriesRes.json(),
          warehousesRes.json(),
        ]);

      setAddresses(addressesData.data || []);
      setPackages(packagesData.packages || []);
      setShipments(shipmentsData.shipments || []);
      setCountries(countriesData.data || []);
      setWarehouses(warehousesData.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({ title: 'Error', description: 'Failed to load dashboard data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const selectedCountryData = countries.find((c) => c.code === selectedCountry);

  const filteredWarehouses = warehouses.filter(
    (w) => w.countryCode === selectedCountry && w.city === selectedCity
  );

  const handleCreateVirtualAddress = async () => {
    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warehouseId: selectedWarehouse, bookingType }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast({ title: "Success", description: "Virtual address created successfully" });
      loadDashboardData(user);
      setSelectedCountry("");
      setSelectedCity("");
      setSelectedWarehouse("");
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const calculateShipping = async () => {
    if (!calculator.from || !calculator.to || !calculator.weight) {
      toast({ title: 'Missing information', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setCalcLoading(true);
    try {
      const response = await fetch(
        `/api/shipping/calculate?from=${calculator.from}&to=${calculator.to}&weight=${calculator.weight}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setShippingRates(data.rates || []);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setCalcLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Address copied to clipboard' });
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setDeletingId(addressId);

      const response = await fetch("/api/addresses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addressId,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete address");
      }

      // Remove from UI
      setAddresses((prev) =>
        prev.filter((a) => String(a._id) !== String(addressId))
      );

      toast({
        title: "Success",
        description: "Virtual address deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return 'bg-blue-500';
      case 'in_storage': return 'bg-yellow-500';
      case 'ready_to_ship': return 'bg-purple-500';
      case 'shipped': return 'bg-orange-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Manage your global shipping operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Virtual Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div className="text-3xl font-bold" initial={{ count: 0 }} animate={{ count: virtualAddressCount }} transition={{ duration: 0.5 }}>
              {virtualAddressCount}
            </motion.div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{packages.filter(p => p.status !== 'delivered').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{shipments.filter(s => s.status === 'shipped').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="text-base">{user?.membershipPlan || 'Free'}</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="addresses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        {/* Addresses Tab */}
        <TabsContent value="addresses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 items-end">

            {/* Country */}
            <div className="space-y-2">
              <Label>Country</Label>
              <Select value={selectedCountry} onValueChange={(val) => { setSelectedCountry(val); setSelectedCity(""); setSelectedWarehouse(""); }}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>{country.flag} {country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label>City</Label>
              <Select value={selectedCity} onValueChange={(val) => { setSelectedCity(val); setSelectedWarehouse(""); }} disabled={!selectedCountry}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>
                  {selectedCountryData?.cities?.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Warehouse */}
            <div className="space-y-2">
              <Label>Warehouse</Label>
              <Select value={selectedWarehouse} onValueChange={(val) => setSelectedWarehouse(val)} disabled={!selectedCity}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                <SelectContent>
                  {filteredWarehouses.length > 0 ? (
                    filteredWarehouses.map((warehouse) => (
                      <SelectItem key={warehouse._id} value={warehouse._id}>{warehouse.name}</SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No warehouses found</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Storage Type */}
            <div className="space-y-2">
              <Label>Storage Type</Label>
              <RadioGroup value={bookingType} onValueChange={(val) => setBookingType(val)} className="flex flex-col gap-3">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem value="LOCKER" id="locker" />
                      <Label htmlFor="locker">Locker</Label>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="space-y-2">
                      <img src="/images/locker.svg" alt="Locker" className="rounded-md border" />
                      <p className="text-sm font-medium">Locker Dimensions</p>
                      <p className="text-xs text-muted-foreground">40cm × 40cm × 60cm</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <RadioGroupItem value="SHELF" id="shelf" />
                      <Label htmlFor="shelf">Shelf</Label>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="space-y-2">
                      <img src="/images/shelf.svg" alt="Shelf" className="rounded-md border" />
                      <p className="text-sm font-medium">Shelf Dimensions</p>
                      <p className="text-xs text-muted-foreground">120cm × 80cm × 200cm</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </RadioGroup>
            </div>

            {/* Button */}
            <div className="space-y-2">
              <Button className="w-full" onClick={handleCreateVirtualAddress} disabled={!selectedWarehouse || !bookingType}>
                Get Virtual Address
              </Button>
            </div>
          </div>

          {/* Address List */}
          <Card>
            <CardHeader>
              <CardTitle>Virtual Addresses</CardTitle>
              <CardDescription>Your international shipping addresses</CardDescription>
            </CardHeader>
            <CardContent>
              {addresses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No addresses yet. One will be created automatically!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <Card key={address._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge>{address.warehouse?.country || 'N/A'}</Badge>
                              <span className="text-sm text-muted-foreground">
                                Code: {address.userCode}
                              </span>
                            </div>
                            <p className="font-mono text-sm">{address.addressLine}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.warehouse?.city}, {address.warehouse?.country}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {/* Copy */}
                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(address.addressLine)}>
                              <Copy className="h-4 w-4" />
                            </Button>

                            {/* X — remove from UI only */}
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={deletingId === address._id}
                              className="h-9 w-9 p-0 rounded-full text-gray-500 text-lg font-bold hover:text-destructive hover:bg-destructive/10 transition-colors"
                              onClick={() => handleDeleteAddress(address._id)}
                            >
                              {deletingId === address._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "✕"
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Packages</CardTitle>
              <CardDescription>Track your incoming packages</CardDescription>
            </CardHeader>
            <CardContent>
              {packages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No packages yet. Start shopping!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {packages.map((pkg) => (
                    <Card key={pkg.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(pkg.status)}>
                                {pkg.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <span className="text-sm font-mono">{pkg.trackingNumber}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Weight: {pkg.weight}kg | Value: ${pkg.value}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Arrived: {new Date(pkg.arrivalDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipments Tab */}
        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Shipments</CardTitle>
              <CardDescription>Track your international shipments</CardDescription>
            </CardHeader>
            <CardContent>
              {shipments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Truck className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No shipments yet. Create one to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shipments.map((shipment) => (
                    <Card key={shipment.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge>{shipment.carrier}</Badge>
                              <span className="text-sm font-mono">{shipment.trackingNumber}</span>
                            </div>
                            <p className="text-sm">{shipment.fromCountry} → {shipment.toCountry}</p>
                            <p className="text-sm text-muted-foreground">
                              Weight: {shipment.weight}kg | Cost: ${shipment.cost}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Est. Delivery: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status.toUpperCase()}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Calculator</CardTitle>
              <CardDescription>Calculate shipping costs for any route</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>From Country</Label>
                  <Select value={calculator.from} onValueChange={(val) => setCalculator({ ...calculator, from: val })}>
                    <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>{country.flag} {country.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>To Country</Label>
                  <Select value={calculator.to} onValueChange={(val) => setCalculator({ ...calculator, to: val })}>
                    <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>{country.flag} {country.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" step="0.1" min="0.1" value={calculator.weight} onChange={(e) => setCalculator({ ...calculator, weight: e.target.value })} />
                </div>
              </div>

              <Button onClick={calculateShipping} disabled={calcLoading} className="w-full">
                {calcLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Calculating...</>
                ) : (
                  <><Calculator className="mr-2 h-4 w-4" />Calculate Rates</>
                )}
              </Button>

              {shippingRates.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold">Available Rates:</h3>
                  {shippingRates.map((rate, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{rate.carrier}</p>
                            <p className="text-sm text-muted-foreground">Estimated: {rate.estimatedDays} days</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${rate.cost}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
