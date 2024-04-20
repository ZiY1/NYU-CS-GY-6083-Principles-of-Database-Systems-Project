
// Generates a unique 16-digit account number.
export const generateAccountNumber = () => {
    const timestamp = Date.now().toString(); // Current timestamp as a unique base.
    const randomPadding = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit random number.
    return timestamp.substring(timestamp.length - 12) + randomPadding; // Concatenate to form 16 digits.
};

// Generates current date and time in MySQL datetime format.
export const getCurrentMySQLDateTime = () => {
    const date = new Date();
    const localOffset = date.getTimezoneOffset() * 60000; // Convert offset to milliseconds
    const localTime = new Date(date.getTime() - localOffset); // Adjust to local time
    return localTime.toISOString().slice(0, 19).replace('T', ' ');
};

