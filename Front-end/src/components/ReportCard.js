'use client'

import { faUser, faCalendar, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "dompurify";
import {getStatusClass} from "@/utils/status.utils";
import {useUser} from "@/context/UserContext";

export default function ReportCard({ title, id, location, description, date, status, status_id, user, onView, number_phone }) {

    const {userData} = useUser();
    const role = userData?.data?.role.role

    const safeHtml = DOMPurify.sanitize(description);

    return (
        <div className="flex flex-col md:flex-row md:justify-between items-start bg-white rounded-xl shadow-lg drop-shadow p-4 md:p-8 mb-4 gap-4">
            {/* Info section */}
            <div className="flex-1 w-full">
                <div className="flex flex-wrap text-sm text-gray-500 gap-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                    <div className="flex items-center gap-1 mb-2">
        <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ${getStatusClass(status_id)} ring-inset`}
        >
          {status}
        </span>
                    </div>
                </div>

                <div
                    className="text-sm text-gray-600 mb-3 line-clamp-3 prose"
                    dangerouslySetInnerHTML={{ __html: safeHtml }}
                />

                <div className="flex flex-col sm:flex-row flex-wrap text-sm text-gray-500 gap-2">
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser} /> <span>{user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faLocationDot} /> <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendar} /> <span>Dilaporkan pada {date}</span>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex md:flex-col flex-row items-center gap-2 md:items-end w-full md:w-auto justify-end">
                <button
                    onClick={() => onView(id)}
                    className="inline-flex items-center rounded-md bg-blue-800 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-900"
                >
                    <FontAwesomeIcon icon={faEye} size="lg" />
                </button>
                {['PUPR', 'KECAMATAN'].includes(role) && number_phone && (
                    <a
                        href={`https://wa.me/${number_phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-green-800"
                    >
                        <FontAwesomeIcon icon={faWhatsapp} size="xl" />
                    </a>
                )}
            </div>
        </div>
    );
}
