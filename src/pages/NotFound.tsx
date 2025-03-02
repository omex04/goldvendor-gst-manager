
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-gold-500">404</h1>
          <p className="text-xl text-foreground/80 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Button asChild className="bg-gold-500 hover:bg-gold-600">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
