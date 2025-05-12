import { userDataManager } from "../data";
import { WordGroupManager } from "./WordGroupManager";

export const wordGroupManager = new WordGroupManager(userDataManager.getData().currentBook);
