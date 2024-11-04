import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, User, Key, CheckCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: "Verifiable Credentials",
      description: "Secure, user-controlled digital credentials powered by DIDs"
    },
    {
      icon: <User className="w-6 h-6 text-blue-500" />,
      title: "User-Friendly Interface",
      description: "Simplified access to the DID ecosystem without technical complexity"
    },
    {
      icon: <Key className="w-6 h-6 text-blue-500" />,
      title: "Truvity Integration",
      description: "Leveraging trusted APIs for credential issuance and verification"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-500" />,
      title: "Verifiable Presentations",
      description: "Easy management and sharing of verifiable credentials"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-blue-600">DeCred</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Simplifying decentralized credentials for everyone. Experience the future of digital identity management.
                </p>
              </div>

              {/* Action Cards */}
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
                <div
                  onClick={() => navigate('/issuer')}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-200 hover:border-blue-400"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-blue-600 group-hover:text-blue-700">
                      Issue Verifiable Credential
                    </h2>
                    <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="mt-4 text-gray-600">
                    Issue and manage verifiable credentials through our streamlined dashboard
                  </p>
                </div>

                <div
                  onClick={() => navigate('/holder')}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-200 hover:border-purple-400"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-purple-600 group-hover:text-purple-700">
                      Request Verifiable Credential
                    </h2>
                    <ArrowRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="mt-4 text-gray-600">
                    Request and manage your digital credentials with ease
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose DeCred?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About The Project</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              <p className="text-gray-600">
                DeCred makes decentralized credentials more user-friendly by abstracting the complexities 
                of the DID space. Built with Truvity APIs, our platform enables secure credential 
                issuance and management while maintaining the highest standards of privacy and security.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Technology</h3>
                  <p className="text-gray-600">
                    Powered by Truvity APIs for credential issuance and verification, ensuring 
                    robust security and interoperability.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    Simplifying the DID ecosystem while maintaining its core benefits of 
                    decentralization and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};