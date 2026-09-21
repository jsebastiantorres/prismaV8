import "temporal-polyfill/full/global"; 
import 'dotenv/config';
import postgres from '@prisma/orm-postgres/runtime';
// import type { Contract } from './contract.d';
import contractJson from './contract.json' with { type: 'json' };

// <Contract>
export const db = postgres({
  contractJson,
  url: process.env['DATABASE_URL']!,
});
