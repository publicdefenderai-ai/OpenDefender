import firstBatch from "./california-batch-one-corrections.json";
import secondBatch from "./california-batch-two-corrections.json";
import thirdBatch from "./california-batch-three-corrections.json";
import fourthBatch from "./california-batch-four-corrections.json";
import fifthBatch from "./california-batch-five-corrections.json";

import sixthBatch from "./california-batch-six-corrections.json";

/** Combined runtime corrections; each batch keeps its own historical evidence. */
export const CALIFORNIA_CHARGE_CORRECTIONS = [...firstBatch, ...secondBatch, ...thirdBatch, ...fourthBatch, ...fifthBatch, ...sixthBatch];
