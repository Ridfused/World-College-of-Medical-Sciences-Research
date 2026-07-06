import React, { useState } from 'react';
import { Download, Eye, X, FileText } from 'lucide-react';
// @ts-ignore
import warningImg from '../assets/images/attendance_warning_notice_final_1782768460286.jpg';
// @ts-ignore
import hostelImg from '../assets/images/hostel_rules_official_1782767626239.jpg';

interface Document {
  slNo: number;
  name: string;
  type: string;
  course: string;
  termSemester: string;
  userType: string;
  uploadedDate: string;
  uploadedBy: string;
  imageSrc: string;
  fileName: string;
}

export default function DocumentDownload() {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const documents: Document[] = [
    {
      slNo: 1,
      name: 'Warning regarding Non attendance- MBBS 3rd Prof. 1',
      type: 'NOTICE',
      course: 'MBBS',
      termSemester: '',
      userType: 'ALL Students',
      uploadedDate: '02/09/2025',
      uploadedBy: 'DINESH KUMAR',
      imageSrc: warningImg,
      fileName: 'Attendance_Warning_Notice_MBBS_3rd_Prof.jpg'
    },
    {
      slNo: 2,
      name: 'Hostel Rules for UG',
      type: 'Hostel Rules',
      course: 'MBBS',
      termSemester: '',
      userType: 'ALL',
      uploadedDate: '11/04/2025',
      uploadedBy: 'Swati',
      imageSrc: hostelImg,
      fileName: 'Hostel_Rules_for_UG.jpg'
    }
  ];

  const triggerDownload = async (doc: Document) => {
    try {
      const response = await fetch(doc.imageSrc);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      alert('Unable to download the document image. Please try again.');
    }
  };

  return (
    <div className="space-y-6" id="document-download-container">
      {/* Top Banner (As seen in the shared image) */}
      <div className="bg-[#486b73] text-white px-4 py-3 rounded-t-md font-medium text-sm shadow-sm">
        Document Download
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-b-md shadow-sm overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs min-w-[900px]">
          <thead>
            <tr className="bg-[#124d44] text-white text-[11px] uppercase tracking-wider font-semibold">
              <th className="px-3 py-3 border border-slate-300 text-center w-12 font-bold">Sl.No</th>
              <th className="px-4 py-3 border border-slate-300 text-left font-bold">Document Name</th>
              <th className="px-3 py-3 border border-slate-300 text-left font-bold">Document Type</th>
              <th className="px-3 py-3 border border-slate-300 text-center font-bold">Course Name</th>
              <th className="px-3 py-3 border border-slate-300 text-center font-bold">Term/Semester</th>
              <th className="px-3 py-3 border border-slate-300 text-center font-bold">User Type</th>
              <th className="px-3 py-3 border border-slate-300 text-center font-bold">Document Uploaded Date</th>
              <th className="px-3 py-3 border border-slate-300 text-left font-bold">Document Uploaded By</th>
              <th className="px-3 py-3 border border-slate-300 text-center font-bold w-24">Download</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.slNo} className="hover:bg-slate-50 transition-colors border-b border-slate-200 text-slate-800 font-medium">
                <td className="px-3 py-3.5 border border-slate-200 text-center font-bold text-slate-500">
                  {doc.slNo}
                </td>
                <td className="px-4 py-3.5 border border-slate-200 font-semibold text-[13px] text-slate-700 max-w-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#124d44] shrink-0" />
                    <span>{doc.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3.5 border border-slate-200 text-slate-600 font-medium uppercase text-[10px]">
                  {doc.type}
                </td>
                <td className="px-3 py-3.5 border border-slate-200 text-center text-slate-600">
                  {doc.course}
                </td>
                <td className="px-3 py-3.5 border border-slate-200 text-center text-slate-400">
                  {doc.termSemester || '-'}
                </td>
                <td className="px-3 py-3.5 border border-slate-200 text-center text-slate-600 font-medium text-[11px]">
                  {doc.userType}
                </td>
                <td className="px-3 py-3.5 border border-slate-200 text-center font-mono text-slate-600">
                  {doc.uploadedDate}
                </td>
                <td className="px-3 py-3.5 border border-slate-200 text-slate-600">
                  {doc.uploadedBy}
                </td>
                <td className="px-3 py-3.5 border border-slate-200 text-center font-bold">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      title="Preview Document"
                      className="text-slate-500 hover:text-[#124d44] transition-colors p-1 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => triggerDownload(doc)}
                      className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer focus:outline-none flex items-center gap-0.5"
                    >
                      DownLoad
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#124d44] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide line-clamp-1">{selectedDoc.name}</span>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 bg-slate-50 overflow-y-auto flex-1 flex items-center justify-center">
              <img
                src={selectedDoc.imageSrc}
                alt={selectedDoc.name}
                className="max-h-[60vh] object-contain border border-slate-200 shadow-md rounded"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500">Uploaded by {selectedDoc.uploadedBy} on {selectedDoc.uploadedDate}</span>
              <button
                onClick={() => {
                  triggerDownload(selectedDoc);
                  setSelectedDoc(null);
                }}
                className="px-4 py-2 bg-[#124d44] text-white hover:bg-[#0a2e29] font-bold uppercase tracking-wider rounded shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> DownLoad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
