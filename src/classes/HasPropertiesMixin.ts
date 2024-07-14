import {
  BaseTraversal,
  GenericConstructor,
  PropertyTraversal,
  SchemaDefinition,
} from "../types";

interface HasPropertiesStatic<S extends SchemaDefinition> {
  label: string;
  property<K extends keyof S>(key: K, value: string): this;
}

export type HasProperties<S extends SchemaDefinition> =
  HasPropertiesStatic<S> & {
    [K in keyof S]: PropertyTraversal<S[K]>;
  };

export function HasPropertiesMixin<
  TBase extends GenericConstructor<BaseTraversal>,
  S extends SchemaDefinition,
>(Base: TBase, label: string) {
  return class extends Base implements HasPropertiesStatic<S> {
    public label = label;
    //label(): TokkieValueTraversal<number | undefined> {
    //  return new TokkieValueTraversal<string>(this.$, this.context);
    //}
  };
}
