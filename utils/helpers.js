const transformDateTimeForDb = (timeStamp) => {
    const date = new Date(timeStamp);

    const YYYY = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const DD = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    const dbDateTime = `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
    return dbDateTime;
}

export {
    transformDateTimeForDb
};
