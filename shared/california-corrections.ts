import fourthBatch from "./california-batch-four-corrections.json";
import firstBatch from "./california-batch-one-corrections.json";
import thirdBatch from "./california-batch-three-corrections.json";
import secondBatch from "./california-batch-two-corrections.json";

/** Combined runtime corrections; each batch keeps its own historical evidence. */
export const CALIFORNIA_CHARGE_CORRECTIONS = [...firstBatch, ...secondBatch, ...thirdBatch, ...fourthBatch];
