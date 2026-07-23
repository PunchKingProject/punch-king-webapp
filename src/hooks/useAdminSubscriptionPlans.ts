import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Adjust this import path based on where your Axios instance is actually located
import axiosInstance from '../Axios.ts'; 

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
      // Replace '/admin/subscription-plans' with your actual Golang backend endpoint
      const response = await axiosInstance.get('/admin/subscription-plans');
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
      const response = await axiosInstance.post('/admin/subscription-plans', newPlan);
      return response.data;
    },
    onSuccess: () => {
      // Automatically refresh the table data when a new plan is created
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
      const response = await axiosInstance.put(`/admin/subscription-plans/${id}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      // Automatically refresh the table data after an edit
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
      const response = await axiosInstance.delete(`/admin/subscription-plans/${id}`);
      return response.data;
    },
    onSuccess: () => {
      // Automatically refresh the table data after a deletion
      queryClient.invalidateQueries({ queryKey: ['admin-subscription-plans'] });
    },
  });
};