'use client'

import { faUser, faCalendar, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWhatsapp} from "@fortawesome/free-brands-svg-icons";

export default function ReportCard({ title, location, description, date, status, user, onView }) {
    return (
        <div className="flex justify-between items-start bg-white rounded-xl shadow-md p-8 mb-4">
            {/* Info section */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{description}</p>
                <div className="flex flex-wrap text-sm text-gray-500 gap-4">
                    <div className="flex items-center gap-1">
                        <span
                            className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-green-600/20 ring-inset">{status}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser}/> <span>{user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faLocationDot} /> <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendar}/> <span>Dilaporkan pada {date}</span>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onView}
                    className="border border-gray-300 text-sm px-3 py-1.5 rounded hover:bg-gray-100"
                >
                    👁️ Lihat
                </button>
                <button className="bg-green-400 text-sm px-3 py-2 rounded-full hover:bg-green-800">
                    <a href={`https://wa.me/${user.number_phone}`} className="text-white font-medium"><FontAwesomeIcon icon={faWhatsapp} size="xl" /></a>
                </button>
            </div>
        </div>
    );
}
