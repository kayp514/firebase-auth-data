// app/actions/auth.ts
'use server'

import { setServerSession, getServerSession, clearServerSession } from '../lib/authServer';

export { setServerSession, getServerSession, clearServerSession };