import React, { useEffect, useState } from "react";
import { Organization, Credential } from "../types/common";
import { Building2, FileCheck, ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";

export const HolderPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [formSchema, setFormSchema] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [activeTab, setActiveTab] = useState<"request" | "credentials">("request");

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/schema/org");
        const data = await response.json();
        const organizations = data.data.types[0];
        setOrganizations(organizations);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchFormSchema = async () => {
      if (!selectedOrg) return;
      try {
        const response = await fetch(`http://localhost:8000/api/schema/passport`);
        const data = await response.json();
        const orgformData = data.data.fields;
        setFormSchema(orgformData);
        setFormData({});
      } catch (error) {
        console.error("Failed to fetch form schema:", error);
      }
    };

    const fetchCredentials = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/vc/search/${selectedOrg?.id}`
        );
        const data = await response.json();
        const credentials = data.data;
        if (credentials !== null) {
          setCredentials(credentials);
        }
      } catch (error) {
        console.error("Failed to fetch credentials:", error);
      }
    };

    fetchFormSchema();
    fetchCredentials();
  }, [selectedOrg]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const submitRequest = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `http://localhost:8000/api/vc/request/${selectedOrg?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        setSubmitStatus("success");
        setSelectedOrg(null);
        setFormData({});
      } else {
        throw new Error("Request failed");
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePopup = () => {
    setSubmitStatus(null);
    if (submitStatus === "success") {
      window.location.href = "/holder";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {selectedOrg && (
            <button
              onClick={() => setSelectedOrg(null)}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Organizations
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedOrg ? selectedOrg.name : "Holder Dashboard"}
          </h1>
        </div>

        {!selectedOrg ? (
          // Organizations Grid
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
        ) : (
          // Selected Organization View
          <div className="space-y-6">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("request")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "request"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Request Credential
                </button>
                <button
                  onClick={() => setActiveTab("credentials")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "credentials"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Issued Credentials
                </button>
              </nav>
            </div>

            {/* Request Form */}
            {activeTab === "request" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                {formSchema ? (
                  <div className="space-y-6">
                    {formSchema.map((field: any) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.description || field.name}
                        </label>
                        <input
                          type={field.type === "string" ? "text" : field.type}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={formData[field.name] || ""}
                          placeholder={field.example || ""}
                          required={field.required}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                        />
                      </div>
                    ))}
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={submitRequest}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <Clock className="animate-spin w-4 h-4 mr-2" />
                            Submitting...
                          </span>
                        ) : (
                          "Submit Request"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <Clock className="animate-spin w-6 h-6 text-blue-600 mr-2" />
                    <span className="text-gray-600">Loading form...</span>
                  </div>
                )}
              </div>
            )}

            {/* Credentials List */}
            {activeTab === "credentials" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-4">
                  {credentials && credentials.length > 0 ? (
                    credentials.map((credential) => (
                      <div
                        key={credential.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {credential.type.map((type, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">
                              Valid From: {credential.validFrom}
                            </p>
                            <p className="text-sm text-gray-600 font-mono mt-1">
                              Issuer: {credential.dataModel.issuer}
                            </p>
                          </div>
                          <FileCheck className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No credentials found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status Popup */}
        {submitStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
              <div className="text-center">
                {submitStatus === "success" ? (
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                )}
                <h3 className="text-lg font-semibold mb-2">
                  {submitStatus === "success" ? "Success!" : "Error"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {submitStatus === "success"
                    ? "Your request was submitted successfully."
                    : "Failed to submit request. Please try again."}
                </p>
                <button
                  onClick={handleClosePopup}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};