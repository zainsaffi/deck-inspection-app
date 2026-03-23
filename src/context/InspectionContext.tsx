import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Inspection,
  CoverPage,
  InspectionLocation,
  Finding,
} from '../types/inspection';

const STORAGE_KEY = 'active_inspection';

type InspectionAction =
  | { type: 'NEW_INSPECTION'; payload: { id: string; userId: string } }
  | { type: 'SET_INSPECTION'; payload: Inspection }
  | { type: 'UPDATE_COVER_PAGE'; payload: Partial<CoverPage> }
  | { type: 'ADD_LOCATION'; payload: InspectionLocation }
  | { type: 'UPDATE_LOCATION'; payload: { locationId: string; data: Partial<InspectionLocation> } }
  | { type: 'ADD_FINDING'; payload: { locationId: string; finding: Finding } }
  | { type: 'UPDATE_FINDING'; payload: { locationId: string; findingId: string; data: Partial<Finding> } }
  | { type: 'COMPLETE_INSPECTION' }
  | { type: 'CLEAR' };

const initialCoverPage: CoverPage = {
  businessInfo: { name: '', address: '', city: '', state: '', zip: '', email: '' },
  propertyLocation: { address: '', city: '', state: '', zip: '' },
  managementContact: { name: '', address: '', phone: '', email: '' },
  propertyPhotoUri: null,
  inspectionDate: new Date().toISOString().split('T')[0],
};

function inspectionReducer(state: Inspection | null, action: InspectionAction): Inspection | null {
  switch (action.type) {
    case 'NEW_INSPECTION':
      return {
        id: action.payload.id,
        userId: action.payload.userId,
        coverPage: { ...initialCoverPage },
        locations: [],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

    case 'SET_INSPECTION':
      return action.payload;

    case 'UPDATE_COVER_PAGE':
      if (!state) return state;
      return {
        ...state,
        coverPage: { ...state.coverPage, ...action.payload },
        updatedAt: new Date().toISOString(),
      };

    case 'ADD_LOCATION':
      if (!state) return state;
      return {
        ...state,
        locations: [...state.locations, action.payload],
        updatedAt: new Date().toISOString(),
      };

    case 'UPDATE_LOCATION':
      if (!state) return state;
      return {
        ...state,
        locations: state.locations.map((loc) =>
          loc.id === action.payload.locationId
            ? { ...loc, ...action.payload.data }
            : loc
        ),
        updatedAt: new Date().toISOString(),
      };

    case 'ADD_FINDING':
      if (!state) return state;
      return {
        ...state,
        locations: state.locations.map((loc) =>
          loc.id === action.payload.locationId
            ? { ...loc, findings: [...loc.findings, action.payload.finding] }
            : loc
        ),
        updatedAt: new Date().toISOString(),
      };

    case 'UPDATE_FINDING':
      if (!state) return state;
      return {
        ...state,
        locations: state.locations.map((loc) =>
          loc.id === action.payload.locationId
            ? {
                ...loc,
                findings: loc.findings.map((f) =>
                  f.id === action.payload.findingId
                    ? { ...f, ...action.payload.data }
                    : f
                ),
              }
            : loc
        ),
        updatedAt: new Date().toISOString(),
      };

    case 'COMPLETE_INSPECTION':
      if (!state) return state;
      return {
        ...state,
        status: 'complete',
        updatedAt: new Date().toISOString(),
      };

    case 'CLEAR':
      return null;

    default:
      return state;
  }
}

interface InspectionContextType {
  inspection: Inspection | null;
  dispatch: React.Dispatch<InspectionAction>;
}

const InspectionContext = createContext<InspectionContextType>({
  inspection: null,
  dispatch: () => {},
});

export function InspectionProvider({ children }: { children: React.ReactNode }) {
  const [inspection, dispatch] = useReducer(inspectionReducer, null);

  // Load from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          dispatch({ type: 'SET_INSPECTION', payload: JSON.parse(data) });
        } catch {}
      }
    });
  }, []);

  // Persist to storage on every change
  useEffect(() => {
    if (inspection) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inspection));
    } else {
      AsyncStorage.removeItem(STORAGE_KEY);
    }
  }, [inspection]);

  return (
    <InspectionContext.Provider value={{ inspection, dispatch }}>
      {children}
    </InspectionContext.Provider>
  );
}

export const useInspection = () => useContext(InspectionContext);
