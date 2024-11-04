export interface Organization {
    id: string;
    name: string;
    type: string;
    description: string;
  }
  
  export interface PendingRequest {
    id: string;
    createdAt: string;
    data: Credential;
  }

  export interface DataModel {
    issuanceDate: string;
    issuer: string;
  }
  
  export interface Credential {
    id: string;
    type: string[];
    issuer: string;
    validFrom: string;
    dataModel: DataModel;
    requestClaims: any;
  }