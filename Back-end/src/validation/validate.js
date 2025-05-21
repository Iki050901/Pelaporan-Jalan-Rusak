import {ResponseError} from "../error/response-error.js";

const formatJoiErrors = (error) => {
    return error.details.reduce((acc, curr) => {
        const field = curr.path[0];

        if (!acc[field]) {
            acc[field] = [];
        }

        const cleanedMessage = curr.message.replace(/^"[^"]+" /, '');

        acc[field].push(cleanedMessage); // Push the cleaned error message
        return acc;
    }, {});
};


const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
    });
    if (result.error) {
        const formattedErrors = formatJoiErrors(result.error)
        throw new ResponseError(400, formattedErrors);
    } else {
        return result.value;
    }
}

export {
    validate
}