/*
 * This file is still a bit rough, but sketches out the main idea.
 * We basically need to build an arbitrary graph in TS types, using
 * conditionals and mechanisms of inference. This graph will still
 * be instantiated in Code, naturally, but this allows us to keep
 * good type inference even after an arbitrary number of steps.
 *
 * Some of these types might need further expansion (i.e. value
 * and property types for additional data types, but this sketches
 * out, in brief, what the main thrust of this library is.)
 */

import { process } from "gremlin";

export type GenericConstructor<T = {}> = new (...args: any[]) => T;

export type Traversal =
  | process.GraphTraversal
  | {
      $: process.GraphTraversal;
    }
  | (() => Traversal);

// Base properties
export type BaseTraversal = {
  $: process.GraphTraversal;
  context: TraversalContext;
};

export type TraversalContext = {
  constructorMap: Record<string, Constructor<any>>;
};

export type Constructor<T> = new (
  label: string,
  $: process.GraphTraversal,
  context: TraversalContext,
) => T;

interface IntransitiveTraversalMethods {
  and(...args: Traversal[]): this;
  any(...args: TokkiePredicate[]): this;
  as(...label: string[]): this;
  barrier(arg?: number): this;
  by(...args: any): this;
  cap(...args: string[]): this;
  coalesce(...args: Traversal[]): this;
  coin(args: number): this;
  // concat
  // conjoin
  // connectedComponent
  // constant
  // cyclicPath
  // dateAdd
  // dateDiff
  dedup(): this;
  // difference
  // disjunct
  // element
  // elementMap
  // emit
  // explain
  map(traversal: Traversal[]): this;
  flatMap(traversal: Traversal[]): this;
  fold(): this;
  fold(...args: any[]): this;
  from(arg: string): this;
  from(arg: Traversal): this;
  // group
  // groupCount
  has(): this;
  hasId(): this;
  hasKey(): this;
  identity(): this;
  // index
  // inject
  // intersect
  // is
  // key
  // label
  // length
  // limit
  // loops
  // ltrim
  // map
  // match
  // math
  // max
  // mean
  // merge
  // mergeEdge // will not be supported
  // mergeVertex // will not be supported
  // min
  // none
  // not
  // option
  // optional
  // or
  // order step
  // pagerank
  // path
  // peerPressure
  // product
  // profile
  // project
  // program
  // properties
  // property
  // propertyMap
  // range
  // read
  // repeat
  // replace
  // reverse
  // rtrim
  // sack
  // select
  // shortestPath
  sideEffect(callback: (traversal: this) => Traversal): this;
  // skip
  // split
  // subgraph
  // substring
  // sum
  // tail
  // timeLimit
  // to
  // toLower
  // toUpper
  // tree
  // trim
  // unfold
  // union
  // until
  // v
  // value
  // valueMap
  // values
  // vertex
  where(callback: (traversal: this) => Traversal): this;
  // with
  // write
}

export interface TraversalMethods {
  count: () => ValueTraversal<number | undefined>;
  id: () => ValueTraversal<number | undefined>;
  drop: () => NullTraversal;
  fail: (message?: string) => NullTraversal;
}

type TokkiePredicate = IntransitiveTraversalMethods;

type EdgeCardinality = "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany";

type SchemaField = {
  type: "string" | "number" | "boolean" | "date";
  nullable?: boolean;
};

export type TypeFromSchemaField<S extends SchemaField> =
  S["type"] extends "string"
    ? string
    : S["type"] extends "number"
      ? number
      : S["type"] extends "boolean"
        ? boolean
        : S["type"] extends "date"
          ? Date
          : never;

export type RecordFromSchemaDefinition<S extends SchemaDefinition> = {
  [K in keyof S]: TypeFromSchemaField<S[K]>;
};

export type SchemaDefinition = {
  [K in string]: SchemaField;
};

type EdgeRecord<VertexLabel extends string> = {
  destination: VertexLabel;
  cardinality?: EdgeCardinality;
};

type VertexSchema<VertexLabel extends string, EdgeLabel extends string> = {
  fields: SchemaDefinition;
  edges: VertexEdges<VertexLabel, EdgeLabel>;
};

type VertexEdges<
  VertexLabel extends string,
  EdgeLabel extends string,
> = Partial<{
  [L in EdgeLabel]: EdgeRecord<VertexLabel>;
}>;

type GraphVertices<VertexLabel extends string, EdgeLabel extends string> = {
  [L in VertexLabel]: VertexSchema<VertexLabel, EdgeLabel>;
};

type EdgeSchema = {
  fields?: SchemaDefinition;
  reverse: string;
};

type GraphEdges<EdgeLabel extends string> = {
  [L in EdgeLabel]: EdgeSchema;
};

export type GraphDefinition<
  VertexLabel extends string,
  EdgeLabel extends string,
