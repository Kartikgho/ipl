import { Link } from "wouter";
import { Trophy, Mail, Phone, MapPin, Facebook, Twitter, Github, Code } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="h-6 w-6" />
              <h2 className="text-xl font-heading font-bold">IPL Predict</h2>
            </div>
            <p className="text-primary-200 text-sm">
              Advanced cricket predictions powered by machine learning and AI reasoning.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">Features</h3>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link href="/predictions" className="hover:text-white transition-colors">Match Predictions</Link></li>
              <li><Link href="/players" className="hover:text-white transition-colors">Player Performance</Link></li>
              <li><Link href="/teams" className="hover:text-white transition-colors">Team Analytics</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Analysis</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">Resources</h3>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ML Model Details</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Sources</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Developer Guide</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase">Contact</h3>
            <ul className="space-y-2 text-sm text-primary-200">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a href="mailto:contact@iplpredict.com" className="hover:text-white transition-colors">contact@iplpredict.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <a href="tel:+919369489827" className="hover:text-white transition-colors">+91-9369489827</a>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Lucknow, India 226029</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-primary-300">
            &copy; {new Date().getFullYear()} IPL Predict. All rights reserved.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-primary-300 hover:text-white transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-primary-300 hover:text-white transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-primary-300 hover:text-white transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-primary-300 hover:text-white transition-colors">
              <Code className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
