type MonitoringValue = string | number | boolean | null | undefined;

type MonitoringContext = Record<string, MonitoringValue>;

function sanitizeContext(context: MonitoringContext) {
  return Object.fromEntries(
    Object.entries(context).filter(([, value]) => value !== undefined)
  );
}

export function logInfo(event: string, context: MonitoringContext = {}) {
  console.info(
    JSON.stringify({
      level: "info",
      event,
      ...sanitizeContext(context),
    })
  );
}

export function logError(
  event: string,
  error: unknown,
  context: MonitoringContext = {}
) {
  console.error(
    JSON.stringify({
      level: "error",
      event,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...sanitizeContext(context),
    })
  );
}
