// src/pages/admin/Sponsorships/hooks/useUpdateSponsorshipStatus.ts
import { useMutation } from '@tanstack/react-query';
import { updateSponsorshipStatus } from '../api/sponsorships.api.ts';
import { toast } from 'react-toastify';
import { getToastError } from '../../../../utils/helpers.ts';

export function useUpdateSponsorshipStatus() {
  return useMutation({
    mutationFn: updateSponsorshipStatus,
    onSuccess: () => toast.success('Sponsorship status updated.'),
    onError: (err) => toast.error(getToastError(err)),
  });
}
