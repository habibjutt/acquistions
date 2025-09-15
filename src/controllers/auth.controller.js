import logger from '#config/logger.js';
import { createUser, authenticateUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationErrors } from '#utils/format.js';
import { jwtToken } from '#utils/jwt.js';
import { signUpSchema, signInSchema } from '#validations/auth.validation.js';

export const signUp = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }
    const { name, email, password, role } = validationResult.data;

    //Auth service
    const user = await createUser(name, email, password, role);
    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);

    logger.info(
      `User ${name} with email ${email} and role ${role} is attempting to sign up.`
    );
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error in signUp controller:', error);
    if (error.message === 'Username already exists') {
      return res.status(409).json({ message: error.message });
    }
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation failed',
        details: formatValidationErrors(validationResult.error),
      });
    }
    const { email, password } = validationResult.data;

    // Authenticate user
    const user = await authenticateUser(email, password);
    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);

    logger.info(`User ${email} signed in successfully`);
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error in signIn controller:', error);
    if (error.message === 'User not found' || error.message === 'Invalid password') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    cookies.clear(res, 'token');
    
    logger.info('User signed out successfully');
    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (error) {
    logger.error('Error in signOut controller:', error);
    next(error);
  }
};
