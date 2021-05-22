import uploadConfig from "@config/upload";
import path from "path";
import fs from "fs";
import IStoregeProvider from "../models/IStoregeProvider";

class FakeStorageProvider implements IStoregeProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }
  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(
      (storageFile) => storageFile === file
    );

    this.storage.slice(findIndex, 1);
  }
}

export default FakeStorageProvider;
