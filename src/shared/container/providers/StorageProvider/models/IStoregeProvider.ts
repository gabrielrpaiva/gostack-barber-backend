export default interface IStoregeProvider {
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
