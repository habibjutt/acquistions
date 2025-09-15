import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Error comparing password:', error);
    throw new Error('Failed to compare password');
  }
};

export const authenticateUser = async (email, password) => {
  try {
    console.log('Authenticating user with email:', email);
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    logger.info(`User ${user.email} authenticated successfully`);
    // Return user without password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    logger.error('Error authenticating user:', error);
    throw error; // Re-throw to preserve the original error message
  }
};

export const createUser = async (name, email, password, role = 'user') => {
  try {
    console.log('Creating user with email:', email);
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    console.log('existingUser:', existingUser.length);
    if (existingUser.length > 0) throw new Error('Username already exists');

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });
    logger.info(`New user created: ${newUser.email} with role ${newUser.role}`);
    return newUser;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw new Error('Failed to create user', error);
  }
};
