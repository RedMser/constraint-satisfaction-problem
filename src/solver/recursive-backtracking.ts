import { DiscreteFiniteProblemDomain } from "../problem/discrete-finite";
import { Solver, SolverOptions } from "./solver";

export class RecursiveBacktrackingSolver extends Solver<DiscreteFiniteProblemDomain> {
    protected override solve({ problem, assignments, single }: SolverOptions<DiscreteFiniteProblemDomain>) {
        if (Object.keys(assignments).length === Object.keys(problem.variables).length) {
            if (!single) {
                this.allAssignments.push({ ...assignments });
            }
            return true;
        }

        // Find the next variable.
        let nextVar: string | undefined;
        for (const v in problem.variables) {
            let found = false;
            for (const a in assignments) {
                if (v === a) {
                    found = true;
                }
            }
            if (!found) {
                nextVar = v;
                break;
            }
        }

        const checkAssignment = (nextVar: string, val: number) => {
            assignments[nextVar] = val;
            for (const c in problem.constraints) {
                const args = [];
                let valid = true;

                // Try to build the argument list for this constraint...
                for (const k in problem.constraints[c].variables) {
                    const fp = problem.constraints[c].variables[k];
                    if (assignments[fp] !== undefined) {
                        args.push(assignments[fp]);
                    } else {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    // We can check it, so check it.
                    if (!problem.constraints[c].fn.apply(null, args)) {
                        delete assignments[nextVar];
                        return false;
                    }
                }
            }
            delete assignments[nextVar];
            return true;
        };

        if (nextVar !== undefined) {
            // Try the values in its domain.
            const domain = problem.variables[nextVar];
            for (const j in domain) {
                const val = domain[j];
                if (checkAssignment(nextVar, val)) {
                    assignments[nextVar] = val;
                    if (this.solve({ problem, assignments, single })) {
                        if (single) {
                            return true;
                        }
                    }
                    delete assignments[nextVar];
                }
            }
        }
        return false;
    }
}
