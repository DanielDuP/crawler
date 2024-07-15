import { process } from "gremlin";
import { TokkieBaseTraversal } from "./TokkieBaseTraversal";
import { SupportedIntransitiveMethods } from "./SupportedMethods";
import { describe, it, expect, vi, Mocked, beforeEach } from "vitest";
import { TraversalContext } from "../../types";

class ConcreteTokkieTraversal extends TokkieBaseTraversal {}

describe("TokkieBaseTraversal", () => {
  let mockGraphTraversal: Mocked<process.GraphTraversal>;
  let mockContext: TraversalContext;
  let traversal: ConcreteTokkieTraversal;

  beforeEach(() => {
    mockGraphTraversal = {
      and: vi.fn(),
      any: vi.fn(),
      as: vi.fn(),
      barrier: vi.fn(),
      by: vi.fn(),
      cap: vi.fn(),
      coalesce: vi.fn(),
      coin: vi.fn(),
      count: vi.fn(),
      dedup: vi.fn(),
      map: vi.fn(),
      flatMap: vi.fn(),
      fold: vi.fn(),
      from: vi.fn(),
      has: vi.fn(),
      hasId: vi.fn(),
      hasKey: vi.fn(),
      identity: vi.fn(),
      sideEffect: vi.fn(),
      where: vi.fn(),
    } as unknown as Mocked<process.GraphTraversal>;

    mockContext = {} as TraversalContext;

    traversal = new ConcreteTokkieTraversal(mockGraphTraversal, mockContext);
  });

  it("should create an instance of ConcreteTokkieTraversal", () => {
    expect(traversal).toBeInstanceOf(ConcreteTokkieTraversal);
  });

  it("should set up base functions for all supported intransitive methods", () => {
    SupportedIntransitiveMethods.forEach((method) => {
      expect(typeof (traversal as any)[method]).toBe("function");
    });
  });

  it("should call the corresponding GraphTraversal method and return self", () => {
    SupportedIntransitiveMethods.forEach((method) => {
      const result = (traversal as any)[method]("arg1", "arg2");
      expect((mockGraphTraversal as any)[method]).toHaveBeenCalledWith(
        "arg1",
        "arg2",
      );
      expect(result).toBe(traversal);
    });
  });

  it("should reduce arguments with $ property", () => {
    const argWithDollar = { $: "reducedArg" };
    (traversal as any).and(argWithDollar, "normalArg");
    expect(mockGraphTraversal.and).toHaveBeenCalledWith(
      "reducedArg",
      "normalArg",
    );
  });
});
