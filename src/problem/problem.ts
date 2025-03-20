import { Solver } from "../solver/solver";

export interface Constraint {
    variables: readonly string[];
    fn: (this: null, ...variables: number[]) => boolean;
}

export abstract class Problem<VariableDomain> {
    variables: Record<string, VariableDomain> = {};
    constraints: Constraint[] = [];

    constructor(public solver: Solver<VariableDomain>) {}

    addVariable(variableName: string, domain: VariableDomain) {
        this.variables[variableName] = domain;
    }

    removeVariable(variableName: string) {
        delete this.variables[variableName];
    }

    addConstraint<const VariableNames extends readonly string[]>(
        variables: VariableNames,
        constraintFunction: (this: null, ...variables: { [Name in keyof VariableNames]: number }) => boolean
    ): void {
        if (variables.length === 0) {
            return;
        }
        this.constraints.push({ variables, fn: constraintFunction as Constraint["fn"] });
    }

    getSingleSolution(): Record<string, number> {
        return this.solver.getSingleSolution(this);
    }

    getAllSolutions(): Record<string, number>[] {
        return this.solver.getAllSolutions(this);
    }
}
