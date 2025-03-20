import { Problem } from "../problem/problem";

export interface SolverOptions<VariableDomain> {
    problem: Problem<VariableDomain>;
    assignments: Record<string, number>;
    single: boolean;
}

export abstract class Solver<VariableDomain> {
    protected allAssignments: Record<string, number>[] = [];

    getSingleSolution(problem: Problem<VariableDomain>): Record<string, number> {
        const assignments = {};
        return this.solve({ problem, assignments, single: true }) ? assignments : {};
    }

    getAllSolutions(problem: Problem<VariableDomain>): Record<string, number>[] {
        const assignments = {};
        this.solve({ problem, assignments, single: false });
        return this.allAssignments;
    }

    protected abstract solve(options: SolverOptions<VariableDomain>): boolean;
}
