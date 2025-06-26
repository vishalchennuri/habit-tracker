
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHabitStats } from "@/hooks/useHabitStats";

const ViewStats = () => {
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);
  const { data: habitStats = [], isLoading } = useHabitStats();

  const generateCalendarDays = (habitId: string) => {
    const habit = habitStats.find(h => h.id === habitId);
    if (!habit) return [];

    const completionsByDate = habit.completions.reduce((acc, completion) => {
      acc[completion.date] = completion.count;
      return acc;
    }, {} as Record<string, number>);

    const days = [];
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (let d = startOfMonth; d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const completed = !!completionsByDate[dateStr];
      
      days.push(
        <div
          key={dateStr}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200",
            completed 
              ? "bg-green-500 text-white shadow-sm" 
              : "bg-gray-100 text-gray-400"
          )}
        >
          {d.getDate()}
        </div>
      );
    }
    
    return days;
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-20 max-w-md mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Habit Statistics</h1>
        <p className="text-gray-600">Track your progress and consistency</p>
      </div>

      <div className="space-y-4">
        {habitStats.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">No habit data yet!</p>
              <p className="text-sm text-gray-400">Start tracking your habits to see statistics.</p>
            </CardContent>
          </Card>
        ) : (
          habitStats.map((habit) => (
            <Card key={habit.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{habit.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {habit.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {habit.completionRate}%
                    </div>
                    <div className="text-xs text-gray-500">completion</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      {habit.currentStreak}
                    </div>
                    <div className="text-xs text-gray-500">Current Streak</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-purple-600">
                      {habit.longestStreak}
                    </div>
                    <div className="text-xs text-gray-500">Longest Streak</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">
                      {habit.totalCompletions}
                    </div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedHabit(
                        expandedHabit === habit.id ? null : habit.id
                      )}
                      className="p-1"
                    >
                      {expandedHabit === habit.id ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendarDays(habit.id)}
                  </div>
                </div>

                {expandedHabit === habit.id && (
                  <div className="pt-3 border-t">
                    <div className="text-sm font-medium mb-2">Habit Details</div>
                    <div className="text-xs text-gray-600 mb-3">
                      {habit.description || 'No description provided'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total completions: {habit.totalCompletions}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewStats;
