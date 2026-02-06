// Gallery images for products (multi-angle views)
// Import gallery images
import managerProSeriesGallery from "@/assets/products/gallery/manager-pro-series-gallery.png";
import ergonomicExecutiveTanGallery from "@/assets/products/gallery/ergonomic-executive-tan-gallery.png";
import presidentSupremeGallery from "@/assets/products/gallery/president-supreme-gallery.png";
import directorErgonomicPlusGallery from "@/assets/products/gallery/director-ergonomic-plus-gallery.png";
import executiveDeluxeHbGallery from "@/assets/products/gallery/executive-deluxe-hb-gallery.png";
import directorLeatheretteHbGallery from "@/assets/products/gallery/director-leatherette-hb-gallery.png";
import executiveMbClassicGallery from "@/assets/products/gallery/executive-mb-classic-gallery.png";
import presidentHbEliteGallery from "@/assets/products/gallery/president-hb-elite-gallery.png";
import directorHbPremiumGallery from "@/assets/products/gallery/director-hb-premium-gallery.png";
import executiveCamelLeatheretteHbGallery from "@/assets/products/gallery/executive-camel-leatherette-hb-gallery.png";
import directorLuxuryCamelGallery from "@/assets/products/gallery/director-luxury-camel-gallery.png";
import managerClassicBrownGallery from "@/assets/products/gallery/manager-classic-brown-gallery.png";

// New gallery imports
import executiveEliteHbGallery from "@/assets/products/gallery/executive-elite-hb-gallery.png";
import executiveQuiltedPremiumGallery from "@/assets/products/gallery/executive-quilted-premium-gallery.png";
import managerQuiltedMbBlackGallery from "@/assets/products/gallery/manager-quilted-mb-black-gallery.png";
import executiveCamelLeatheretteHbGallery2 from "@/assets/products/gallery/executive-camel-leatherette-hb-gallery-2.png";
import directorLuxuryCamelGallery2 from "@/assets/products/gallery/director-luxury-camel-gallery-2.png";
import staffLeatheretteBlackComfortGallery from "@/assets/products/gallery/staff-leatherette-black-comfort-gallery.png";
import directorPremiumBrownGallery from "@/assets/products/gallery/director-premium-brown-gallery.png";

// Additional gallery imports (side views)
import executiveClassicHbBlackGallery2 from "@/assets/products/gallery/executive-classic-hb-black-gallery-2.png";
import executiveLeatheretteHbBlackGallery from "@/assets/products/gallery/executive-leatherette-hb-black-gallery.png";
import presidentHbEliteGallery2 from "@/assets/products/gallery/president-hb-elite-gallery-2.png";
import executiveEliteHbGallery2 from "@/assets/products/gallery/executive-elite-hb-gallery-2.png";
import executiveQuiltedPremiumGallery2 from "@/assets/products/gallery/executive-quilted-premium-gallery-2.png";

// Task chair gallery imports
import compactSwivelChairGallery from "@/assets/products/gallery/compact-swivel-chair-gallery.png";
import staffLeatheretteTanGallery from "@/assets/products/gallery/staff-leatherette-tan-gallery.png";
import ergonomicMeshHbPremiumGallery from "@/assets/products/gallery/ergonomic-mesh-hb-premium-gallery.png";
import ergonomicMeshHbGrayGallery from "@/assets/products/gallery/ergonomic-mesh-hb-gray-gallery.png";
import ergonomicMeshHbBlackGallery from "@/assets/products/gallery/ergonomic-mesh-hb-black-gallery.png";
import executiveMeshHbGrayGallery from "@/assets/products/gallery/executive-mesh-hb-gray-gallery.png";
import ergonomicMeshMbDuoGallery from "@/assets/products/gallery/ergonomic-mesh-mb-duo-gallery.png";

// Map product IDs to their gallery images (multi-angle views)
export const productGalleryMap: Record<string, string> = {
  "exec-1": directorHbPremiumGallery,
  "exec-2": presidentHbEliteGallery,
  "exec-5": directorLeatheretteHbGallery,
  "exec-6": executiveDeluxeHbGallery,
  "exec-7": directorErgonomicPlusGallery,
  "exec-8": presidentSupremeGallery,
  "exec-9": managerProSeriesGallery,
  "exec-3": executiveMbClassicGallery,
  "exec-16": ergonomicExecutiveTanGallery,
  "exec-32": executiveCamelLeatheretteHbGallery,
  "exec-17": directorLuxuryCamelGallery,
  "exec-13": managerClassicBrownGallery,
  // New gallery mappings
  "exec-18": executiveEliteHbGallery2, // Executive Elite HB - side view only
  "exec-23": executiveQuiltedPremiumGallery,
  "exec-28": managerQuiltedMbBlackGallery,
  "exec-11": directorPremiumBrownGallery,
  "task-17": staffLeatheretteBlackComfortGallery,
  // Additional mappings
  "exec-25": executiveClassicHbBlackGallery2, // Executive Classic HB Black
  "exec-21": executiveLeatheretteHbBlackGallery, // Executive Leatherette HB Black
  "exec-26": executiveEliteHbGallery, // Director Premium Tan
  // Task chair gallery mappings
  "task-2": compactSwivelChairGallery, // Compact Swivel Chair
  "task-1": staffLeatheretteTanGallery, // Staff Leatherette Tan
  "task-8": ergonomicMeshHbPremiumGallery, // Ergonomic Mesh HB Premium
  "task-5": ergonomicMeshHbBlackGallery, // Ergonomic Mesh HB – Vertex Black
  "task-6": ergonomicMeshHbGrayGallery, // Ergonomic Mesh HB – Aura Gray
  "exec-29": executiveMeshHbGrayGallery, // Executive Mesh HB Gray
  "task-12": ergonomicMeshMbDuoGallery, // Ergonomic Mesh MB Duo
  "exec-19": presidentHbEliteGallery2, // President Black Elite - side view only
};

// Additional gallery images for products with multiple gallery views
export const productGalleryMap2: Record<string, string> = {
  "exec-32": executiveCamelLeatheretteHbGallery2,
  "exec-17": directorLuxuryCamelGallery2,
  "exec-12": executiveQuiltedPremiumGallery2, // Executive Quilted Gold - side view
};

// Helper to check if a product has gallery images
export const hasGalleryImages = (productId: string): boolean => {
  return productId in productGalleryMap;
};

// Get gallery image for a product
export const getGalleryImage = (productId: string): string | null => {
  return productGalleryMap[productId] || null;
};

// Get all gallery images for a product (including additional views)
export const getAllGalleryImages = (productId: string): string[] => {
  const images: string[] = [];
  if (productGalleryMap[productId]) {
    images.push(productGalleryMap[productId]);
  }
  if (productGalleryMap2[productId]) {
    images.push(productGalleryMap2[productId]);
  }
  return images;
};
