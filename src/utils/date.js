export function getTodayAsOfficeDbFormat() {
    const today = new Date();
    return  getDateInDbFormat(today);
}

export function getDateInDbFormat(date) {
    const day =  date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const month =  date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    return `${date.getFullYear()}-${month}-${day}`
}

export const TODAY = new Date();
