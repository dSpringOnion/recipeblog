'use client';

import { useState, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Timer,
  ChefHat,
  Type,
  Palette
} from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your recipe instructions...",
  className 
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = useCallback((format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    
    switch (format) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        break;
      case 'numbered-list':
        newText = selectedText 
          ? selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')
          : '\n1. Step one\n2. Step two\n3. Step three';
        break;
      case 'bullet-list':
        newText = selectedText 
          ? selectedText.split('\n').map(line => `- ${line}`).join('\n')
          : '\n- First item\n- Second item\n- Third item';
        break;
      case 'timer':
        newText = `⏲️ **${selectedText || '10 minutes'}**`;
        break;
      case 'temperature':
        newText = `🌡️ **${selectedText || '350°F (175°C)'}**`;
        break;
      case 'heading':
        newText = `## ${selectedText || 'Section Title'}`;
        break;
      default:
        return;
    }
    
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);
    
    // Set cursor position after insert
    setTimeout(() => {
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  }, [value, onChange]);

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^## (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^(\d+)\. (.*$)/gm, '<div class="flex items-start gap-2 mb-2"><span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">$1</span><span>$2</span></div>')
      .replace(/^- (.*$)/gm, '<div class="flex items-start gap-2 mb-1"><span class="text-gray-400 mt-1">•</span><span>$1</span></div>')
      .replace(/⏲️/g, '<span class="inline-flex items-center gap-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z"/></svg></span>')
      .replace(/🌡️/g, '<span class="inline-flex items-center gap-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v6a6 6 0 1012 0V8a6 6 0 00-6-6z"/></svg></span>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={cn('border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Text Formatting Group */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-2 hidden sm:inline">
              Text:
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('bold')}
              className="h-8 gap-1 px-2"
              title="Bold (Ctrl+B)"
            >
              <Bold className="h-3 w-3" />
              <span className="text-xs hidden lg:inline">Bold</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('italic')}
              className="h-8 gap-1 px-2"
              title="Italic (Ctrl+I)"
            >
              <Italic className="h-3 w-3" />
              <span className="text-xs hidden lg:inline">Italic</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('heading')}
              className="h-8 gap-1 px-2"
              title="Heading"
            >
              <Type className="h-3 w-3" />
              <span className="text-xs hidden lg:inline">Title</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block" />

          {/* Lists Group */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-2 hidden sm:inline">
              Lists:
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('numbered-list')}
              className="h-8 gap-1 px-2"
              title="Numbered Steps"
            >
              <ListOrdered className="h-3 w-3" />
              <span className="text-xs hidden lg:inline">Steps</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('bullet-list')}
              className="h-8 gap-1 px-2"
              title="Bullet List"
            >
              <List className="h-3 w-3" />
              <span className="text-xs hidden lg:inline">Bullets</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block" />

          {/* Recipe Tools Group */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-2 hidden sm:inline">
              Recipe:
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('timer')}
              className="h-8 gap-1 px-2"
              title="Add Timer"
            >
              <Timer className="h-3 w-3" />
              <span className="text-xs hidden lg:inline">Timer</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting('temperature')}
              className="h-8 gap-1 px-2"
              title="Add Temperature"
            >
              <ChefHat className="h-3 w-3" />
              <span className="text-xs hidden lg:inline">Temp</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block" />

          {/* Preview Toggle */}
          <Button
            variant={isPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="h-8 px-3 gap-1"
            title="Toggle Preview Mode"
          >
            <Palette className="h-3 w-3" />
            <span className="text-xs">{isPreview ? 'Edit' : 'Preview'}</span>
          </Button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="p-4 min-h-[200px] bg-white dark:bg-gray-900 prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[200px] p-4 border-0 outline-none resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
          />
        )}
      </div>

      {/* Helper Text */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex flex-wrap gap-4">
          <span>**bold** for emphasis</span>
          <span>*italic* for emphasis</span>
          <span>## for headings</span>
          <span>Use toolbar for timers & temps</span>
        </div>
      </div>
    </div>
  );
}