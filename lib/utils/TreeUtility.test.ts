import { TreeUtility } from "./TreeUtility";
import { test, expect } from 'vitest';

const TestTree: any = {
    "name": "root",
    "id": 1,
    "children": [
        {
            "name": "child1",
            "id": 2,
            "children": [
                {
                    "name": "child1.1",
                    "id": 3
                },
                {
                    "name": "child1.2",
                    "id": 4
                }
            ]
        },
        {
            "name": "child2",
            "id": 5,
            "children": [
                {
                    "name": "child2.1",
                    "id": 6
                },
                {
                    "name": "child2.2",
                    "id": 7
                }
            ]
        }
    ]
}

test('initializeTree', () => {
    let internalTree: any[] = [structuredClone(TestTree)];
    TreeUtility.initializeTree(internalTree, "parentID", "children", "id");
    expect(internalTree[0]["parentID"]).toBeUndefined();
    expect(internalTree[0]["children"][0]["parentID"]).toBe(1);
    expect(internalTree[0]["children"][1]["parentID"]).toBe(1);
});

test('initializeTree custom parent', () => {
    let internalTree: any[] = [structuredClone(TestTree)];
    TreeUtility.initializeTree(internalTree, "pid", "children", "id");
    expect(internalTree[0]["pid"]).toBeUndefined();
    expect(internalTree[0]["children"][0]["pid"]).toBe(1);
    expect(internalTree[0]["children"][1]["pid"]).toBe(1);
});

test('omitParentID', () => {
    let internalTree: any[] = [structuredClone(TestTree)];
    TreeUtility.initializeTree(internalTree, "parentID", "children", "id");
    let cleaned = TreeUtility.omitParentID(internalTree, "children");
    expect(cleaned[0]["parentID"]).toBeUndefined();
    expect(cleaned[0]["children"][0]["parentID"]).toBeUndefined();
    expect(cleaned[0]["children"][1]["parentID"]).toBeUndefined();
});

test('getNode', () => {
    let internalTree: any[] = [structuredClone(TestTree)];
    TreeUtility.initializeTree(internalTree, "parentID", "children", "id");
    let node = TreeUtility.getNode(internalTree, "children", "id", 4);
    expect(node["name"]).toBe("child1.2");
});

test('chainUpdate parent selection', () => {
    let internalTree: any[] = [structuredClone(TestTree)];
    TreeUtility.initializeTree(internalTree, "parentID", "children", "id");
    TreeUtility.chainUpdate(internalTree, internalTree[0], "parentID", "children", "included", "id", true);
    expect(internalTree[0]["included"]).toBe(true);
    expect(internalTree[0]["children"][0]["included"]).toBe(true);
    expect(internalTree[0]["children"][1]["included"]).toBe(true);
    expect(internalTree[0]["children"][0]["children"][0]["included"]).toBe(true);
    expect(internalTree[0]["children"][0]["children"][1]["included"]).toBe(true);
    expect(internalTree[0]["children"][1]["children"][0]["included"]).toBe(true);
    expect(internalTree[0]["children"][1]["children"][1]["included"]).toBe(true);
});

test('chainUpdate child selection', () => {
    let internalTree: any[] = [structuredClone(TestTree)];
    TreeUtility.initializeTree(internalTree, "parentID", "children", "id");
    TreeUtility.chainUpdate(internalTree, internalTree[0]["children"][0], "parentID", "children", "included", "id", true);
    expect(internalTree[0]["included"]).toBe(null);
    expect(internalTree[0]["children"][0]["included"]).toBe(true);
    expect(internalTree[0]["children"][1]["included"]).toBe(undefined);
    expect(internalTree[0]["children"][0]["children"][0]["included"]).toBe(true);
    expect(internalTree[0]["children"][0]["children"][1]["included"]).toBe(true);
    expect(internalTree[0]["children"][1]["children"][0]["included"]).toBe(undefined);
    expect(internalTree[0]["children"][1]["children"][1]["included"]).toBe(undefined);
});