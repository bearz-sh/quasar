
export interface IFileInfo 
{
    exists: boolean;

    length: number;

    physicalPath?: string;

    name: string;

    lastModified?: Date;

    isDirectory: boolean;

    createReadStream(): ReadableStream<Uint8Array>;
}

export interface IDirectoryContents extends AsyncIterable<IFileInfo>
{
    exitsts: boolean;
}

export interface IFileProvider
{
    getFileInfo(path: string): Promise<IFileInfo>;

    getDirectoryContents(path: string): Promise<IDirectoryContents>;
}