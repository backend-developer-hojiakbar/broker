import React, { useRef } from 'react';
import { useTranslation } from '../../context/I18nContext';

interface FileUploadProps {
    label: string;
    onFilesChange: (files: File[]) => void;
    files: File[];
    disabled?: boolean;
    multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onFilesChange, files, disabled, multiple = false }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
        onFilesChange(selectedFiles);
    };

    const handleContainerClick = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const handleClearFiles = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent opening file dialog
        onFilesChange([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the input
        }
    }

    const acceptedFormats = ".html,.htm,.pdf,.docx";
    const fileCount = files.length;

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">{label}</label>
            <div
                className={`relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-all duration-300 group ${
                    disabled
                        ? 'bg-slate-800/30 border-slate-700 cursor-not-allowed'
                        : 'border-slate-700 bg-slate-800/50 hover:border-teal-400/70 hover:bg-slate-800 cursor-pointer'
                }`}
                onClick={handleContainerClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept={acceptedFormats}
                    disabled={disabled}
                    multiple={multiple}
                />
                 <div className="relative z-10 w-full text-center">
                    {fileCount > 0 && !disabled ? (
                        <div className="flex items-center justify-between w-full text-sm text-slate-300">
                           <div className="flex items-center truncate">
                             <svg className="w-5 h-5 mr-2 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                             <span className="truncate pr-2 font-medium">
                                {fileCount === 1 ? files[0].name : t('form.file.multipleSelected', { count: fileCount })}
                             </span>
                           </div>
                            <button onClick={handleClearFiles} className="p-1 rounded-full hover:bg-slate-600 transition-colors flex-shrink-0" aria-label="Clear file">
                                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                        </div>
                    ) : (
                         <div className="flex flex-col items-center">
                            <svg className="w-10 h-10 text-slate-500 group-hover:text-teal-400 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-2 text-sm text-slate-400">
                                <span className="font-semibold text-teal-400">{t('form.file.clickToUpload')}</span> {t('form.file.dragAndDrop')}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{t('form.file.supportedTypes')}</p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};