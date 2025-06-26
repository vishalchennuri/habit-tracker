
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JournalCalendar from "@/components/journal/JournalCalendar";
import JournalEntryDisplay from "@/components/journal/JournalEntryDisplay";
import JournalEntryEditor from "@/components/journal/JournalEntryEditor";

interface JournalEntry {
  date: string;
  content: string;
  mood: string;
}

const Journals = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isWriting, setIsWriting] = useState(false);
  const [entryText, setEntryText] = useState("");
  
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    {
      date: "2024-01-15",
      content: "Had a great day today! Completed all my habits and felt really productive. The morning meditation helped me stay focused throughout the day.",
      mood: "happy"
    },
    {
      date: "2024-01-14",
      content: "Struggled a bit with motivation today, but managed to push through. Sometimes consistency is about showing up even when you don't feel like it.",
      mood: "okay"
    }
  ]);

  const getCurrentEntry = () => {
    return journalEntries.find(entry => entry.date === selectedDate);
  };

  const handleSaveEntry = () => {
    const existingEntry = getCurrentEntry();
    const newEntry: JournalEntry = {
      date: selectedDate,
      content: entryText,
      mood: "happy" // Default mood, could be made selectable
    };

    if (existingEntry) {
      setJournalEntries(prev => 
        prev.map(entry => 
          entry.date === selectedDate ? newEntry : entry
        )
      );
    } else {
      setJournalEntries(prev => [...prev, newEntry]);
    }

    setIsWriting(false);
    setEntryText("");
  };

  const handleStartWriting = () => {
    const existingEntry = getCurrentEntry();
    setEntryText(existingEntry?.content || "");
    setIsWriting(true);
  };

  const handleCancelWriting = () => {
    setIsWriting(false);
    setEntryText("");
  };

  const selectedEntry = getCurrentEntry();

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Journal</h1>
        <p className="text-gray-600">Reflect on your daily journey</p>
      </div>

      <JournalCalendar
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        journalEntries={journalEntries}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
            {selectedEntry && (
              <Badge variant="outline" className="text-green-600">
                Entry exists
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isWriting ? (
            <JournalEntryDisplay
              selectedEntry={selectedEntry}
              onStartWriting={handleStartWriting}
            />
          ) : (
            <JournalEntryEditor
              entryText={entryText}
              onEntryTextChange={setEntryText}
              onSave={handleSaveEntry}
              onCancel={handleCancelWriting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Journals;
