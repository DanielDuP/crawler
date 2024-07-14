import { process } from "gremlin";
import { BaseTraversal, NullTraversal, TraversalContext } from "../../types";

export class TokkieNullTraversal implements BaseTraversal, NullTraversal {
  constructor(
    public $: process.GraphTraversal,
    public context: TraversalContext,
  ) {}

  next(): Promise<void> {
    throw new Error("Not implemented");
  }
}
