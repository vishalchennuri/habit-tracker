
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserHabits, 
  createHabit, 
  updateHabit, 
  deleteHabit,
  markHabitComplete,
  getTodayCompletions,
  Habit 
} from '@/services/habitsService';
import { toast } from '@/hooks/use-toast';

export const useHabits = () => {
  const { currentUser } = useAuth();
  
  return useQuery({
    queryKey: ['habits', currentUser?.uid],
    queryFn: () => getUserHabits(currentUser!.uid),
    enabled: !!currentUser,
  });
};

export const useCreateHabit = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (habitData: Omit<Habit, 'id' | 'userId' | 'createdAt'>) => 
      createHabit(currentUser!.uid, habitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "Success!",
        description: "Your habit has been created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating habit:', error);
      toast({
        title: "Error",
        description: "Failed to create habit. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateHabit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ habitId, updates }: { habitId: string; updates: Partial<Habit> }) =>
      updateHabit(habitId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
    onError: (error) => {
      console.error('Error updating habit:', error);
      toast({
        title: "Error",
        description: "Failed to update habit. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (habitId: string) => deleteHabit(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting habit:', error);
      toast({
        title: "Error",
        description: "Failed to delete habit. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useMarkHabitComplete = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ habitId, count = 1 }: { habitId: string; count?: number }) =>
      markHabitComplete(currentUser!.uid, habitId, count),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['todayCompletions'] });
      toast({
        title: "Great job!",
        description: "Habit marked as complete!",
      });
    },
    onError: (error) => {
      console.error('Error marking habit complete:', error);
      toast({
        title: "Error",
        description: "Failed to mark habit as complete. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useTodayCompletions = () => {
  const { currentUser } = useAuth();
  
  return useQuery({
    queryKey: ['todayCompletions', currentUser?.uid],
    queryFn: () => getTodayCompletions(currentUser!.uid),
    enabled: !!currentUser,
  });
};
