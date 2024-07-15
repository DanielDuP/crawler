import { process } from "gremlin";
import { BaseTraversal, NullTraversal, TraversalContext } from "../../types";

export class TokkieNullTraversal implements BaseTraversal, NullTraversal {
  constructor(
    public $: process.GraphTraversal,
    public context: TraversalContext,
  ) {}

  async next(): Promise<void> {
    await this.$.next();
  }
}
