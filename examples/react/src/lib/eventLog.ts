export interface LogEntry {
  id: string;
  timestamp: Date;
  type: string;
  message: string;
  detail?: unknown;
}

export const createLogEntry = (type: string, message: string, detail?: unknown): LogEntry => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  timestamp: new Date(),
  type,
  message,
  detail,
});
