import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import ProductSearch from "@/components/products/ProductSearch";
import { Link } from "react-router-dom";

const Search = () => {
  return (
    <Layout>
      <SEOHead
        title="Search Office Furniture | Find Chairs, Tables, Almirahs | Dipak Furniture"
        description="Search our complete catalog of office furniture including executive chairs, ergonomic mesh chairs, steel almirahs, school furniture and more. Find the perfect furniture for your workspace."
        keywords="search office furniture, find office chairs, office furniture catalog, buy office furniture online, office chair finder"
      />
      
      {/* Hero Section */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Search Office Furniture Products
            </h1>
            <p className="text-primary-foreground/80">
              Find the perfect <strong>office chairs</strong>, <strong>steel almirahs</strong>, and furniture for your needs with our advanced search
              and filters. Browse 100+ products from Ahmedabad's trusted furniture manufacturer.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <ProductSearch />
        </div>
      </section>

      {/* Quick Category Links */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <h2 className="mb-6 text-xl font-semibold text-foreground text-center">
            Or Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products/executive-chairs" className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border">
              Executive Chairs
            </Link>
            <Link to="/products/task-chairs" className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border">
              Task & Staff Chairs
            </Link>
            <Link to="/products/visitor-chairs" className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border">
              Visitor Chairs
            </Link>
            <Link to="/products/almirahs" className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border">
              Steel Almirahs
            </Link>
            <Link to="/products/tables" className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border">
              Office Tables
            </Link>
            <Link to="/products/school-furniture" className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border">
              School Furniture
            </Link>
            <Link to="/products/beds" className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border">
              Steel Beds
            </Link>
            <Link to="/products/sofas" className="rounded-lg bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border">
              Office Sofas
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Search;
