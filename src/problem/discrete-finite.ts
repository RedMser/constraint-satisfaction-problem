import { Problem } from "./problem";

export type DiscreteFiniteProblemDomain = readonly number[];

export class DiscreteFiniteProblem extends Problem<DiscreteFiniteProblemDomain> {}
