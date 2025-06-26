import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { useCreateHabit } from "@/hooks/useHabits";
import { format } from "date-fns";

const AddHabit = () => {
  const navigate = useNavigate();
  const createHabitMutation = useCreateHabit();
  
  const [habitData, setHabitData] = useState({
    name: "",
    description: "",
    category: "",
    frequency: "today" as "today" | "weekly" | "selected-date",
    color: "#3B82F6",
    selectedDays: [] as string[],
    selectedDate: null as Date | null,
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const weekdays = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  const handleDayToggle = (dayId: string) => {
    setHabitData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter(d => d !== dayId)
        : [...prev.selectedDays, dayId]
    }));
  };

  const handleFrequencyChange = (value: "today" | "weekly" | "selected-date") => {
    setHabitData(prev => ({
      ...prev,
      frequency: value,
      selectedDays: value === "weekly" ? prev.selectedDays : [],
      selectedDate: value === "selected-date" ? prev.selectedDate : null,
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setHabitData(prev => ({
      ...prev,
      selectedDate: date || null
    }));
    setIsCalendarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!habitData.name.trim()) {
      return;
    }

    // Validation for weekly frequency
    if (habitData.frequency === "weekly" && habitData.selectedDays.length === 0) {
      alert("Please select at least one day for weekly habits");
      return;
    }

    // Validation for selected date frequency
    if (habitData.frequency === "selected-date" && !habitData.selectedDate) {
      alert("Please select a date for your habit");
      return;
    }

    try {
      await createHabitMutation.mutateAsync({
        name: habitData.name,
        description: habitData.description,
        category: habitData.category,
        frequency: habitData.frequency,
        color: habitData.color,
        selectedDays: habitData.selectedDays,
        selectedDate: habitData.selectedDate,
        isActive: true,
      });
      
      navigate('/today');
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mr-2 p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Habit</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Your Habit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="habitName">Habit Name *</Label>
              <Input
                id="habitName"
                placeholder="e.g., Morning Meditation"
                value={habitData.name}
                onChange={(e) => setHabitData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What does this habit involve?"
                value={habitData.description}
                onChange={(e) => setHabitData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={habitData.category} 
                onValueChange={(value) => setHabitData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="creativity">Creativity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Frequency</Label>
              <Select 
                value={habitData.frequency} 
                onValueChange={handleFrequencyChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="selected-date">Selected Date</SelectItem>
                </SelectContent>
              </Select>

              {/* Weekly Days Selection */}
              {habitData.frequency === "weekly" && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                  <Label className="text-sm font-medium">Select days for weekly habit:</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {weekdays.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.id}
                          checked={habitData.selectedDays.includes(day.id)}
                          onCheckedChange={() => handleDayToggle(day.id)}
                        />
                        <Label htmlFor={day.id} className="text-sm font-normal">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {habitData.selectedDays.length > 0 && (
                    <div className="text-sm text-gray-600 mt-2">
                      Selected: {habitData.selectedDays.map(day => 
                        weekdays.find(w => w.id === day)?.label
                      ).join(", ")}
                    </div>
                  )}
                </div>
              )}

              {/* Date Picker */}
              {habitData.frequency === "selected-date" && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                  <Label className="text-sm font-medium">Select a specific date:</Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {habitData.selectedDate ? (
                          format(habitData.selectedDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={habitData.selectedDate || undefined}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {habitData.selectedDate && (
                    <div className="text-sm text-gray-600">
                      Habit scheduled for: {format(habitData.selectedDate, "EEEE, MMMM d, yyyy")}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              disabled={createHabitMutation.isPending}
            >
              {createHabitMutation.isPending ? 'Creating...' : 'Create Habit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddHabit;