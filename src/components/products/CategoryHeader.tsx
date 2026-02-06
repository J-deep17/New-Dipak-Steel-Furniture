import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface CategoryHeaderProps {
  title: string;
  description: string;
  breadcrumbs?: { name: string; path: string }[];
}

const CategoryHeader = ({ title, description, breadcrumbs }: CategoryHeaderProps) => {
  return (
    <div className="bg-primary py-12 md:py-16">
      <div className="container">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="mb-4 flex items-center gap-1 text-sm text-primary-foreground/70">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-primary-foreground">{crumb.name}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-accent">
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="mb-3 text-3xl font-bold text-primary-foreground md:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-primary-foreground/80">{description}</p>
      </div>
    </div>
  );
};

export default CategoryHeader;
