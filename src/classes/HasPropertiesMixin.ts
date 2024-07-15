import {
  BaseTraversal,
  GenericConstructor,
  PropertyTraversal,
  SchemaDefinition,
  TypeFromSchemaField,
} from "../types";

interface HasPropertiesStatic<S extends SchemaDefinition> {
  property<K extends keyof S>(key: K, value: TypeFromSchemaField<S[K]>): this;
}

export type HasProperties<S extends SchemaDefinition> =
  HasPropertiesStatic<S> & {
    [K in keyof S]: PropertyTraversal<S[K]>;
  };

export function HasPropertiesMixin<
  TBase extends GenericConstructor<BaseTraversal>,
  S extends SchemaDefinition,
>(Base: TBase, schema: S) {
  return class extends Base implements HasPropertiesStatic<S> {
    property<K extends keyof S>(
      key: K,
      value: TypeFromSchemaField<S[K]>,
    ): this {
      throw new Error("Method not implemented.");
    }
  };
}
