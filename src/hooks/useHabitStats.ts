
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getUserHabits, getHabitCompletions } from '@/services/habitsService';

export interface HabitWithStats {
  id: string;
  name: string;
  category: string;
  description?: string;
  completions: Array<{
    date: string;
    count: number;
  }>;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number;
}

export const useHabitStats = () => {
  const { currentUser } = useAuth();
  
  return useQuery({
    queryKey: ['habitStats', currentUser?.uid],
    queryFn: async (): Promise<HabitWithStats[]> => {
      if (!currentUser) return [];
      
      const habits = await getUserHabits(currentUser.uid);
      
      const habitsWithStats = await Promise.all(
        habits.map(async (habit) => {
          const completions = await getHabitCompletions(currentUser.uid, habit.id);
          
          // Calculate stats
          const totalCompletions = completions.length;
          const completionsByDate = completions.reduce((acc, completion) => {
            acc[completion.completedAt] = completion.count;
            return acc;
          }, {} as Record<string, number>);
          
          // Calculate streaks
          const sortedDates = Object.keys(completionsByDate).sort();
          let currentStreak = 0;
          let longestStreak = 0;
          let tempStreak = 0;
          
          const today = new Date().toISOString().split('T')[0];
          let dateToCheck = new Date();
          
          // Calculate current streak
          while (dateToCheck >= new Date(habit.createdAt)) {
            const dateStr = dateToCheck.toISOString().split('T')[0];
            if (completionsByDate[dateStr]) {
              currentStreak++;
            } else if (dateStr !== today) {
              break;
            }
            dateToCheck.setDate(dateToCheck.getDate() - 1);
          }
          
          // Calculate longest streak
          for (const date of sortedDates) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          }
          
          // Calculate completion rate (last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const recentCompletions = completions.filter(
            c => new Date(c.completedAt) >= thirtyDaysAgo
          ).length;
          const completionRate = Math.round((recentCompletions / 30) * 100);
          
          return {
            id: habit.id,
            name: habit.name,
            category: habit.category,
            description: habit.description,
            completions: completions.map(c => ({
              date: c.completedAt,
              count: c.count,
            })),
            currentStreak,
            longestStreak,
            totalCompletions,
            completionRate,
          };
        })
      );
      
      return habitsWithStats;
    },
    enabled: !!currentUser,
  });
};
