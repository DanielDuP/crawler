import { BaseTraversal, GenericConstructor } from "../types";
import { TokkieNullTraversal } from "./basic/TokkieNullTraversal";
import { TokkieValueTraversal } from "./basic/TokkieValueTraversal";

export interface HasTransitiveMethods {
  count(): TokkieValueTraversal<number | undefined>;
  id(): TokkieValueTraversal<number | undefined>;
  drop(): TokkieNullTraversal;
  fail(message?: string): TokkieNullTraversal;
}

export function HasTransitiveMethodsMixin<
  TBase extends GenericConstructor<BaseTraversal>,
>(Base: TBase) {
  return class extends Base implements HasTransitiveMethods {
    count(): TokkieValueTraversal<number | undefined> {
      return new TokkieValueTraversal(this.$.count(), this.context);
    }
    id(): TokkieValueTraversal<number | undefined> {
      return new TokkieValueTraversal(this.$.id(), this.context);
    }
    drop(): TokkieNullTraversal {
      return new TokkieNullTraversal(this.$.drop(), this.context);
    }
    fail(message?: string): TokkieNullTraversal {
      return new TokkieNullTraversal(this.$.fail(message), this.context);
    }
  };
}
