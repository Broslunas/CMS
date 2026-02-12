
import { useEffect } from "react";
import { DateTimePicker } from "./DateTimePicker";

export function ValidatedDateField({ fieldKey, value, onUpdate, onDelete }: { fieldKey: string, value: string, onUpdate: (k: string, v: any) => void, onDelete: (k: string) => void }) {
    useEffect(() => {
        try {
            const dateObj = new Date(value);
            if (!isNaN(dateObj.getTime())) {
                const iso = dateObj.toISOString();
                if (value !== iso) {
                    onUpdate(fieldKey, iso);
                }
            }
        } catch (e) {
            // If invalid date, do nothing, let user edit
        }
    }, [value, fieldKey, onUpdate]);

    return (
        <div key={fieldKey}>
             <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground capitalize">{fieldKey} <span className="text-muted-foreground text-xs font-normal">(Date)</span></label>
                <button onClick={() => onDelete(fieldKey)} className="text-muted-foreground hover:text-destructive transition-colors p-1" title={`Delete field ${fieldKey}`}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
              <DateTimePicker
                value={value}
                onChange={(newIso) => onUpdate(fieldKey, newIso)}
              />
        </div>
    );
}
