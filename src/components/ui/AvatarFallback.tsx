import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map of island names to gradient colors based roughly on national flags
const islandGradients: Record<string, string> = {
  'St. Kitts and Nevis': 'from-green-600 via-yellow-500 to-red-600',
  'Jamaica': 'from-green-500 via-yellow-400 to-black',
  'Trinidad and Tobago': 'from-red-600 via-black to-white',
  'Barbados': 'from-blue-600 via-yellow-400 to-blue-600',
  'Bahamas': 'from-teal-400 via-yellow-300 to-black',
  'Antigua and Barbuda': 'from-red-600 via-white to-blue-600',
  'St. Lucia': 'from-blue-400 via-yellow-300 to-black',
  'Dominica': 'from-green-600 via-yellow-400 to-red-600',
  'Grenada': 'from-green-500 via-yellow-400 to-red-500',
  'St. Vincent and the Grenadines': 'from-blue-500 via-yellow-400 to-green-500',
  'Guyana': 'from-green-500 via-yellow-400 to-red-500',
  'Belize': 'from-blue-700 via-white to-red-600',
};

// Fallback if island isn't matched
const defaultGradient = 'from-slate-700 to-slate-500';

interface AvatarFallbackProps {
  name: string;
  island?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AvatarFallback({ name, island, className, size = 'md' }: AvatarFallbackProps) {
  // Extract up to 2 initials (e.g., "Robert L. Bradshaw" -> "RB")
  const getInitials = (fullName: string) => {
    // Remove periods and split
    const cleanName = fullName.replace(/\./g, '');
    const parts = cleanName.trim().split(/[\s-]+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);
  
  // Find matching gradient or use default
  let gradientClass = defaultGradient;
  if (island) {
    const matchingKey = Object.keys(islandGradients).find(k => 
      island.toLowerCase().includes(k.toLowerCase())
    );
    if (matchingKey) {
      gradientClass = islandGradients[matchingKey];
    }
  }

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-48 h-48 text-6xl'
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full font-bold text-white shadow-lg",
        "bg-gradient-to-br",
        gradientClass,
        sizeClasses[size],
        className
      )}
      aria-label={`Profile picture placeholder for ${name}`}
      title={name}
    >
      <span className="drop-shadow-md tracking-wider">{initials}</span>
    </div>
  );
}
