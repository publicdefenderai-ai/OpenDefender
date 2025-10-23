import { Scale, Twitter, Linkedin, Github, Shield } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-600 text-white py-12">
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
                <Link href="/process" className="hover:text-white transition-colors">
                  Court Procedures
                </Link>
              </li>
              <li>
                <Link href="/legal-glossary" className="hover:text-white transition-colors">
                  Legal Glossary
                </Link>
              </li>
              <li>
                <Link href="/record-expungement" className="hover:text-white transition-colors">
                  Record Expungement
                </Link>
              </li>
              <li>
                <Link href="/friends-family" className="hover:text-white transition-colors">
                  Assisting Others
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Help */}
          <div>
            <h4 className="font-semibold mb-4">Get Help</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/case-guidance" className="hover:text-white transition-colors">
                  Get Case Guidance
                </Link>
              </li>
              <li>
                <Link href="/diversion-programs" className="hover:text-white transition-colors">
                  Diversion Programs
                </Link>
              </li>
              <li>
                <Link href="/court-locator" className="hover:text-white transition-colors">
                  Find Local Courts
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/mission-statement" className="hover:text-white transition-colors">
                  Our Mission
                </Link>
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
