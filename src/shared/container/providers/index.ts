import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import { container } from "tsyringe";
import EtherealMailProvider from "./MailProvider/implemententions/EtherealMailProvider";
import HandlebarsMailTemplateProvider from "./MailTemplateProvider/implementations/HandlebarsMailTemplateProvider";
import IMailTemplateProvider from "./MailTemplateProvider/models/IMailTemplateProvider";
import DiskStorageProvider from "./StorageProvider/implementations/DiskStorageProvider";
import IStoregeProvider from "./StorageProvider/models/IStoregeProvider";

container.registerSingleton<IStoregeProvider>(
  "StorageProvider",
  DiskStorageProvider
);

container.registerSingleton<IMailTemplateProvider>(
  "MailTemplateProvider",
  HandlebarsMailTemplateProvider
);

container.registerInstance<IMailProvider>(
  "MailProvider",
  container.resolve(EtherealMailProvider)
);
