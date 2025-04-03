
import React from "react";
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { BookText, CircleHelp, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserMenu } from "@/components/UserMenu";

const Navigation = () => {
  const { user } = useAuth();
  
  return (
    <div className="h-full w-full flex items-center justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/" className={navigationMenuTriggerStyle()}>
              <BookText className="mr-1 h-4 w-4" />
              Home
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/about" className={navigationMenuTriggerStyle()}>
              <CircleHelp className="mr-1 h-4 w-4" />
              About
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/contact" className={navigationMenuTriggerStyle()}>
              <Mail className="mr-1 h-4 w-4" />
              Contact
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      {user && <UserMenu />}
    </div>
  );
};

export default Navigation;
