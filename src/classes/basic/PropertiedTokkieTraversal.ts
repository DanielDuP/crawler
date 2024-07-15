import { process } from "gremlin";
import {
  RecordFromSchemaDefinition,
  SchemaDefinition,
  TraversalContext,
  TypeFromSchemaField,
} from "../../types";
import { TokkieValueTraversal } from "./TokkieValueTraversal";
import { LabeledTokkieTraversal } from "./LabeledTokkieTraversal";

export interface HasPropertiesStatic<S extends SchemaDefinition> {
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

export abstract class PropertiedTokkieTraversal<S extends SchemaDefinition>
  extends LabeledTokkieTraversal
  implements HasPropertiesStatic<S>
{
  constructor(
    $: process.GraphTraversal,
    context: TraversalContext,
    label: string,
    private propertySchema: SchemaDefinition,
  ) {
    super($, context, label);
    this.setupProperties();
  }

  // TODO: Build some kind of validation mechanism
  // i.e. users derive zod schema from schema def?
  setProperty<K extends keyof S>(
    key: K,
    value: TypeFromSchemaField<S[K]>,
  ): this {
    this.$ = this.$.property(key, value);
    return this;
  }

  // TODO: see above re: validation
  setProperties(values: RecordFromSchemaDefinition<S>): this {
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

  private setupProperties() {
    Object.entries(this.propertySchema).forEach(
      ([propertyName, propertyField]) => {
        Object.defineProperty(this, propertyName, {
          get: function () {
            return new TokkieValueTraversal(
              this.$.values(propertyName),
              this.context,
            );
          },
          configurable: true,
          enumerable: true,
        });
      },
    );
  }
}
