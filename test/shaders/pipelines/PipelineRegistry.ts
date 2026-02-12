import { describe, it, expect } from "vitest";
import { PIPELINE_IDS, type PipelineId } from "../../../src/shaders/pipelines/PipelineId";
import { PIPELINES, PIPELINE_LIST } from "../../../src/shaders/pipelines/PipelineRegistry";

function getUniqueValues(values: string[]): string[] {
    return Array.from(new Set(values));
}

describe("PipelineId", () => {
    it("PIPELINE_IDS values are unique", () => {
        const pipelineIdValues = Object.values(PIPELINE_IDS);
        const uniqueValues = getUniqueValues(pipelineIdValues);
        expect(uniqueValues.length).toBe(pipelineIdValues.length);
    });
});

describe("PipelineRegistry", () => {
    it("PIPELINES contains an entry for every PipelineId", () => {
        const pipelineIds = Object.values(PIPELINE_IDS) as PipelineId[];
        const registryKeys = Object.keys(PIPELINES) as PipelineId[];

        expect(registryKeys.sort()).toEqual(pipelineIds.sort());
    });

    it("each pipeline id matches its registry key", () => {
        const registryEntries = Object.entries(PIPELINES) as Array<[PipelineId, any]>;

        for (const [pipelineIdKey, pipeline] of registryEntries) {
            expect(pipeline.id).toBe(pipelineIdKey);
        }
    });

    it("PIPELINE_LIST is the values of PIPELINES", () => {
        const listIds = PIPELINE_LIST.map((pipeline) => pipeline.id).sort();
        const registryIds = Object.values(PIPELINES).map((pipeline) => pipeline.id).sort();

        expect(listIds).toEqual(registryIds);
    });

    it("pipelines have non-empty labels and an effects array", () => {
        for (const pipeline of Object.values(PIPELINES)) {
            expect(typeof pipeline.label).toBe("string");
            expect(pipeline.label.length).toBeGreaterThan(0);
            expect(Array.isArray(pipeline.effects)).toBe(true);
        }
    });

    it("effects have required shader fields and uniforms object", () => {
        for (const pipeline of Object.values(PIPELINES)) {
            for (const effect of pipeline.effects) {
                expect(typeof effect.id).toBe("string");
                expect(effect.id.length).toBeGreaterThan(0);

                expect(typeof effect.vertex).toBe("string");
                expect(effect.vertex.length).toBeGreaterThan(0);

                expect(typeof effect.fragment).toBe("string");
                expect(effect.fragment.length).toBeGreaterThan(0);

                expect(effect.uniforms).toBeTruthy();
                expect(typeof effect.uniforms).toBe("object");
            }
        }
    });
});
