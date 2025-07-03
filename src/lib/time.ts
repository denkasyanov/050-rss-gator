export function parseDuration(durationStr: string): number | undefined {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) return;

  if (match.length !== 3) return;

  const value = parseInt(match[1]!, 10);
  const unit = match[2]!;

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    default:
      return;
  }
}

export function formatDuration(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);

  let timeString = "";
  if (hours > 0) timeString += `${hours}h`;
  if (minutes > 0) timeString += `${minutes}m`;
  if (seconds > 0 || timeString === "") timeString += `${seconds}s`;

  return timeString;
}
