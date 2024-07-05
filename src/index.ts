import { process } from "gremlin";
import { z } from "zod";

type Graph<S extends string> = {
  vertices: GraphVertices<S>;
};

type GraphVertices<E extends string> = {
  [K in E]: VertexDefinition<K, keyof GraphVertices<E>>;
};

// Vertex Definition Type
type VertexDefinition<T extends string, K extends string> = {
  label: T;
  properties: z.ZodObject<any>;
  edges: Record<string, K>;
};

const d = {
  vertices: {
    user: {
      edges: {
        knows: "user",
      },
      label: "user",
      properties: z.object({ name: z.string() }),
    },
    dog: {
      edges: {
        loves: "user",
      },
      label: "dog",
      properties: z.object({ name: z.string(), boneCount: z.number() }),
    },
  },
} as const;

type VertexProperties<
  G extends Graph<string>,
  S extends keyof G["vertices"],
> = z.infer<G["vertices"][S]["properties"]>;

type VertexEdges<G extends Graph<string>, S extends keyof G["vertices"]> = {
  [K in keyof G["vertices"][S]["edges"]]: {
    [R in G["vertices"][S]["edges"][K]]: InstantiatedVertex<
      G,
      G["vertices"][S]["edges"][K]
    >;
  };
};

type TraversalFilters<
  G extends Graph<string>,
  S extends keyof G["vertices"],
> = {
  where<P extends keyof VertexProperties<G, S>>(
    property: P,
    operand: "==" | ">=" | "<=",
    testValue: VertexProperties<G, S>[P],
  ): InstantiatedVertex<G, S>;
};

type InstantiatedVertex<
  G extends Graph<string>,
  S extends keyof G["vertices"],
> = {
  $: process.GraphTraversal;
  $properties: VertexProperties<G, S>;
} & VertexProperties<G, S> &
  VertexEdges<G, S> &
  TraversalFilters<G, S>;

function buildGraph<G extends Graph<string>>(g: G): G {
  throw new Error("Not implemented");
}

type D = typeof d;

let dog: InstantiatedVertex<D, "dog">;

Graph.with("user", "dog", "kibbles")
  .schemas({
    user: z.object({ name: z.string() }),
    dog: z.object({ name: z.string() }),
    kibbles: z.object({ name: z.string() }),
  })
  .edges({
    user: {
      owns: "dog",
      knows: "user",
    },
    dog: {
      eats: "kibble",
      smells: "dog",
    },
  });

function vertices<VertexLabel extends string>(...vertexLabels: VertexLabel[]) {
  function edges<EdgeLabelIn extends string, EdgeLabelOut extends string>(
    ...edgeLabels: [EdgeLabelIn, EdgeLabelOut][]
  ) {
    function schemas(schemaInput: SchemaInputs<VertexLabel>) {
      function relationships(edgeInputs: EdgeInputs<VertexLabel, EdgeLabelIn>) {
        throw new Error("Not implemented");
      }
      return {
        relationships,
      };
    }
    return {
      schemas,
    };
  }
  return {
    edges,
  };
}

vertices("dog", "user")
  .edges(["knows", "isKnownBy"], ["eats", "isEatenBy"], ["holds", "isHeldBy"])
  .schemas({
    dog: z.object({}),
    user: z.object({}),
  })
  .relationships({
    dog: {
      eats: "dog",
    },
  });

type SchemaInputs<VertexLabels extends string> = {
  [Label in VertexLabels]: z.AnyZodObject;
};

type EdgeInputs<
  VertexLabel extends string,
  EdgeLabel extends string,
> = Partial<{
  [Label in VertexLabel]: Partial<Record<EdgeLabel, VertexLabel>>;
}>;
