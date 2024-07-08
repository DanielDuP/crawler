# Tokkie

Tokkie is a lightweight ORM designed for the Gremlin query language. It aims to provide a natural, Gremlin-like syntax while enforcing graph structure and properties through type inference from your schema declaration.

## Features

- Sticks closely to normal Gremlin syntax
- Uses type inference from schema declarations to enforce graph structure and properties
- Provides type assistance where possible and practical
- Offers an escape hatch to raw Gremlin queries using `$` from any traversal step
- Aims for near feature parity with Gremlin syntax (work in progress)

## Installation

```bash
npm install tokkie
```

## Usage

Define your schema (detailed instructions to be added) to get access to a natural, Gremlin-like syntax. For example:

```typescript
human.withId(15).owns.dog.toList();
dog.loves.owner.where((owner) => owner.has("age", lt(15)));
```

## Escape Hatch

You can always escape to raw Gremlin queries using `$` from any traversal step:

```typescript
someTraversal.$.outE().inV();
```

## Project Status

Tokkie is a work in progress. The table below tracks the implementation status of various Gremlin operations:

| Operation  | In Scope | Implemented |
| ---------- | -------- | ----------- |
| V          | Yes      | No          |
| addE       | Yes      | No          |
| addV       | Yes      | No          |
| aggregate  | Yes      | No          |
| and        | Yes      | No          |
| as         | Yes      | No          |
| barrier    | Yes      | No          |
| both       | Yes      | No          |
| bothE      | Yes      | No          |
| bothV      | Yes      | No          |
| branch     | Yes      | No          |
| cap        | Yes      | No          |
| choose     | Yes      | No          |
| coalesce   | Yes      | No          |
| coin       | Yes      | No          |
| constant   | Yes      | No          |
| count      | Yes      | No          |
| cyclicPath | Yes      | No          |
| dedup      | Yes      | No          |
| drop       | Yes      | No          |
| elementMap | Yes      | No          |
| emit       | Yes      | No          |
| filter     | Yes      | No          |
| flatMap    | Yes      | No          |
| fold       | Yes      | No          |
| group      | Yes      | No          |
| groupCount | Yes      | No          |
| has        | Yes      | No          |
| hasId      | Yes      | No          |
| hasLabel   | Yes      | No          |
| hasNot     | Yes      | No          |
| id         | Yes      | No          |
| identity   | Yes      | No          |
| in         | Yes      | No          |
| inE        | Yes      | No          |
| inV        | Yes      | No          |
| index      | Yes      | No          |
| inject     | Yes      | No          |
| is         | Yes      | No          |
| key        | Yes      | No          |
| label      | Yes      | No          |
| limit      | Yes      | No          |
| local      | Yes      | No          |
| loops      | Yes      | No          |
| map        | Yes      | No          |
| match      | Yes      | No          |
| math       | Yes      | No          |
| max        | Yes      | No          |
| mean       | Yes      | No          |
| min        | Yes      | No          |
| not        | Yes      | No          |
| optional   | Yes      | No          |
| or         | Yes      | No          |
| order      | Yes      | No          |
| otherV     | Yes      | No          |
| out        | Yes      | No          |
| outE       | Yes      | No          |
| outV       | Yes      | No          |
| path       | Yes      | No          |
| project    | Yes      | No          |
| properties | Yes      | No          |
| property   | Yes      | No          |
| range      | Yes      | No          |
| repeat     | Yes      | No          |
| sack       | Yes      | No          |
| select     | Yes      | No          |
| sideEffect | Yes      | No          |
| simplePath | Yes      | No          |
| skip       | Yes      | No          |
| store      | Yes      | No          |
| subgraph   | Yes      | No          |
| sum        | Yes      | No          |
| tail       | Yes      | No          |
| timeLimit  | Yes      | No          |
| times      | Yes      | No          |
| to         | Yes      | No          |
| toList     | Yes      | No          |
| unfold     | Yes      | No          |
| union      | Yes      | No          |
| until      | Yes      | No          |
| value      | Yes      | No          |
| valueMap   | Yes      | No          |
| values     | Yes      | No          |
| where      | Yes      | No          |

## Etymology

The name "Tokkie" is derived from "Tokeloshe", a common name for the mythical gremlin native to Southern Africa.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
