export const getStatusClass = (validationStatus) => {
    switch (validationStatus) {
        case 1: // Pending
            return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 ';
        case 2: // Rejected
            return 'bg-red-50 text-red-700 ring-red-600/10';
        case 3: // Validated by District
            return 'bg-blue-50 text-blue-700 ring-blue-700/10';
        case 4: // Validated by PUPR
            return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 ';
        case 5: // Validated by PUPR
            return 'bg-green-50 text-green-700 ring-green-600/20';
        case 6: // Validated by PUPR
            return 'bg-red-50 text-red-700 ring-red-600/10';
        case 7: // Validated by PUPR
            return 'bg-green-50 text-green-700 ring-green-600/20';
        default:
            return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    }
}