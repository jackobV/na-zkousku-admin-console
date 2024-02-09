export interface timeSignatureInterface{
    day:string
    month:string
    hour:string
    minute:string
    second:string
}
export default function FormatDate(utcDateString: string): timeSignatureInterface {
    const date = new Date(utcDateString);
    // Get day and month. Note that getMonth() returns months from 0-11.
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Adding 1 to get months from 1-12.
    const hour = date.getUTCHours().toString().padStart(2, '0');
    const minute = date.getUTCMinutes().toString().padStart(2, '0');
    const second = date.getUTCSeconds().toString().padStart(2, '0');

    return {
        day:day,
        month:month,
        hour:hour,
        minute:minute,
        second:second,
    };
}
