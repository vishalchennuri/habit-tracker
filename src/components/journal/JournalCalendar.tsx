
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEntry {
  date: string;
  content: string;
  mood: string;
}

interface JournalCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  journalEntries: JournalEntry[];
}

const JournalCalendar = ({ selectedDate, onDateSelect, journalEntries }: JournalCalendarProps) => {
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEntry = journalEntries.some(entry => entry.date === dateStr);
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      
      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(dateStr)}
          className={cn(
            "w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 relative",
            isSelected && "bg-blue-500 text-white shadow-md",
            !isSelected && isToday && "bg-blue-100 text-blue-600",
            !isSelected && !isToday && "hover:bg-gray-100",
            hasEntry && !isSelected && "bg-green-100 text-green-700"
          )}
        >
          {day}
          {hasEntry && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
          )}
        </button>
      );
    }
    
    return days;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar size={20} />
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays()}
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalCalendar;
