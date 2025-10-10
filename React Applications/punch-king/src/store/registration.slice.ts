import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  clearDraftFromStorage,
  loadDraftFromStorage,
} from './registration.persist';

export type Draft = {
  step1?: { email?: string; username?: string };
  step2?: { passwordSet?: boolean };
  step3?: {
    phone?: string;
    address?: string;
    country?: string;
    state?: string;
    gender?: string; // sponsor
    dob?: string; // sponsor
    bio?: string;
    coach_1?: string; // team
    coach_2?: string; // team
    license_number?: string; // team
  };
  step4?: {
    profile_picture?: string;
  };
};

type State = {
  token: string | null;
  flow: 'sponsor' | 'team' | 'admin';
  draft: Draft;
};

const hydratedDraft = loadDraftFromStorage<Draft>() || {};

const initialState: State = {
  token: localStorage.getItem('token') || null,
  flow: 'sponsor',
  draft: hydratedDraft,
};

const slice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setRid(
      state,
      action: PayloadAction<{
        token: string;
        flow: 'sponsor' | 'team' | 'admin';
      }>
    ) {
      state.token = action.payload.token;
      state.flow = action.payload.flow;
      localStorage.setItem('token', action.payload.token);
    },
    setFlow(
      state,
      action: PayloadAction<{ flow: 'sponsor' | 'team' | 'admin' }>
    ) {
      state.flow = action.payload.flow;
      localStorage.setItem('flow', action.payload.flow);
    },
    mergeDraft(state, action: PayloadAction<Partial<Draft>>) {
      state.draft = {
        ...state.draft,
        ...action.payload,
      };
    },
    resetRegistration: (state) => {
      clearDraftFromStorage();
      localStorage.removeItem('pk_registration_draft'); // 👈 clear draft
      localStorage.removeItem('flow');
      localStorage.removeItem('token');
      console.log("You' be logged out");
      state.draft = {};
    },

    /** ✅ Clear ONLY the registration draft (keep token & flow) */
    clearRegistrationDraft(state) {
      clearDraftFromStorage();
      localStorage.removeItem('pk_registration_draft');
      state.draft = {};
    },
    
    // 👇 The real logout: clear everything relevant
    logout(state) {
      state.token = null;
      state.flow = 'sponsor';
      state.draft = {};
      // storage
      localStorage.removeItem('token');
      localStorage.removeItem('flow');
      localStorage.removeItem('pk_registration_draft');
      localStorage.removeItem('pk_seen_onboarding_team');
      clearDraftFromStorage();
    },
  },
});

export default slice.reducer;

export const { setRid, setFlow, mergeDraft, resetRegistration, logout, clearRegistrationDraft } =
  slice.actions;
