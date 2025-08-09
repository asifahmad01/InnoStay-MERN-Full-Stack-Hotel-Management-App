// src/pages/Welcome.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, Lock, UserPlus, Star, Check, Calendar, BarChart, Users, Heart, Phone } from 'lucide-react';

export default function Welcome() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 150;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Wave parameters
    const wave = {
      y: canvas.height / 2,
      length: 0.01,
      amplitude: 30,
      frequency: 0.01,
    };
    
    let increment = wave.frequency;
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)'); // indigo
      gradient.addColorStop(1, 'rgba(79, 70, 229, 0.6)'); // indigo darker
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      ctx.moveTo(0, canvas.height);
      
      // Draw wave
      for (let i = 0; i < canvas.width; i++) {
        ctx.lineTo(i, wave.y + Math.sin(i * wave.length + increment) * wave.amplitude);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
      
      increment += wave.frequency;
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 w-10 h-10 flex items-center justify-center rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-indigo-800">Grandeur Suites</h1>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex space-x-8">
            <Link to="#" className="text-gray-600 hover:text-indigo-700 transition flex items-center">
              <Heart className="h-4 w-4 mr-1" /> Features
            </Link>
            <Link to="#" className="text-gray-600 hover:text-indigo-700 transition flex items-center">
              <Star className="h-4 w-4 mr-1" /> Pricing
            </Link>
            <Link to="#" className="text-gray-600 hover:text-indigo-700 transition flex items-center">
              <Phone className="h-4 w-4 mr-1" /> Contact
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition group"
            >
              <Lock className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>Log in</span>
            </Link>
            <Link
              to="/signup"
              className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition group"
            >
              <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Dynamic Wave */}
      <main className="flex-1">
        <div className="relative">
          {/* Dynamic Wave Canvas */}
          <canvas 
            ref={canvasRef} 
            className="w-full h-40 absolute top-0 left-0 z-0"
          />
          
          {/* Hero Content */}
          <div className="container mx-auto px-6 py-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium mb-2">
                  Premium Hotel Management
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 leading-tight">
                  Experience Luxury Hospitality Management
                </h2>
                <p className="text-lg text-gray-600">
                  Streamline operations, delight guests, and boost revenue with our 
                  all-in-one hotel management platform designed for luxury hospitality businesses.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/signup"
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <UserPlus className="h-5 w-5 transition-transform group-hover:scale-125" />
                    <span>Start Free Trial</span>
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition group"
                  >
                    <Lock className="h-5 w-5 transition-transform group-hover:scale-125" />
                    <span>Login to Dashboard</span>
                  </Link>
                </div>
                
                <div className="flex flex-wrap gap-6 mt-4">
                  {[
                    { text: "Free 14-day trial", icon: <Calendar className="h-5 w-5 text-green-600" /> },
                    { text: "No credit card required", icon: <Check className="h-5 w-5 text-green-600" /> },
                    { text: "24/7 Premium Support", icon: <Phone className="h-5 w-5 text-green-600" /> }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-2">
                        {item.icon}
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Image Card */}
              <div className="relative">
                <div className="w-full h-96 rounded-2xl overflow-hidden shadow-xl border-8 border-white">
                  <img
                    src="https://source.unsplash.com/800x600/?luxury,hotel"
                    alt="Luxury hotel interior"
                    className="object-cover w-full h-full"
                  />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-200 rounded-full mix-blend-soft-light opacity-20 z-[-1]" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-200 rounded-full mix-blend-soft-light opacity-20 z-[-1]" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Premium Hotel Management Features
              </h2>
              <p className="text-xl text-gray-600">
                Everything you need to manage your hotel efficiently and provide exceptional guest experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Calendar className="h-10 w-10 text-indigo-600" />,
                  title: "Reservation Management",
                  description: "Easily manage bookings, check-ins, and check-outs with our intuitive calendar interface."
                },
                {
                  icon: <Users className="h-10 w-10 text-indigo-600" />,
                  title: "Guest Experience",
                  description: "Personalize stays with guest preferences, special requests, and loyalty programs."
                },
                {
                  icon: <BarChart className="h-10 w-10 text-indigo-600" />,
                  title: "Reporting & Analytics",
                  description: "Gain insights with real-time reports on occupancy, revenue, and guest satisfaction."
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <Home className="h-6 w-6 text-indigo-700" />
                </div>
                <h2 className="text-xl font-bold">Grandeur Suites</h2>
              </div>
              <p className="text-indigo-200">
                Premium hotel management solutions for luxury hospitality businesses.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-indigo-200">
                <li><Link to="#" className="hover:text-white transition">Features</Link></li>
                <li><Link to="#" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="#" className="hover:text-white transition">Solutions</Link></li>
                <li><Link to="#" className="hover:text-white transition">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-indigo-200">
                <li><Link to="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link to="#" className="hover:text-white transition">Guides</Link></li>
                <li><Link to="#" className="hover:text-white transition">Support</Link></li>
                <li><Link to="#" className="hover:text-white transition">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-indigo-200">
                <li><Link to="#" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="#" className="hover:text-white transition">Careers</Link></li>
                <li><Link to="#" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="#" className="hover:text-white transition">Partners</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-indigo-700 mt-12 pt-8 text-center text-indigo-300">
            <p>&copy; {new Date().getFullYear()} Grandeur Suites Management. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}