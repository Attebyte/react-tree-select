import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Resolves conflicts between the library's own rts:-prefixed defaults (base classes vs. variants).
// Consumer classes are left as they are; they override the defaults through the cascade layer.
const twMerge = extendTailwindMerge({ prefix: 'rts' })

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
