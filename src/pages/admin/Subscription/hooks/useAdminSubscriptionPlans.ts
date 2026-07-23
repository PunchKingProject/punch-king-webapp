import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFetch } from '../../../../Axios.ts'; 

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

export type SubscriptionPlan = {
  id?: number | string;
  name: string;
  price: number | string;
  duration: string;
  description: string;
  status?: string;
};

// ----------------------------------------------------------------------
// GET ALL PLANS
// ----------------------------------------------------------------------

export const useGetAdminSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['admin-subscription-plans'],
    queryFn: async () => {
      // ⬇️ FIXED TO MATCH GO BACKEND ⬇️
      const response = await customFetch.get('/sub/plans');
      return response.data;
    },
  });
};

// ----------------------------------------------------------------------
// CREATE PLAN
// ----------------------------------------------------------------------

export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlan: SubscriptionPlan) => {
      // ⬇️ FIXED TO MATCH GO BACKEND ⬇️
      const response = await customFetch.post('/sub/plans', newPlan);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscription-plans'] });
    },
  });
};

// ----------------------------------------------------------------------
// UPDATE PLAN
// ----------------------------------------------------------------------

export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updatedData }: SubscriptionPlan) => {
      // ⬇️ FIXED TO MATCH GO BACKEND ⬇️
      const response = await customFetch.put(`/sub/plans/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscription-plans'] });
    },
  });
};

// ----------------------------------------------------------------------
// DELETE PLAN
// ----------------------------------------------------------------------

export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      // ⬇️ FIXED TO MATCH GO BACKEND ⬇️
      const response = await customFetch.delete(`/sub/plans/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscription-plans'] });
    },
  });
};