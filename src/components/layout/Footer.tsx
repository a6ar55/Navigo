
import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-white py-6">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-travel-primary" />
              <span className="font-bold text-xl text-travel-dark">WanderLust</span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm">
              Plan your perfect trip with our AI-powered itinerary generator. From accommodations to activities, we've got you covered.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-gray-500 hover:text-travel-primary">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-travel-primary">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-travel-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-gray-500 hover:text-travel-primary">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Stay Updated</h3>
            <p className="text-sm text-gray-500">
              Subscribe to our newsletter for travel tips and exclusive deals.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-travel-primary"
              />
              <button className="px-3 py-2 text-sm text-white bg-travel-primary rounded-md hover:bg-travel-primary/90">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-4">
          <p className="text-xs text-center text-gray-500">
            © 2023 WanderLust. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
