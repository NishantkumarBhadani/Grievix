import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart,
  ArrowUp,
  MessageCircle,
  Shield,
  Globe,
  Sparkles,
  Send,
  Clock
} from "lucide-react";

function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Submit Complaint", path: "/complaintForm", icon: "📝" },
    { name: "My Complaints", path: "/mycomplaints", icon: "📋" },
    { name: "Track Status", path: "/complaint-status", icon: "🔍" },
    { name: "About Us", path: "/about", icon: "👥" }
  ];

  const supportLinks = [
    { name: "Help Center", path: "/help", icon: "❓" },
    { name: "Privacy Policy", path: "/privacy", icon: "🛡️" },
    { name: "Terms of Service", path: "/terms", icon: "📄" },
    { name: "FAQ", path: "/faq", icon: "💡" },
    { name: "Contact Us", path: "/contact", icon: "📞" }
  ];

  const socialLinks = [
    { 
      icon: Facebook, 
      href: "#", 
      label: "Facebook",
      color: "hover:text-blue-500 hover:bg-blue-500/10"
    },
    { 
      icon: Twitter, 
      href: "#", 
      label: "Twitter",
      color: "hover:text-sky-500 hover:bg-sky-500/10"
    },
    { 
      icon: Instagram, 
      href: "#", 
      label: "Instagram",
      color: "hover:text-pink-500 hover:bg-pink-500/10"
    },
    { 
      icon: Linkedin, 
      href: "#", 
      label: "LinkedIn",
      color: "hover:text-blue-600 hover:bg-blue-600/10"
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Orbs */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section - Enhanced */}
            <div className="lg:col-span-1">
              <div className={`transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                {/* Logo with Animation */}
                <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -inset-1 bg-emerald-400 rounded-xl blur opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
                  </div>
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                      Grievix
                    </span>
                    <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mt-1 group-hover:w-20 transition-all duration-300"></div>
                  </div>
                </Link>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                  Empowering communities through transparent and efficient grievance resolution. 
                  Your voice drives positive change.
                </p>

                {/* Trust Badges */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-emerald-300">
                    <Shield className="h-4 w-4" />
                    <span>Secure Platform</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-blue-300">
                    <Clock className="h-4 w-4" />
                    <span>24/7 Support</span>
                  </div>
                </div>

                Enhanced Social Links
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className={`group relative p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 ${social.color} transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 hover:shadow-lg`}
                      aria-label={social.label}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <social.icon className="h-5 w-5 text-gray-400 group-hover:text-current transition-colors" />
                      <div className="absolute inset-0 bg-current rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links - Enhanced */}
            <div className={`transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <span>Quick Links</span>
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center space-x-3 text-gray-300 hover:text-emerald-300 transition-all duration-300 transform hover:translate-x-2 py-2"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="relative">
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support - Enhanced
            <div className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-400" />
                <span>Support</span>
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center space-x-3 text-gray-300 hover:text-blue-300 transition-all duration-300 transform hover:translate-x-2 py-2"
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="relative">
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Contact & Newsletter - Enhanced */}
            <div className={`transition-all duration-1000 delay-400 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Globe className="h-5 w-5 text-purple-400" />
                <span>Stay Connected</span>
              </h3>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                {[
                  { icon: Mail, text: "grievix2@gmail.com", label: "Email" },
                  { icon: Phone, text: "+91 9920______", label: "Phone" },
                  { icon: MapPin, text: "Howrah, West Bangal", label: "Address" }
                ].map((contact, index) => (
                  <div key={contact.label} className="flex items-center space-x-3 group cursor-pointer">
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-emerald-500/20 transition-colors duration-300">
                      <contact.icon className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">{contact.label}</p>
                      <p className="text-white font-medium group-hover:text-emerald-300 transition-colors">
                        {contact.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

             
            </div>
             {/* Newsletter Subscription */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-3">Newsletter</h4>
                {subscribed ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Send className="h-6 w-6 text-emerald-400" />
                    </div>
                    <p className="text-emerald-400 text-sm font-medium">Thank you for subscribing!</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Subscribe</span>
                    </button>
                  </form>
                )}
              </div>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-gray-300">
              <p className="text-sm flex items-center space-x-1">
                <span>© {currentYear} Grievix. All rights reserved.</span>
              </p>
              <div className="hidden md:flex items-center space-x-1 text-emerald-400">
                <Heart className="h-4 w-4 fill-current animate-pulse" />
                <span className="text-sm">Making a difference</span>
              </div>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center items-center space-x-6 text-sm text-gray-400">
              {[
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Cookie Policy", path: "/cookies" },
                { name: "Accessibility", path: "/accessibility" }
              ].map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="hover:text-emerald-300 transition-colors duration-300 transform hover:scale-105"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              className="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 px-4 py-2 rounded-xl hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="text-sm">Back to Top</span>
              <ArrowUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={scrollToTop}
          className="group w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 flex items-center justify-center"
        >
          <ArrowUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
      `}</style>
    </footer>
  );
}

export default Footer;