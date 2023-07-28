import { IJob, IJobBuilder, IJobCollection } from "./interfaces.ts";

export class JobCollection implements IJobCollection
{
    #jobs: string[] = [];
    #map: Map<string, IJob> = new Map();


    get size(): number {
        return this.#jobs.length;
    }

    at(index: number): IJob {
        const id = this.#jobs[index];
        return this.#map.get(id)!;
    }
    add(job: IJob): IJobBuilder {
        if(this.#map.has(job.id))
            throw new Error(`Task '${job.id}' already exists`);

        this.#jobs.push(job.id);
        this.#map.set(job.id, job);
        return {
            set(attributes: Partial<Omit<IJob, 'id' | 'run'>>): IJobBuilder {
                for(const key in attributes)
                {
                    if(key === 'id' || key === 'run')
                        continue;

                    // deno-lint-ignore no-explicit-any
                    (job as any)[key] = (attributes as any)[key];
                }

                return this as IJobBuilder;
            },
            description(description: string): IJobBuilder {
                job.description = description;
                return this as IJobBuilder;
            },
            timeout(timeout: number): IJobBuilder {
                job.timeout = timeout;
                return this as IJobBuilder;
            },
            name(name: string): IJobBuilder {
                job.name = name;
                return this as IJobBuilder;
            }
        }
    }
   
    get(id: string): IJob | undefined {
        return this.#map.get(id);
    }
    has(id: string): boolean {
        return this.#map.has(id);
    }
    addRange(jobs: Iterable<IJob>): void {
        for(const job of jobs)
            this.add(job);
    }

    [Symbol.iterator](): Iterator<IJob> {
        return this.#map.values();
    }
}