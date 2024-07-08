// all graph vertices are defined as having a label and fields
// label typically indicates what "type" of entity is represented
type VertexSchema<VertexLabel extends string> = {
  label: VertexLabel;
  fields: SchemaDefinition;
};

// very basic for now, but we might expand on types later
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

export type GraphEdges<
  VertexLabel extends string,
  EdgeLabel extends string,
> = Partial<{
  [N in EdgeName<
    VertexLabel,
    EdgeLabel,
    VertexLabel
  >]: N extends `${infer From}_${infer Edge}_${infer To}`
    ? From extends VertexLabel
      ? To extends VertexLabel
        ? Edge extends EdgeLabel
          ? EdgeSchema<From, Edge, To>
          : never
        : never
      : never
    : never;
}>;

export type GraphDefinition<
  VertexLabel extends string,
  EdgeLabel extends string,
> = {
  vertices: GraphVertices<VertexLabel>;
  edges: GraphEdges<VertexLabel, EdgeLabel>;
};
