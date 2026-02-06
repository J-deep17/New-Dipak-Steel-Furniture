
# Dipak Steel Furniture - Premium Catalog Website

## Overview

Build a professional, catalog-based website for Dipak Steel Furniture that transforms their physical product catalog into an elegant digital showroom. The website will feature a premium design with modern aesthetics, comprehensive product categories, and multiple enquiry channels.

---

## Design System

### Color Palette
- **Primary**: Deep charcoal/slate (professional, premium feel)
- **Accent**: Warm bronze/copper (reflects steel furniture metallic quality)
- **Background**: Off-white and light gray tones
- **Text**: Dark gray for readability

### Typography
- Elegant sans-serif fonts for headings
- Clean, readable body text
- Professional spacing and hierarchy

### Visual Style
- Large hero images with subtle overlays
- Card-based product layouts with hover effects
- Smooth scroll animations
- Minimal text clutter with focus on visuals

---

## Website Structure

### Pages to Create

1. **Home Page** (`/`)
   - Hero section with rotating product images
   - Brand tagline: "Designing Comfort. Delivering Quality."
   - Feature highlights (Ergonomic, Quality, Indian Made)
   - Category navigation tiles (6 main categories)
   - Featured products showcase
   - Call-to-action sections

2. **About Us** (`/about`)
   - Company introduction
   - Vision, Mission, Values section
   - Manufacturing focus
   - Trust indicators

3. **Design Philosophy** (`/philosophy`)
   - ECO + ERGO = SMART COMFORT concept
   - Ergonomic design principles
   - Material quality focus
   - Indian workspace focus

4. **Products Landing** (`/products`)
   - All categories overview
   - Visual category grid

5. **Category Pages** (10 categories):
   - `/products/executive-chairs` - Executive & Director Chairs
   - `/products/task-chairs` - Task & Staff Chairs
   - `/products/visitor-chairs` - Visitor & Reception Chairs
   - `/products/institutional-seating` - Public & Institutional Seating
   - `/products/beds` - Beds
   - `/products/dining-sets` - Dining Sets
   - `/products/tables` - Tables & Workstations
   - `/products/school-furniture` - School Bench & Classroom Furniture
   - `/products/almirahs` - Steel Almirah Series
   - `/products/sofas` - Sofa & Lounge Series

6. **Materials & Finishes** (`/materials`)
   - Fabric upholstery
   - Mesh back options
   - Leatherette varieties
   - Chrome and powder-coated bases

7. **Quality & Trust** (`/quality`)
   - Quality standards
   - Testing processes
   - Client testimonials area
   - Trust badges

8. **Contact** (`/contact`)
   - Full address with Google Maps
   - Phone, email, WhatsApp links
   - Enquiry form
   - Business hours

---

## File Structure

```text
src/
├── assets/
│   └── products/           # Uploaded chair images
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Navigation with logo
│   │   ├── Footer.tsx      # Contact info, links
│   │   └── Layout.tsx      # Main wrapper
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── CategoryTiles.tsx
│   │   ├── FeaturedProducts.tsx
│   │   └── WhyChooseUs.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CategoryHeader.tsx
│   │   └── EnquiryModal.tsx
│   ├── contact/
│   │   ├── ContactForm.tsx
│   │   ├── WhatsAppButton.tsx
│   │   └── LocationMap.tsx
│   └── ui/                  # Existing shadcn components
├── data/
│   └── products.ts          # Static product data
├── pages/
│   ├── Index.tsx
│   ├── About.tsx
│   ├── Philosophy.tsx
│   ├── Products.tsx
│   ├── ProductCategory.tsx
│   ├── Materials.tsx
│   ├── Quality.tsx
│   └── Contact.tsx
└── lib/
    └── utils.ts
```

---

## Key Features

### Navigation
- Sticky header with logo and menu
- Products dropdown with category links
- Mobile hamburger menu
- Smooth scroll behavior

### Product Display
- Large product images from uploaded files
- Product name and key features
- "Enquire Now" button (no prices shown)
- Hover effects with image zoom

### Enquiry System (All Channels)
- **Contact Form**: Name, email, phone, product interest, message
- **WhatsApp Button**: Floating button + per-product enquiry
- **Click-to-Call**: Phone number links
- **Email Link**: Direct mailto link

### Responsive Design
- Desktop: Multi-column grids, full navigation
- Tablet: 2-column layouts, condensed menu
- Mobile: Single column, hamburger menu, touch-friendly

---

## Product Data Structure

Static product data will be organized by category with the following information per product:
- ID and name
- Category
- Image path
- Key features list
- Applications/use cases
- Available finishes

The 10 uploaded chair images will be used for the Executive & Director Chairs category initially.

---

## Technical Implementation

### Routing Setup
All routes configured in App.tsx with react-router-dom:
- Home, About, Philosophy, Materials, Quality, Contact
- Products index page
- Dynamic category page using URL parameter

### Form Validation
Contact and enquiry forms will use:
- Zod schema validation
- React Hook Form integration
- Proper input sanitization
- Error handling with toast notifications

### Performance
- Lazy loading for images
- Component code splitting
- Optimized image sizes
- Smooth CSS transitions

### SEO Considerations
- Semantic HTML structure
- Proper heading hierarchy
- Meta descriptions per page
- Alt text for all images

---

## Implementation Steps

### Phase 1: Foundation
1. Set up custom color scheme in CSS
2. Copy uploaded product images to assets
3. Create Layout component with Header/Footer
4. Configure all routes in App.tsx

### Phase 2: Core Pages
5. Build Home page with all sections
6. Create About page
7. Create Design Philosophy page
8. Build Materials & Finishes page
9. Create Quality & Trust page

### Phase 3: Products
10. Create static product data file
11. Build Products landing page
12. Create ProductCard and ProductGrid components
13. Build dynamic category page
14. Add EnquiryModal component

### Phase 4: Contact & Polish
15. Build Contact page with form and map
16. Add floating WhatsApp button
17. Mobile responsive adjustments
18. Final styling and animations

---

## Contact Information (As Provided)

- **Address**: Plot-4, No. 2 Bhagirath Estate, Opp. Jawaharnagar, Near Gulabnagar Char Rasta, Amraiwadi, Ahmedabad, Gujarat - 380026
- **Phone**: +91 98240 44585
- **Email**: dipaksteel@gmail.com
- **Google Maps**: Embedded iframe with location marker
