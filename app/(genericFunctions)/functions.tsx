export default function FormatDate(utcDateString: string): string {
    const date = new Date(utcDateString);
    // Get day and month. Note that getMonth() returns months from 0-11.
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Adding 1 to get months from 1-12.
    return `${day}.${month}`;
}
