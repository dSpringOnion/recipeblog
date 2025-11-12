'use client';

import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload, X, Image, Video, File, Camera, Link as LinkIcon, Star } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface FileWithPreview extends File {
  preview?: string;
}

interface FileUploadProps {
  onFileSelect: (files: FileWithPreview[]) => void;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  maxSize?: number;
  className?: string;
  multiple?: boolean;
}

export function FileUpload({
  onFileSelect,
  maxFiles = 1,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    'video/*': ['.mp4', '.mov', '.avi', '.mkv']
  },
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  multiple = false
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setError('');

    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => 
        Array.from(file.errors).map((error) => error.message).join(', ')
      );
      setError(errors.join('; '));
      return;
    }

    const filesWithPreview = acceptedFiles.map(file => {
      const fileWithPreview = Object.assign(file, {
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      });
      return fileWithPreview;
    });

    if (!multiple) {
      setUploadedFiles(filesWithPreview);
      onFileSelect(filesWithPreview);
    } else {
      const newFiles = [...uploadedFiles, ...filesWithPreview];
      if (newFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      setUploadedFiles(newFiles);
      onFileSelect(newFiles);
    }
  }, [uploadedFiles, maxFiles, multiple, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
    maxFiles
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFileSelect(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors',
          isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          uploadedFiles.length > 0 && !multiple && 'hidden'
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isDragActive ? 'Drop files here' : 'Upload media'}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Drag and drop files here, or click to browse
          </p>
          <div className="text-xs text-gray-400">
            Supports: JPG, PNG, GIF, MP4, MOV (max {Math.round(maxSize / 1024 / 1024)}MB)
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded text-red-700 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Uploaded Files - Gallery View */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          {/* File Counter */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              📷 Photos & Videos ({uploadedFiles.length}/{maxFiles})
            </p>
            <p className="text-xs text-gray-500">
              First image is your cover photo
            </p>
          </div>

          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="relative group aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all"
              >
                {/* Image/Video Preview */}
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                )}

                {/* Cover Badge */}
                {index === 0 && (
                  <Badge className="absolute top-2 left-2 bg-blue-500 text-white border-0 shadow-lg">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    COVER
                  </Badge>
                )}

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 h-7 w-7 p-0 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* File Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white truncate font-medium">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-300">
                    {(file.size / 1024 / 1024).toFixed(1)}MB
                  </p>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            {multiple && uploadedFiles.length < maxFiles && (
              <div
                {...getRootProps()}
                className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all flex flex-col items-center justify-center gap-2"
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 text-gray-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center px-2">
                  Add More
                </p>
              </div>
            )}
          </div>

          {/* Drag to reorder hint */}
          {multiple && uploadedFiles.length > 1 && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
              💡 Tip: Delete and re-upload to change the cover photo
            </p>
          )}
        </div>
      )}
    </div>
  );
}