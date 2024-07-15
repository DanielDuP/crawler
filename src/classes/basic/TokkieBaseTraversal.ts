import { process } from "gremlin";
import { BaseTraversal, TraversalContext } from "../../types";
import { SupportedIntransitiveMethods } from "./SupportedMethods";

export abstract class TokkieBaseTraversal implements BaseTraversal {
  constructor(
    public $: process.GraphTraversal,
    public context: TraversalContext,
  ) {
    this.setupBaseFunctions();
  }

  private setupBaseFunctions() {
    SupportedIntransitiveMethods.forEach((method) => {
      (TokkieBaseTraversal.prototype as any)[method] = function (
        ...args: any[]
      ) {
        (this.$ as any)[method](...this.reduceArgs(args));
        return this;
      };
    });
  }

  private reduceArgs(args: any[]) {
    return args.map((arg) => {
      if (arg.$) {
        return arg.$;
      }
      return arg;
    });
  }
}
