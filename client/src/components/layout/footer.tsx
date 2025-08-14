import { Scale, Twitter, Linkedin, Github, Shield } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 legal-blue rounded-lg flex items-center justify-center">
                <Scale className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">Public Defender AI</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Expanding access to justice through AI-powered legal guidance and resources.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-linkedin"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-github"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Legal Resources */}
          <div>
            <h4 className="font-semibold mb-4">Legal Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/rights-info" className="hover:text-white transition-colors">
                  Know Your Rights
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Court Procedures
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Legal Glossary
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Diversion Programs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Record Expungement
                </a>
              </li>
            </ul>
          </div>

          {/* Get Help */}
          <div>
            <h4 className="font-semibold mb-4">Get Help</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Find Public Defender
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Legal Aid Organizations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Emergency Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Crisis Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Community Help
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <Link href="/development-roadmap" className="hover:text-white transition-colors">
                  Development Roadmap
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Data Sources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8">
          <div className="legal-blue text-white py-4 px-6 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">
                <strong>Privacy First:</strong> We do not store your personal data — all input deleted after session.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Public Defender AI. Not a substitute for professional legal advice.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Accessibility
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Feedback
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
