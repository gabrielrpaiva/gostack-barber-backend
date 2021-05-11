import { container } from "tsyringe";
import DiskStorageProvider from "./StorageProvider/implementations/DiskStorageProvider";
import IStoregeProvider from "./StorageProvider/models/IStoregeProvider";

container.registerSingleton<IStoregeProvider>(
  "StorageProvider",
  DiskStorageProvider
);
