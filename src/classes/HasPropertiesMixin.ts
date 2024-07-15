import {
  BaseTraversal,
  GenericConstructor,
  PropertyTraversal,
  RecordFromSchemaDefinition,
  SchemaDefinition,
  TypeFromSchemaField,
} from "../types";
import { TokkieValueTraversal } from "./basic/TokkieValueTraversal";

interface HasPropertiesStatic<S extends SchemaDefinition> {
  setProperty<K extends keyof S>(
    key: K,
    value: TypeFromSchemaField<S[K]>,
  ): this;
  setProperties(values: RecordFromSchemaDefinition<S>): this;
  getProperty<K extends keyof S>(
    key: K,
  ): TokkieValueTraversal<TypeFromSchemaField<S[K]>>;
  getProperties(): Promise<RecordFromSchemaDefinition<S>>;
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
    // TODO: Build some kind of validation mechanism
    // i.e. users derive zod schema from schema def?
    setProperty<K extends keyof S>(
      key: K,
      value: TypeFromSchemaField<S[K]>,
    ): this {
      this.$ = this.$.property(key, value);
      throw new Error("Method not implemented.");
    }

    setProperties(values: RecordFromSchemaDefinition<S>): this {
      // TODO: see above re: validation
      Object.entries(values).forEach(([key, value]) => {
        this.$ = this.$.property(key, value);
      });
      return this;
    }

    getProperty = <K extends keyof S>(key: K) =>
      new TokkieValueTraversal<TypeFromSchemaField<S[K]>>(
        this.$.values(key),
        this.context,
      );

    getProperties(): Promise<RecordFromSchemaDefinition<S>> {
      throw new Error("Method not implemented.");
    }
  };
}
