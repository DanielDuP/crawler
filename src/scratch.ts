type VertexSchema<VertexLabel extends string> = {
  label: VertexLabel;
  fields: SchemaDefinition;
};

type SchemaField = {
  type: "string" | "number" | "boolean" | "date";
  nullable?: boolean;
};

export type SchemaDefinition = {
  [K in string]: SchemaField;
};

type GraphVertices<VertexLabel extends string> = {
  [L in VertexLabel]: VertexSchema<L>;
};

type EdgeCardinality = "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany";

export type EdgeSchema<
  OriginVertexLabel extends string,
  EdgeLabel extends string,
  DestinationVertexLabel extends string,
> = {
  origin: OriginVertexLabel;
  destination: DestinationVertexLabel;
  fields: SchemaDefinition;
  label: EdgeLabel;
  backwardDescriptor: string;
  cardinality: EdgeCardinality;
};

export type EdgeName<
  OriginVertexLabel extends string,
  Descriptor extends string,
  DestinationVertexLabel extends string,
> = `${OriginVertexLabel}_${Descriptor}_${DestinationVertexLabel}`;

export type GraphEdges<VertexLabel extends string, EdgeLabel extends string> = {
  [N in EdgeName<
    VertexLabel,
    EdgeLabel,
    VertexLabel
  >]?: N extends `${infer From}_${infer Edge}_${infer To}`
    ? From extends VertexLabel
      ? To extends VertexLabel
        ? Edge extends EdgeLabel
          ? EdgeSchema<From, Edge, To>
          : never
        : never
      : never
    : never;
};

export type GraphDefinition<
  VertexLabel extends string,
  EdgeLabel extends string,
> = {
  vertices: GraphVertices<VertexLabel>;
  edges: Partial<GraphEdges<VertexLabel, EdgeLabel>>;
};

type PropertyTraversal<T extends "string" | "number" | "boolean" | "date"> = {
  get(): Promise<
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

type PotentialOutboundEdges<
  VertexLabel extends string,
  EdgeLabel extends string,
  Graph extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertex extends VertexLabel
> = keyof {
  [K in keyof Graph['edges'] as K extends `${CurrentVertex}_${infer E}_${infer V}`
    ? E extends EdgeLabel
      ? V extends VertexLabel
        ? K
        : never
      : never
    : never]: Graph['edges'][K]
};

type OutboundEdges<
  VertexLabel extends string,
  EdgeLabel extends string,
  Graph extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertex extends VertexLabel> = 
  Graph["edges"]


type InstantiatedOutboundRelationships<
  VertexLabel extends string,
  EdgeLabel extends string,
  Graph extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertex extends VertexLabel
> = {
  [E in PotentialOutboundEdges<VertexLabel, EdgeLabel, Graph, CurrentVertex> as E: {
    [V in E['vertex']]: InstantiatedVertex<VertexLabel, EdgeLabel, Graph, V>
  }
};

type InstantiatedProperties<S extends SchemaDefinition> = {
  [K in keyof S]: PropertyTraversal<S[K]["type"]>;
};

type InstantiatedVertex<
  VertexLabel extends string,
  EdgeLabel extends string,
  Graph extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertex extends VertexLabel,
> = InstantiatedProperties<Graph["vertices"][CurrentVertex]["fields"]> &
  InstantiatedOutboundRelationships<
    VertexLabel,
    EdgeLabel,
    Graph,
    CurrentVertex
  >;

type InstantiatedGraph<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
> = {
  [L in VertexLabel]: InstantiatedVertex<VertexLabel, EdgeLabel, G, L>;
};

const d: GraphDefinition<"dog" | "user" | "bone", "loves" | "chews" | "owns"> =
  {
    vertices: {
      bone: { label: "bone", fields: { name: { type: "string" } } },
      user: { label: "user", fields: { name: { type: "string" } } },
      dog: { label: "dog", fields: { name: { type: "string" } } },
    },
    edges: {
      user_owns_dog: {
        backwardDescriptor: "ownedBy",
        cardinality: "oneToOne",
        destination: "dog",
        origin: "user",
        label: "owns",
        fields: {},
      },
      user_loves_dog: {
        backwardDescriptor: "lovedBy",
        cardinality: "oneToMany",
        destination: "dog",
        origin: "user",
        label: "loves",
        fields: {},
      },
    },
  };

type MyGraph = InstantiatedGraph<
  "dog" | "user" | "bone",
  "loves" | "chews" | "owns",
  typeof d
>;


let oe: PotentialOutboundEdges<"dog"|"user"|"bone", "loves"|"chews"|"owns", typeof d, "user"> 

let od: OutboundEdges<"dog"|"user"|"bone", "loves"|"chews"|"owns", typeof d, "user"> 

od
oe

// Test cases
const user: MyGraph["user"] = {} as any;

// These should give type errors
// @ts-expect-error
const bone = user.chews; // Property 'chews' does not exist on type ...
// @ts-expect-error
const catName = user.ow; // Property 'cat' does not exist on type ...

const dog: MyGraph["dog"] = {} as any;
// @ts-expect-error
const dogBone = dog.chews; // This should also give a type error

user.
