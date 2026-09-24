import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Link2, List, ListOrdered, Redo2, Undo2 } from 'lucide-react';

interface TiptapEditorProps {
    value?: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function TiptapEditor({
    value = '',
    onChange,
    placeholder,
    className = '',
}: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-sky-600 underline hover:text-sky-800',
                },
            }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'min-h-[90px] px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_p.is-empty:first-child::before]:text-slate-400 [&_p.is-empty:first-child::before]:content-[attr(data-placeholder)] [&_p.is-empty:first-child::before]:float-left [&_p.is-empty:first-child::before]:pointer-events-none [&_strong]:font-bold [&_em]:italic [&_u]:underline [&_s]:line-through',
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            const html = currentEditor.getHTML();
            // If empty paragraph, emit empty string
            if (html === '<p></p>') {
                onChange('');
            } else {
                onChange(html);
            }
        },
    });

    // Sync external value changes if not focused
    useEffect(() => {
        if (!editor) return;
        const currentHtml = editor.getHTML();
        const incoming = value || '';
        if (incoming !== currentHtml && !editor.isFocused) {
            editor.commands.setContent(incoming, { emitUpdate: false });
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const setLink = () => {
        if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
            return;
        }

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt(
            'Masukkan tautan URL (contoh: https://...):',
            previousUrl,
        );

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    };

    return (
        <div
            className={`overflow-hidden rounded-lg border border-slate-200 transition-all focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100 ${className}`}
        >
            {/* Rich Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-2.5 py-1.5 select-none">
                <div className="flex items-center gap-1 text-slate-600">
                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        disabled={
                            !editor.can().chain().focus().toggleBold().run()
                        }
                        className={`cursor-pointer rounded px-2 py-1 text-xs font-bold transition-colors ${
                            editor.isActive('bold')
                                ? 'bg-sky-100 text-sky-800'
                                : 'text-slate-700 hover:bg-slate-200/80'
                        }`}
                        title="Tebal (Ctrl+B)"
                    >
                        B
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        disabled={
                            !editor.can().chain().focus().toggleItalic().run()
                        }
                        className={`cursor-pointer rounded px-2 py-1 font-serif text-xs italic transition-colors ${
                            editor.isActive('italic')
                                ? 'bg-sky-100 text-sky-800'
                                : 'text-slate-700 hover:bg-slate-200/80'
                        }`}
                        title="Miring (Ctrl+I)"
                    >
                        I
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                        disabled={
                            !editor
                                .can()
                                .chain()
                                .focus()
                                .toggleUnderline()
                                .run()
                        }
                        className={`cursor-pointer rounded px-2 py-1 text-xs underline transition-colors ${
                            editor.isActive('underline')
                                ? 'bg-sky-100 text-sky-800'
                                : 'text-slate-700 hover:bg-slate-200/80'
                        }`}
                        title="Garis bawah (Ctrl+U)"
                    >
                        U
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleStrike().run()
                        }
                        disabled={
                            !editor.can().chain().focus().toggleStrike().run()
                        }
                        className={`cursor-pointer rounded px-2 py-1 text-xs line-through transition-colors ${
                            editor.isActive('strike')
                                ? 'bg-sky-100 text-sky-800'
                                : 'text-slate-700 hover:bg-slate-200/80'
                        }`}
                        title="Coret (Ctrl+Shift+S)"
                    >
                        S
                    </button>

                    <div className="mx-1 h-3.5 w-px bg-slate-300" />

                    <button
                        type="button"
                        onClick={setLink}
                        className={`cursor-pointer rounded p-1 transition-colors ${
                            editor.isActive('link')
                                ? 'bg-sky-100 text-sky-800'
                                : 'text-slate-600 hover:bg-slate-200/80'
                        }`}
                        title="Tautan"
                    >
                        <Link2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        className={`cursor-pointer rounded p-1 transition-colors ${
                            editor.isActive('bulletList')
                                ? 'bg-sky-100 text-sky-800'
                                : 'text-slate-600 hover:bg-slate-200/80'
                        }`}
                        title="Daftar poin"
                    >
                        <List className="h-3.5 w-3.5" />
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                        className={`cursor-pointer rounded p-1 transition-colors ${
                            editor.isActive('orderedList')
                                ? 'bg-sky-100 text-sky-800'
                                : 'text-slate-600 hover:bg-slate-200/80'
                        }`}
                        title="Daftar nomor"
                    >
                        <ListOrdered className="h-3.5 w-3.5" />
                    </button>

                    <div className="mx-1 h-3.5 w-px bg-slate-300" />

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        className="cursor-pointer rounded p-1 text-slate-600 transition-colors hover:bg-slate-200/80 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        title="Urungkan (Ctrl+Z)"
                    >
                        <Undo2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        className="cursor-pointer rounded p-1 text-slate-600 transition-colors hover:bg-slate-200/80 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        title="Ulangi (Ctrl+Y)"
                    >
                        <Redo2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Tiptap Editor Content */}
            <div className="relative bg-white">
                {editor.isEmpty && placeholder && (
                    <div className="pointer-events-none absolute top-2.5 left-3.5 text-sm text-slate-400 select-none">
                        {placeholder}
                    </div>
                )}
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
