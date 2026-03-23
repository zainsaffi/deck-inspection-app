import { FindingStatus, SubCategory } from '../constants/inspectionData';

export interface BusinessInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface ManagementContact {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CoverPage {
  businessInfo: BusinessInfo;
  propertyLocation: PropertyLocation;
  managementContact: ManagementContact;
  propertyPhotoUri: string | null;
  inspectionDate: string; // ISO date string
}

export interface Finding {
  id: string;
  subcategory: SubCategory;
  type?: string; // e.g., railing type, deck surface type
  findingNumber: number;
  description: string;
  status: FindingStatus;
  closeUpPhotoUri: string | null;
  locationPhotoUri: string | null;
}

export interface InspectionLocation {
  id: string;
  unitNumber: string;
  description: string;
  findings: Finding[];
  isComplete: boolean;
}

export interface Inspection {
  id: string;
  userId: string;
  coverPage: CoverPage;
  locations: InspectionLocation[];
  status: 'draft' | 'complete';
  createdAt: string;
  updatedAt: string;
}
