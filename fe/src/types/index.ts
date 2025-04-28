export enum StepType {
    CreateFile,
    CreateFolder,
    EditFile,
    DeleteFile,
    RunScript,
}

export interface Step {
    id: number;
    title: string;
    description: string;
    type: StepType;
    status : 'pending' | 'in-progress' | 'completed';
    code?: string;
    path?: string;
    name: string;
}

export interface Project {
    prompt: string;
    steps: Step[];
}

export interface File {
    name: string;
    type: 'file' | 'folder';
    content?: string;
    children?: File[];
    path: string;
}

export interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'folder';
    content?: string; 
    children?: FileItem[]; 
  }