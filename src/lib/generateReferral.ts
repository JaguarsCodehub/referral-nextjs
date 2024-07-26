// src/utils/generateReferralId.ts
import { v4 as uuidv4 } from 'uuid';

export function generateUniqueReferralId(): string {
    return uuidv4();
}
