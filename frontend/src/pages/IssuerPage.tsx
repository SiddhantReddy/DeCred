import React, { useEffect, useState } from 'react';
import { Organization, PendingRequest } from '../types/common';
import { ArrowLeft, Clock, User, FileCheck, XCircle, Building2} from 'lucide-react';

export const IssuerPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/schema/org');
        const data = await response.json();
        const organizations = data.data.types[0];
        setOrganizations(organizations);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      }
    };
    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!selectedOrg) return;
      try {
        const response = await fetch(`http://localhost:8000/api/vc/unfulfilled/${selectedOrg.id}`);
        const data = await response.json();
        const pendingRequest = data.data;
        setPendingRequests(pendingRequest);
      } catch (error) {
        console.error('Failed to fetch pending requests:', error);
      }
    };
    fetchPendingRequests();
  }, [selectedOrg]);

  const processRequest = async (requestId: string) => {
    try {
      await fetch(`http://localhost:8000/api/vc/process/${selectedOrg?.id}/${requestId}`, {
        method: 'POST',
      });
      console.log("Refreshing :: ", selectedOrg?.id);
      const response = await fetch(`http://localhost:8000/api/vc/unfulfilled/${selectedOrg?.id}`);
      const data = await response.json();
      const pendingRequest = data.data;
      setPendingRequests(pendingRequest);
    } catch (error) {
      console.error('Failed to process request:', error);
    }
  };

  if (!selectedOrg) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8">
                <div className="text-center">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Credential</span>
                    <span className="block text-blue-600">Issuer Dashboard</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                    Select an organization to manage verifiable credential requests
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <div
                key={org.id}
                onClick={() => setSelectedOrg(org)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Building2 className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{org.description || "No description available"}</p>
                </div>
              </div>
            ))}
          </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedOrg(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Organizations</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedOrg.name}</h1>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" />
            <span>{pendingRequests?.length || 0} Pending Requests</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Pending VC Requests</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingRequests != null && pendingRequests.length > 0 ? (
                pendingRequests.map(request => (
                  <div 
                    key={request.id}
                    className="group bg-gray-50 border border-gray-200 p-6 rounded-xl hover:border-blue-200 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-500" />
                          <p className="text-sm text-gray-500">Requester DID:</p>
                        </div>
                        <p className="font-mono text-sm text-gray-900">{request.data.issuer}</p>
                        <div className="flex gap-3">
                          {request.data.type.map((type, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => processRequest(request.id)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <FileCheck className="w-4 h-4" />
                        Process Request
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No pending requests at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};