import type {LogEntry} from '../../lib/eventLog';

interface EventLogProps {
  entries: LogEntry[];
  emptyMessage?: string;
}

export const EventLog = ({entries, emptyMessage = 'SDK events will appear here as you use the builder.'}: EventLogProps) => {
  if (!entries.length) {
    return <p className="event-log-empty">{emptyMessage}</p>;
  }

  return (
    <div className="event-log" role="log" aria-live="polite">
      {entries.map(entry => (
        <div key={entry.id} className="event-log-entry">
          <span className="event-log-type">{entry.type}</span>
          <span className="event-log-time">{entry.timestamp.toLocaleTimeString()}</span>
          <p className="event-log-message">{entry.message}</p>
        </div>
      ))}
    </div>
  );
};
