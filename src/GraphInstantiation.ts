// helpers

import {
  GraphDefinition,
  SchemaDefinition,
  GraphEdges,
  EdgeName,
  EdgeSchema,
} from "./GraphDefinition";

type InstantiatedGraph<
  VertexLabel extends string,
  EdgeLabel extends string,
  G extends GraphDefinition<VertexLabel, EdgeLabel>,
> = {
  [L in VertexLabel]: InstantiatedVertex<G["vertices"][L]["fields"]>;
};

type InstantiatedVertex<S extends SchemaDefinition> =
  InstantiatedVertexProperties<S>; // & InstantiatedVertexRelationships;

type InstantiatedVertexProperties<S extends SchemaDefinition> = {
  [K in keyof S]: PropertyTraversal<S[K]["type"]>;
};

//type InstantiatedVertexRelationships = InstantiatedOutboundRelationships &
//  InstantiatedInboundRelationships;

type InstantiatedOutboundRelationships<
  VertexLabel extends string,
  EdgeLabel extends string,
  Graph extends GraphDefinition<VertexLabel, EdgeLabel>,
  CurrentVertex extends VertexLabel,
> = {
  [K in EdgeLabel]: {
    [V in VertexLabel]: Graph["edges"][`${CurrentVertex}_${K}_${V}`] extends EdgeSchema<
      CurrentVertex,
      K,
      V
    >
      ? { edge: K; to: V }
      : never;
  };
};

type InstantiatedEdge<
  VertexLabel extends string,
  S extends SchemaDefinition,
> = {
  [K in VertexLabel]: InstantiatedVertex<S>;
};

let d: GraphDefinition<"dog" | "user" | "bone", "loves" | "chews" | "owns"> = {
  vertices: {
    bone: { label: "bone", fields: {} },
    user: { label: "user", fields: {} },
    dog: { label: "dog", fields: {} },
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

let user: InstantiatedOutboundRelationships<
  "dog" | "user" | "bone",
  "loves" | "chews" | "owns",
  typeof d,
  "user"
>;

user.loves.dog;

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
