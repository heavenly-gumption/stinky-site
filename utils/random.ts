import { randomBytes } from "crypto";

export function generateRandomToken() {
    return randomBytes(32).toString('hex');
}