export const AlertInfo = ({ title, message, error = false }) => {
    return (
        <div className={`flex items-start justify-center text-center gap-3 p-4 rounded-md border ${ error ? 'text-red-800 border-red-200 bg-red-50 ' : 'text-blue-800 border-blue-200 bg-blue-50 '}`}>
            <div>
                <p className="font-semibold">{title || ""}</p>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
};