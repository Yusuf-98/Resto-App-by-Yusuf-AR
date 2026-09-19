import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  checkoutSchema,
  reviewSchema,
} from './index';

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'secret1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const base = {
    name: 'Yusuf',
    email: 'user@example.com',
    phone: '081234567890',
    password: 'secret1',
    confirmPassword: 'secret1',
  };

  it('accepts a fully valid payload', () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  it('rejects when confirmPassword does not match password', () => {
    const result = registerSchema.safeParse({
      ...base,
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmPassword']);
    }
  });

  it('rejects a phone number with invalid characters', () => {
    const result = registerSchema.safeParse({ ...base, phone: 'abc123' });
    expect(result.success).toBe(false);
  });

  it('rejects a phone number shorter than 10 digits', () => {
    const result = registerSchema.safeParse({ ...base, phone: '12345' });
    expect(result.success).toBe(false);
  });
});

describe('checkoutSchema', () => {
  it('requires a delivery address of at least 10 characters', () => {
    const short = checkoutSchema.safeParse({
      deliveryAddress: 'too short',
      paymentMethod: 'bca',
    });
    expect(short.success).toBe(false);

    const valid = checkoutSchema.safeParse({
      deliveryAddress: 'Jl. Merdeka No. 123',
      paymentMethod: 'bca',
    });
    expect(valid.success).toBe(true);
  });

  it('requires a payment method to be selected', () => {
    const result = checkoutSchema.safeParse({
      deliveryAddress: 'Jl. Merdeka No. 123',
      paymentMethod: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('reviewSchema', () => {
  it('accepts a star rating between 1 and 5 with a comment', () => {
    const result = reviewSchema.safeParse({
      star: 5,
      comment: 'Makanannya enak sekali',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a star rating above 5', () => {
    const result = reviewSchema.safeParse({
      star: 6,
      comment: 'Makanannya enak sekali',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a comment shorter than 10 characters', () => {
    const result = reviewSchema.safeParse({ star: 4, comment: 'ok' });
    expect(result.success).toBe(false);
  });
});
