import { process } from "gremlin";
import { BaseTraversal, TraversalContext, ValueTraversal } from "../../types";

export class TokkieValueTraversal<T extends any>
  implements BaseTraversal, ValueTraversal<T>
{
  constructor(
    public $: process.GraphTraversal,
    public context: TraversalContext,
  ) {}

  next(): Promise<T> {
    return this.next();
  }
}
