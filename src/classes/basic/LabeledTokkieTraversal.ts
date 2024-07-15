import { process } from "gremlin";
import { TraversalContext } from "../../types";
import { TokkieBaseTraversal } from "./TokkieBaseTraversal";
import { TokkieValueTraversal } from "./TokkieValueTraversal";

export interface HasLabel {
  label: string;
}

export abstract class LabeledTokkieTraversal
  extends TokkieBaseTraversal
  implements HasLabel
{
  constructor(
    $: process.GraphTraversal,
    context: TraversalContext,
    public label: string,
  ) {
    super($, context);
  }

  getLabel(): TokkieValueTraversal<string> {
    return new TokkieValueTraversal(this.$.label(), this.context);
  }
}
