
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";

interface JournalEntryEditorProps {
  entryText: string;
  onEntryTextChange: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const JournalEntryEditor = ({ entryText, onEntryTextChange, onSave, onCancel }: JournalEntryEditorProps) => {
  return (
    <div className="space-y-4">
      <Textarea
        value={entryText}
        onChange={(e) => onEntryTextChange(e.target.value)}
        placeholder="What's on your mind today? How did your habits go? What are you grateful for?"
        rows={6}
        className="resize-none"
      />
      <div className="flex gap-2">
        <Button
          onClick={onSave}
          className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
        >
          <Save size={16} className="mr-2" />
          Save Entry
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
};

export default JournalEntryEditor;
