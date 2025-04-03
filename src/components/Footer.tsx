
import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 mt-auto">
      <Separator className="mb-6" />
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BinaryBloom. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Contact Us
          </Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
