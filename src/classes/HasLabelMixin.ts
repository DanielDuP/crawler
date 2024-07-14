import { BaseTraversal, GenericConstructor } from "../types";

export type HasLabel = {
  label: string;
};

export function HasLabelMixin<TBase extends GenericConstructor<BaseTraversal>>(
  Base: TBase,
  label: string,
) {
  return class extends Base implements HasLabel {
    public label = label;
    //label(): TokkieValueTraversal<number | undefined> {
    //  return new TokkieValueTraversal<string>(this.$, this.context);
    //}
  };
}
