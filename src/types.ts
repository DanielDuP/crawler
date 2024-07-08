interface TokkieGraphTraversal {
  and(...args: TokkieGraphTraversal[]): this;
  any(...args: TokkiePredicate[]): this;
  as(...label: string[]): this;
  barrier(arg?: number): this;
  by(...args: any): this;
  cap(...args: string[]): this;
  coalesce(...args: TokkieGraphTraversal[]): this;
  coin(args: number): this;
  // concat
  // conjoin
  // connectedComponent
  // constant
  count(): PropertyTraversal<{ type: "number" }>;
  // cyclicPath
  // dateAdd
  // dateDiff
  dedup(): this;
  // difference
  // disjunct
  drop(): NullTraversal;
  // e
  // element
  // elementMap
  // emit
  // explain
  fail(): NullTraversal;
  map(): this;
  flatMap(): this;
  format(args: string): PropertyTraversal<{ type: "string" }>;
  fold(): this;
  fold(...args: any[]): this;
  // from
  // group
  // groupCount
  has(): this;
  hasId(): this;
  hasKey(): this;
  id(): PropertyTraversal<{ type: "number" }>;
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
  // sideEffect
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
  // where
  // with
  // write
}

type TokkiePredicate = TokkieGraphTraversal;

type EdgeCardinality = "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany";
type SchemaField = {
  type: "string" | "number" | "boolean" | "date";
  nullable?: boolean;
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
  TokkieGraphTraversal;
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

////

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

type PropertyTraversal<S extends SchemaField> = {
  get<T extends S["type"]>(): Promise<
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

type NullTraversal = {};

const g = {
  vertices: {
    dog: {
      fields: {
        name: {
          type: "string",
        },
      },
      edges: {
        chews: {
          destination: "bone",
        },
        loves: {
          destination: "user",
        },
      },
    },
    bone: {
      fields: {},
      edges: {
        fears: {
          destination: "dog",
        },
      },
    },
    user: {
      edges: {
        owns: {
          destination: "dog",
        },
        fears: {
          destination: "dog",
        },
      },
      fields: {},
    },
  },
  edges: {
    chews: {
      fields: {
        timestamp: {
          type: "date",
        },
      },
      reverse: "chewedBy",
    },
    loves: {
      fields: {},
      reverse: "lovedBy",
    },
    owns: {
      fields: {},
      reverse: "ownedBy",
    },
    fears: {
      fields: {},
      reverse: "fearedBy",
    },
  },
} as const satisfies GraphDefinition<
  "bone" | "dog" | "user",
  "chews" | "owns" | "loves" | "fears"
>;

let dog: InstantiatedVertex<
  "bone" | "dog" | "user",
  "chews" | "owns" | "loves" | "fears",
  typeof g,
  "dog"
>;
let bone: InstantiatedVertex<
  "bone" | "dog" | "user",
  "chews" | "owns" | "loves" | "fears",
  typeof g,
  "bone"
>;
let user: InstantiatedVertex<
  "bone" | "dog" | "user",
  "chews" | "owns" | "loves" | "fears",
  typeof g,
  "user"
>;

user.owns.dog.ownedBy.user.lovedBy.dog.chews.bone.chewedBy.dog.fearedBy.user.owns.dog
  .as("dog")
  .fearedBy.user.coin(1);
