import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId, name, email, role) {
  console.log('Generating token for:', jwt.sign(
    { userId, name, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  ));
  return jwt.sign(
    { userId, name, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyTokenAndUser(token) {

  try {
    const decoded = jwt.verify(token,JWT_SECRET);
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch {
    return null;
  }

}

export function getUserFromRequest(request) {
  const authHeader = request.cookies.get("token")?.value;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token);
}