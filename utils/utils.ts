export function formatDateToFullOptions(isoDateString: string): string {
    if (!isoDateString) return "01 Jan";
    const date = new Date(isoDateString);
    const day = date.getDate();
    const monthNames: string[] = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

export function convertBytesToMB(bytes: number): string {
  if (!bytes || typeof bytes !== 'number' || isNaN(bytes)) {
    return "N/A";
  }
  const mb = bytes / (1024 * 1024);
  return Number(mb.toFixed(2)).toString();
}

export function formatDate(isoDateString: string): string {
    if (!isoDateString) return "01 Jan";
    const date = new Date(isoDateString);
    const day = date.getDate();
    const monthNames: string[] = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];

    return `${day} ${month}`;
}