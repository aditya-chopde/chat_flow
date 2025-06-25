import { clsx, type ClassValue } from "clsx"
import mongoose from "mongoose"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const connectDB = () => {
  try {
    return mongoose.connect(process.env.MONGO_URI as string);
  } catch (error) {
    throw new Error("Error Connecting DB: " + error);
  }
}