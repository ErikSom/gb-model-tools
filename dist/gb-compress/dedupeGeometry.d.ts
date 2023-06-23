import { GBObject } from '../GBFormat';
/**
 * This will look through a gbObject and removed any duplicate models.
 * Saving out a model from maya with say 100 trees will save out 100 models even if the model is the same.
 * This function will would keep the first model and remove the 99 duplicates
 *
 * @param gbObject the gbObject to remove duplicates from
 */
export declare function dedupeGeometry(gbObject: GBObject): void;
