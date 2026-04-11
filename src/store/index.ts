import { configureStore} from '@reduxjs/toolkit';
import registrationReducer from './registration.slice.ts'
import { saveDraftToStorage } from './registration.persist.ts';

export const store = configureStore({
    reducer: {
        registration: registrationReducer,
    }
})

// Persist ONLY the draft subtree on every change (tiny)
let lastDraftJson = '';
store.subscribe(() => {
  const draft = store.getState().registration.draft;
  const next = JSON.stringify(draft);
  if (next !== lastDraftJson) {
    lastDraftJson = next;
      // Remove when empty; save otherwise
  if (!draft || next === '{}') {
     localStorage.removeItem('pk_registration_draft');
   } else {
     saveDraftToStorage(draft);
   }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch

export type ReduxStore = {
    getState: () => RootState;
    dispatch: AppDispatch;
}