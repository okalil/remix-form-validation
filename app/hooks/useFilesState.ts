import { useState } from 'react';

export function useFilesState() {
  const [files, setFiles] = useState<(File & { id: string })[]>([]);

  const appendFiles = (fileList: FileList | null) => {
    if (fileList instanceof FileList)
      setFiles(_files => [
        ..._files,
        ...Array.from(fileList, (f: any) => {
          f.id = Math.random().toString(36);
          return f;
        }),
      ]);
  };

  const deleteFile = (id: string) => {
    setFiles(_files => _files.filter(f => f.id !== id));
  };

  return { files, appendFiles, deleteFile };
}
