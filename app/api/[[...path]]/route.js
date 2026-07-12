import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { hashPassword, comparePassword, generateToken, getUserFromRequest } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';
import { v4 as uuidv4 } from 'uuid';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper to create response with CORS
function jsonResponse(data, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// Main GET handler
export async function GET(request, { params }) {
  const path = params.path ? params.path.join('/') : '';
  const { searchParams } = new URL(request.url);

  try {
    // Auth routes
    if (path === 'auth/me') {
      const user = getUserFromRequest(request);
      if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const usersCol = await getCollection('users');
      const userData = await usersCol.findOne(
        { id: user.userId },
        { projection: { password: 0 } }
      );

      if (!userData) {
        return jsonResponse({ error: 'User not found' }, 404);
      }

      return jsonResponse({ user: userData });
    }

    // Seed database
    if (path === 'seed') {
      const result = await seedDatabase();
      return jsonResponse(result);
    }

    // Countries
    if (path === 'countries') {
      const countriesCol = await getCollection('countries');
      const countries = await countriesCol.find({ isActive: true }).toArray();
      return jsonResponse({ countries });
    }

    // Virtual Addresses (Protected)
    if (path === 'addresses') {
      const user = getUserFromRequest(request);
      if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const addressesCol = await getCollection('virtualAddresses');
      const addresses = await addressesCol.find({ userId: user.userId }).toArray();

      const warehousesCol = await getCollection('warehouses');
      const addressesWithDetails = await Promise.all(
        addresses.map(async (addr) => {
          const warehouse = await warehousesCol.findOne({ code: addr.warehouseCode });
          return { ...addr, warehouse };
        })
      );

      return jsonResponse({ addresses: addressesWithDetails });
    }

    // Packages (Protected)
    if (path === 'packages') {
      const user = getUserFromRequest(request);
      if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const packagesCol = await getCollection('packages');
      const packages = await packagesCol.find({ userId: user.userId }).sort({ arrivalDate: -1 }).toArray();

      return jsonResponse({ packages });
    }

    // Shipments (Protected)
    if (path === 'shipments') {
      const user = getUserFromRequest(request);
      if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const shipmentsCol = await getCollection('shipments');
      const shipments = await shipmentsCol.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

      return jsonResponse({ shipments });
    }

    // Shipping Calculator
    if (path === 'shipping/calculate') {
      const fromCountry = searchParams.get('from');
      const toCountry = searchParams.get('to');
      const weight = parseFloat(searchParams.get('weight') || '1');

      if (!fromCountry || !toCountry) {
        return jsonResponse({ error: 'Missing parameters' }, 400);
      }

      const ratesCol = await getCollection('shippingRates');
      const rates = await ratesCol.find({
        fromCountry,
        toCountry,
      }).toArray();

      const calculations = rates.map(rate => ({
        carrier: rate.carrier,
        cost: Math.round((rate.baseRate + (rate.perKgRate * weight)) * 100) / 100,
        estimatedDays: rate.estimatedDays,
      }));

      return jsonResponse({ rates: calculations });
    }

    // Membership Plans
    if (path === 'membership-plans') {
      const plansCol = await getCollection('membershipPlans');
      const plans = await plansCol.find({}).toArray();
      return jsonResponse({ plans });
    }

    // Admin: Dashboard Stats
    if (path === 'admin/dashboard') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const usersCol = await getCollection('users');
      const packagesCol = await getCollection('packages');
      const shipmentsCol = await getCollection('shipments');
      const paymentsCol = await getCollection('payments');

      const totalUsers = await usersCol.countDocuments();
      const totalPackages = await packagesCol.countDocuments();
      const totalShipments = await shipmentsCol.countDocuments();
      const totalRevenue = await paymentsCol.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray();

      return jsonResponse({
        stats: {
          totalUsers,
          totalPackages,
          totalShipments,
          totalRevenue: totalRevenue[0]?.total || 0,
        }
      });
    }

    // Admin: Users List
    if (path === 'admin/users') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const usersCol = await getCollection('users');
      const users = await usersCol.find({}, { projection: { password: 0 } }).toArray();

      return jsonResponse({ users });
    }

    // Admin: Packages List
    if (path === 'admin/packages') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const packagesCol = await getCollection('packages');
      const packages = await packagesCol.find({}).sort({ arrivalDate: -1 }).toArray();

      return jsonResponse({ packages });
    }

    // Admin: Warehouses List
    if (path === 'admin/warehouses') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const warehousesCol = await getCollection('warehouses');
      const warehouses = await warehousesCol.find({}).toArray();

      return jsonResponse({ warehouses });
    }

    // Admin: Shipments List
    if (path === 'admin/shipments') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const shipmentsCol = await getCollection('shipments');
      const shipments = await shipmentsCol.find({}).sort({ createdAt: -1 }).toArray();

      return jsonResponse({ shipments });
    }

    return jsonResponse({ error: 'Route not found' }, 404);
  } catch (error) {
    console.error('GET Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// Main POST handler
export async function POST(request, { params }) {
  const path = params.path ? params.path.join('/') : '';

  try {
    const body = await request.json();

    // Auth: Register
    if (path === 'auth/register') {
      const { email, password, name } = body;

      if (!email || !password || !name) {
        return jsonResponse({ error: 'Missing required fields' }, 400);
      }

      const usersCol = await getCollection('users');
      const existingUser = await usersCol.findOne({ email });

      if (existingUser) {
        return jsonResponse({ error: 'Email already registered' }, 400);
      }

      const hashedPassword = await hashPassword(password);
      const userId = uuidv4();

      const newUser = {
        id: userId,
        email,
        password: hashedPassword,
        name,
        role: 'user',
        membershipPlan: 'Free',
        createdAt: new Date(),
      };

      await usersCol.insertOne(newUser);

      // Create virtual address for the user
      const warehousesCol = await getCollection('warehouses');
      const usWarehouse = await warehousesCol.findOne({ country: 'US' });

      if (usWarehouse) {
        const addressesCol = await getCollection('virtualAddresses');
        await addressesCol.insertOne({
          id: uuidv4(),
          userId: userId,
          warehouseCode: usWarehouse.code,
          addressLine: `${usWarehouse.address}, Suite ${Math.floor(Math.random() * 9000) + 1000}`,
          userCode: userId.substring(0, 8).toUpperCase(),
          createdAt: new Date(),
        });
      }

      const token = generateToken(userId, name, email, 'user');

      const response = jsonResponse({
        user: {
          id: userId,
          email,
          name,
          role: "user",
          membershipPlan: "Free",
        }
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24
      });

      return response;
    }

    // Auth: Login
    if (path === 'auth/login') {
      const { email, password } = body;

      if (!email || !password) {
        return jsonResponse({ error: 'Missing credentials' }, 400);
      }

      const usersCol = await getCollection('users');
      const user = await usersCol.findOne({ email });

      if (!user) {
        return jsonResponse({ error: 'Invalid credentials' }, 401);
      }

      const isValid = await comparePassword(password, user.password);

      if (!isValid) {
        return jsonResponse({ error: 'Invalid credentials' }, 401);
      }

      const token = generateToken(user.id, user.name, user.email, user.role);

      const response = jsonResponse({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          membershipPlan: user.membershipPlan,
        }
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;
    }

    // Logout
    if (path === "auth/logout") {
      console.log("In logout");
      const response = NextResponse.json({ message: "Logged out" });

      response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/"
      });

      return response;
    }

    // Create Virtual Address
    if (path === 'addresses') {
      const user = getUserFromRequest(request);
      if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const { warehouseCode } = body;

      if (!warehouseCode) {
        return jsonResponse({ error: 'Warehouse code required' }, 400);
      }

      const addressesCol = await getCollection('virtualAddresses');
      const existingAddress = await addressesCol.findOne({ userId: user.userId });

      if (existingAddress) {
        return jsonResponse({ error: 'You can only have one virtual address. Remove your current address before creating another.' }, 409);
      }

      const warehousesCol = await getCollection('warehouses');
      const warehouse = await warehousesCol.findOne({ code: warehouseCode });

      if (!warehouse) {
        return jsonResponse({ error: 'Warehouse not found' }, 404);
      }

      const newAddress = {
        id: uuidv4(),
        userId: user.userId,
        warehouseCode,
        addressLine: `${warehouse.address}, Suite ${Math.floor(Math.random() * 9000) + 1000}`,
        userCode: user.userId.substring(0, 8).toUpperCase(),
        createdAt: new Date(),
      };

      await addressesCol.insertOne(newAddress);

      return jsonResponse({ address: newAddress });
    }

    // Create Shipment
    if (path === 'shipments') {
      const user = getUserFromRequest(request);
      if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const { packageIds, fromCountry, toCountry, carrier, toAddress } = body;

      if (!packageIds || !fromCountry || !toCountry || !carrier) {
        return jsonResponse({ error: 'Missing required fields' }, 400);
      }

      const packagesCol = await getCollection('packages');
      const packages = await packagesCol.find({
        id: { $in: packageIds },
        userId: user.userId,
      }).toArray();

      if (packages.length === 0) {
        return jsonResponse({ error: 'No valid packages found' }, 404);
      }

      const totalWeight = packages.reduce((sum, pkg) => sum + (pkg.weight || 0), 0);

      // Calculate cost
      const ratesCol = await getCollection('shippingRates');
      const rate = await ratesCol.findOne({ fromCountry, toCountry, carrier });

      if (!rate) {
        return jsonResponse({ error: 'Shipping rate not found' }, 404);
      }

      const cost = Math.round((rate.baseRate + (rate.perKgRate * totalWeight)) * 100) / 100;

      const shipmentId = uuidv4();
      const shipment = {
        id: shipmentId,
        userId: user.userId,
        packageIds,
        fromCountry,
        toCountry,
        carrier,
        weight: totalWeight,
        cost,
        status: 'pending',
        trackingNumber: `SHPN${Date.now()}${Math.floor(Math.random() * 1000)}`,
        toAddress: toAddress || '',
        estimatedDelivery: new Date(Date.now() + rate.estimatedDays * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      };

      const shipmentsCol = await getCollection('shipments');
      await shipmentsCol.insertOne(shipment);

      // Update package statuses
      await packagesCol.updateMany(
        { id: { $in: packageIds } },
        { $set: { status: 'shipped', shipmentId } }
      );

      return jsonResponse({ shipment });
    }

    // Create Payment
    if (path === 'payments') {
      const user = getUserFromRequest(request);
      if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const { amount, type, reference } = body;

      if (!amount || !type) {
        return jsonResponse({ error: 'Missing required fields' }, 400);
      }

      const payment = {
        id: uuidv4(),
        userId: user.userId,
        amount,
        type,
        reference: reference || '',
        status: 'completed', // Mock payment
        stripePaymentId: `mock_${Date.now()}`,
        createdAt: new Date(),
      };

      const paymentsCol = await getCollection('payments');
      await paymentsCol.insertOne(payment);

      // If membership payment, update user
      if (type === 'membership') {
        const usersCol = await getCollection('users');
        await usersCol.updateOne(
          { id: user.userId },
          { $set: { membershipPlan: reference } }
        );
      }

      return jsonResponse({ payment });
    }

    // Admin: Create Package
    if (path === 'admin/packages') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const { userId, warehouseCode, trackingNumber, weight, dimensions, value } = body;

      const package_ = {
        id: uuidv4(),
        userId,
        warehouseCode,
        trackingNumber: trackingNumber || `PKG${Date.now()}`,
        status: 'received',
        weight: weight || 0,
        dimensions: dimensions || '',
        value: value || 0,
        arrivalDate: new Date(),
        createdAt: new Date(),
      };

      const packagesCol = await getCollection('packages');
      await packagesCol.insertOne(package_);

      return jsonResponse({ package: package_ });
    }

    // Admin: Create Warehouse
    if (path === 'admin/warehouses') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const { country, city, address, code } = body;

      const warehouse = {
        id: uuidv4(),
        country,
        city,
        address,
        code,
        isActive: true,
        createdAt: new Date(),
      };

      const warehousesCol = await getCollection('warehouses');
      await warehousesCol.insertOne(warehouse);

      return jsonResponse({ warehouse });
    }

    return jsonResponse({ error: 'Route not found' }, 404);
  } catch (error) {
    console.error('POST Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// Main PUT handler
export async function PUT(request, { params }) {
  const path = params.path ? params.path.join('/') : '';

  try {
    const body = await request.json();
    const user = getUserFromRequest(request);

    // Admin: Update Package
    if (path.startsWith('admin/packages/')) {
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const packageId = path.split('/').pop();
      const { status, trackingNumber, weight } = body;

      const packagesCol = await getCollection('packages');
      const updateData = {};

      if (status) updateData.status = status;
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      if (weight !== undefined) updateData.weight = weight;

      await packagesCol.updateOne(
        { id: packageId },
        { $set: updateData }
      );

      const updatedPackage = await packagesCol.findOne({ id: packageId });

      return jsonResponse({ package: updatedPackage });
    }

    // Admin: Update Shipment
    if (path.startsWith('admin/shipments/')) {
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const shipmentId = path.split('/').pop();
      const { status, trackingNumber } = body;

      const shipmentsCol = await getCollection('shipments');
      const updateData = {};

      if (status) updateData.status = status;
      if (trackingNumber) updateData.trackingNumber = trackingNumber;

      await shipmentsCol.updateOne(
        { id: shipmentId },
        { $set: updateData }
      );

      const updatedShipment = await shipmentsCol.findOne({ id: shipmentId });

      return jsonResponse({ shipment: updatedShipment });
    }

    // Admin: Update User
    if (path.startsWith('admin/users/')) {
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const userId = path.split('/').pop();
      const { role, membershipPlan } = body;

      const usersCol = await getCollection('users');
      const updateData = {};

      if (role) updateData.role = role;
      if (membershipPlan) updateData.membershipPlan = membershipPlan;

      await usersCol.updateOne(
        { id: userId },
        { $set: updateData }
      );

      const updatedUser = await usersCol.findOne(
        { id: userId },
        { projection: { password: 0 } }
      );

      return jsonResponse({ user: updatedUser });
    }

    return jsonResponse({ error: 'Route not found' }, 404);
  } catch (error) {
    console.error('PUT Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

// Main DELETE handler
export async function DELETE(request, { params }) {
  const path = params.path ? params.path.join('/') : '';

  try {
    const user = getUserFromRequest(request);

    // Delete a user's virtual address
    if (path.startsWith('addresses/')) {
      if (!user) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const addressId = path.split('/').pop();
      const addressesCol = await getCollection('virtualAddresses');
      const result = await addressesCol.deleteOne({ id: addressId, userId: user.userId });

      if (result.deletedCount === 0) {
        return jsonResponse({ error: 'Address not found' }, 404);
      }

      return jsonResponse({ success: true });
    }

    // Admin: Delete Package
    if (path.startsWith('admin/packages/')) {
      if (!user || user.role !== 'admin') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      const packageId = path.split('/').pop();
      const packagesCol = await getCollection('packages');

      await packagesCol.deleteOne({ id: packageId });

      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Route not found' }, 404);
  } catch (error) {
    console.error('DELETE Error:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}
