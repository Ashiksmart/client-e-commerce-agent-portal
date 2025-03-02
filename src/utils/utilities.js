export const checkFilterObj = (data) => {
    const details = data.details;

    for (const key in details) {
        if (details.hasOwnProperty(key)) {
            const value = details[key];

            if (value === undefined || value === null || value === "") {
                delete details[key];
            }
        }
    }
    if (details && Object.keys(details).length === 0) {
        delete data.details;
    }

    return data;
}
