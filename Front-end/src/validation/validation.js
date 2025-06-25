import {createReportValidation} from "@/validation/report.validation";

export const validate = (schema, data) => {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        allowUnknown: true,
    });

    if (error) {
        const errorMessages = {};
        error.details.forEach(detail => {
            errorMessages[detail.path[0]] = detail.message;
        });
        console.log(error);
        return { value: null, errors: errorMessages };
    }

    return { value, errors: {} };
};

export const validateForm = (data, setErrors, validation) => {
    const { errors } = validate(validation, data);
    setErrors(errors);
    return errors;
};

export const validateField = (name, value, validation) => {
    try {
        const fieldSchema = validation.extract(name);
        const { error } = fieldSchema.validate(value);
        return error ? error.details[0].message : null;
    } catch (e) {
        console.log("Validation extract error for", name, ":", e.message);
        return null;
    }
}

export const displayErrorForm = (field, errors, touched) => {
    const error = errors[field];

    if (!touched[field] || !error) return null;

    if (typeof error === "string") {
        return <p className="mt-1 text-sm text-red-500">{error}</p>;
    }

    if (Array.isArray(error)) {
        return error.map((err, idx) =>
            typeof err === "string" ? (
                <p key={idx} className="mt-1 text-sm text-red-500">{err}</p>
            ) : null
        );
    }
    return null;
};
