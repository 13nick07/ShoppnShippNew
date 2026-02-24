'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Package,
  Truck,
  Warehouse,
  DollarSign,
  Loader2,
  Plus,
  Edit,
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [newPackage, setNewPackage] = useState({
    userId: '',
    warehouseCode: '',
    trackingNumber: '',
    weight: '1',
    value: '100',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);
    loadAdminData(token);
  }, []);

  const loadAdminData = async (token) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, usersRes, packagesRes, shipmentsRes, warehousesRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/packages', { headers }),
        fetch('/api/admin/shipments', { headers }),
        fetch('/api/admin/warehouses', { headers }),
      ]);

      const [statsData, usersData, packagesData, shipmentsData, warehousesData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        packagesRes.json(),
        shipmentsRes.json(),
        warehousesRes.json(),
      ]);

      setStats(statsData.stats || {});
      setUsers(usersData.users || []);
      setPackages(packagesData.packages || []);
      setShipments(shipmentsData.shipments || []);
      setWarehouses(warehousesData.warehouses || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePackageStatus = async (packageId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update');

      toast({
        title: 'Success',
        description: 'Package status updated',
      });

      loadAdminData(token);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateShipmentStatus = async (shipmentId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/shipments/${shipmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update');

      toast({
        title: 'Success',
        description: 'Shipment status updated',
      });

      loadAdminData(token);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const createPackage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPackage),
      });

      if (!response.ok) throw new Error('Failed to create package');

      toast({
        title: 'Success',
        description: 'Package created successfully',
      });

      setIsAddPackageOpen(false);
      setNewPackage({
        userId: '',
        warehouseCode: '',
        trackingNumber: '',
        weight: '1',
        value: '100',
      });
      loadAdminData(token);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
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
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage platform operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPackages || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Total Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalShipments || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${stats.totalRevenue || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="packages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
        </TabsList>

        {/* Packages Tab */}
        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Packages Management</CardTitle>
                  <CardDescription>Manage all packages in the system</CardDescription>
                </div>
                <Dialog open={isAddPackageOpen} onOpenChange={setIsAddPackageOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Package
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Package</DialogTitle>
                      <DialogDescription>Create a new package entry</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>User ID</Label>
                        <Input
                          value={newPackage.userId}
                          onChange={(e) => setNewPackage({...newPackage, userId: e.target.value})}
                          placeholder="Enter user ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Warehouse Code</Label>
                        <Select value={newPackage.warehouseCode} onValueChange={(val) => setNewPackage({...newPackage, warehouseCode: val})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select warehouse" />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouses.map((wh) => (
                              <SelectItem key={wh.code} value={wh.code}>
                                {wh.code} - {wh.city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Tracking Number</Label>
                        <Input
                          value={newPackage.trackingNumber}
                          onChange={(e) => setNewPackage({...newPackage, trackingNumber: e.target.value})}
                          placeholder="Auto-generated if empty"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Weight (kg)</Label>
                        <Input
                          type="number"
                          value={newPackage.weight}
                          onChange={(e) => setNewPackage({...newPackage, weight: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Value ($)</Label>
                        <Input
                          type="number"
                          value={newPackage.value}
                          onChange={(e) => setNewPackage({...newPackage, value: e.target.value})}
                        />
                      </div>
                      <Button onClick={createPackage} className="w-full">Create Package</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-mono text-xs">{pkg.trackingNumber}</TableCell>
                      <TableCell className="font-mono text-xs">{pkg.userId.substring(0, 8)}...</TableCell>
                      <TableCell>{pkg.warehouseCode}</TableCell>
                      <TableCell>{pkg.weight}kg</TableCell>
                      <TableCell>
                        <Badge>{pkg.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={pkg.status}
                          onValueChange={(val) => updatePackageStatus(pkg.id, val)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="received">Received</SelectItem>
                            <SelectItem value="in_storage">In Storage</SelectItem>
                            <SelectItem value="ready_to_ship">Ready to Ship</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipments Tab */}
        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Shipments Management</CardTitle>
              <CardDescription>Manage all shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-mono text-xs">{shipment.trackingNumber}</TableCell>
                      <TableCell>{shipment.fromCountry} → {shipment.toCountry}</TableCell>
                      <TableCell>{shipment.carrier}</TableCell>
                      <TableCell>{shipment.weight}kg</TableCell>
                      <TableCell>${shipment.cost}</TableCell>
                      <TableCell>
                        <Badge>{shipment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={shipment.status}
                          onValueChange={(val) => updateShipmentStatus(shipment.id, val)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>Manage all users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Membership</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.membershipPlan}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warehouses Tab */}
        <TabsContent value="warehouses">
          <Card>
            <CardHeader>
              <CardTitle>Warehouses</CardTitle>
              <CardDescription>Manage warehouse locations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {warehouses.map((warehouse) => (
                    <TableRow key={warehouse.code}>
                      <TableCell className="font-mono">{warehouse.code}</TableCell>
                      <TableCell>{warehouse.country}</TableCell>
                      <TableCell>{warehouse.city}</TableCell>
                      <TableCell>{warehouse.address}</TableCell>
                      <TableCell>
                        <Badge variant={warehouse.isActive ? 'default' : 'secondary'}>
                          {warehouse.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