> = {
  vertices: GraphVertices<VertexLabel, EdgeLabel>;
  edges: GraphEdges<EdgeLabel>;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type VertexByLabel<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertexLabel extends VertexLabel,
> = G["vertices"][CurrentVertexLabel];

type EdgeByLabel<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentEdgeLabel extends EdgeLabel,
> = G["edges"][CurrentEdgeLabel];

type EdgeDestination<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertexLabel extends VertexLabel,
  CurrentEdgeLabel extends EdgeLabel,
> =
  G["vertices"][CurrentVertexLabel] extends VertexSchema<VertexLabel, EdgeLabel>
    ? G["vertices"][CurrentVertexLabel]["edges"] extends VertexEdges<
        VertexLabel,
        EdgeLabel
      >
      ? G["vertices"][CurrentVertexLabel]["edges"][CurrentEdgeLabel] extends EdgeRecord<VertexLabel>
        ? G["vertices"][CurrentVertexLabel]["edges"][CurrentEdgeLabel]["destination"]
        : never
      : never
    : never;

type InstantiatedVertex<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertexLabel extends VertexLabel,
> = InstantiatedPropertyTraversals<
  VertexByLabel<
    VertexLabel,
    EdgeLabel,
    G,
    CurrentVertexLabel
  > extends VertexSchema<VertexLabel, EdgeLabel>
    ? VertexByLabel<
        VertexLabel,
        EdgeLabel,
        G,
        CurrentVertexLabel
      >["fields"] extends SchemaDefinition
      ? VertexByLabel<VertexLabel, EdgeLabel, G, CurrentVertexLabel>["fields"]
      : never
    : never
> &
  InstantiatedOutboundEdges<VertexLabel, EdgeLabel, G, CurrentVertexLabel> &
  InstantiatedInboundEdges<VertexLabel, EdgeLabel, G, CurrentVertexLabel> &
  IntransitiveTraversalMethods;
// helpers

type InboundEdgeLabels<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertexLabel extends VertexLabel,
> = {
  [V in VertexLabel]: {
    [E in EdgeLabel]: G["vertices"][V]["edges"][E] extends EdgeRecord<CurrentVertexLabel>
      ? G["vertices"][V]["edges"][E]["destination"] extends CurrentVertexLabel
        ? E
        : never
      : never;
  }[EdgeLabel];
}[VertexLabel];

type VertexLabelsForInboundEdge<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertexLabel extends VertexLabel,
  CurrentEdgeLabel extends EdgeLabel,
> = {
  [V in VertexLabel]: {
    [E in CurrentEdgeLabel]: G["vertices"][V]["edges"][E] extends EdgeRecord<CurrentVertexLabel>
      ? G["vertices"][V]["edges"][E]["destination"] extends CurrentVertexLabel
        ? V
        : never
      : never;
  }[CurrentEdgeLabel];
}[VertexLabel];

type InstantiatedInboundEdges<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertexLabel extends VertexLabel,
> = {
  [L in InboundEdgeLabels<
    VertexLabel,
    EdgeLabel,
    G,
    CurrentVertexLabel
  > as ReversedEdgeLabel<VertexLabel, EdgeLabel, G, L>]: InstantiatedEdge<
    VertexLabel,
    EdgeLabel,
    G,
    VertexLabelsForInboundEdge<
      VertexLabel,
      EdgeLabel,
      G,
      CurrentVertexLabel,
      L
    >,
    L
  >;
};

type InstantiatedOutboundEdges<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertexLabel extends VertexLabel,
> = {
  [K in keyof G["vertices"][CurrentVertexLabel]["edges"]]: InstantiatedEdge<
    VertexLabel,
    EdgeLabel,
    G,
    G["vertices"][CurrentVertexLabel]["edges"][K] extends EdgeRecord<VertexLabel>
      ? G["vertices"][CurrentVertexLabel]["edges"][K]["destination"]
      : never,
    K extends EdgeLabel ? K : never
  >;
};

type InstantiatedEdge<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
  ApplicableVertexLabels extends VertexLabel,
  CurrentEdgeLabel extends EdgeLabel,
> = {
  [CurrentVertexLabel in ApplicableVertexLabels]: InstantiatedVertex<
    VertexLabel,
    EdgeLabel,
    G,
    CurrentVertexLabel
  >;
} & InstantiatedPropertyTraversals<
  EdgeByLabel<VertexLabel, EdgeLabel, G, CurrentEdgeLabel> extends EdgeSchema
    ? EdgeByLabel<
        VertexLabel,
        EdgeLabel,
        G,
        CurrentEdgeLabel
      >["fields"] extends SchemaDefinition
      ? EdgeByLabel<VertexLabel, EdgeLabel, G, CurrentEdgeLabel>["fields"]
      : never
    : never
>;

type ReversedEdgeLabel<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentEdgeLabel extends EdgeLabel,
> = G["edges"][CurrentEdgeLabel]["reverse"];

type InstantiatedPropertyTraversals<V extends SchemaDefinition> = {
  [K in keyof V]: PropertyTraversal<V[K]>;
};

export type PropertyTraversal<S extends SchemaField> = {
  next<T extends S["type"]>(): Promise<
    T extends "string"
      ? string
      : T extends "number"
        ? number
        : T extends "boolean"
          ? boolean
          : T extends "date"
            ? Date
            : never
  >;
};

export type ValueTraversal<V extends any> = {
  next(): Promise<V>;
};

export type NullTraversal = {
  next(): Promise<void>;
};
