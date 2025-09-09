import dayjs from "dayjs";

export const FORMAT_DATE = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
export const dateRangeValidate = (dateRange: any) => {
    if (!dateRange) return undefined;
    const toJavaInstantMicro = (date: string | Date) => {
        const d = dayjs(date);
        const ms = d.millisecond().toString().padStart(3, '0');
        const base = d.format('YYYY-MM-DDTHH:mm:ss');
        return `${base}.${ms}000Z`;
    };
    const startTime = toJavaInstantMicro(dayjs(dateRange[0]).startOf('day').toDate());
    const endTime = toJavaInstantMicro(dayjs(dateRange[1]).endOf('day').toDate());
    return [startTime, endTime];
};

