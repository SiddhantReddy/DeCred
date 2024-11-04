import React from 'react';
import { Organization } from '../types/common';

interface OrganizationCardProps {
  org: Organization;
  onClick: (org: Organization) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ org, onClick }) => (
  <div
    onClick={() => onClick(org)}
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
  >
    <h2 className="text-xl font-semibold mb-4 text-blue-600">{org.name}</h2>
    <p className="text-gray-600">Type: {org.type}</p>
  </div>
);
