
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit3 } from "lucide-react";

interface JournalEntry {
  date: string;
  content: string;
  mood: string;
}

interface JournalEntryDisplayProps {
  selectedEntry: JournalEntry | undefined;
  onStartWriting: () => void;
}

const JournalEntryDisplay = ({ selectedEntry, onStartWriting }: JournalEntryDisplayProps) => {
  return (
    <div className="space-y-4">
      {selectedEntry ? (
        <div className="space-y-3">
          <p className="text-gray-700 leading-relaxed">
            {selectedEntry.content}
          </p>
          <div className="flex justify-between items-center pt-3 border-t">
            <Badge variant="secondary">
              {selectedEntry.mood}
            </Badge>
            <Button
              onClick={onStartWriting}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit3 size={14} />
              Edit Entry
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No entry for this date</p>
          <Button
            onClick={onStartWriting}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            <Edit3 size={16} className="mr-2" />
            Write Journal Entry
          </Button>
        </div>
      )}
    </div>
  );
};

export default JournalEntryDisplay;
