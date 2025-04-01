
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesSectionProps {
  notes: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function NotesSection({ notes, onChange }: NotesSectionProps) {
  return (
    <div>
      <Label htmlFor="notes" className="dark:text-gray-300">Notes</Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={onChange}
        placeholder="Enter additional notes or terms & conditions"
        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        rows={3}
      />
    </div>
  );
}
