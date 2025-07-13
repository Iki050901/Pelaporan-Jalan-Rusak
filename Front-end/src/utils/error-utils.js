export const errorFormater = (e) => {
    if (e && typeof e === 'object') {
        const formatted = Object.entries(e)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join(" | ");
        return formatted
    } else {
        return e
    }
}