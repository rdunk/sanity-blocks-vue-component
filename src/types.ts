import { DefineComponent, VNode } from 'vue';

export interface BaseBlock {
  _key: string;
  _type: string;
}

export type MarkDefinition = BaseBlock & Record<string, string>;

export type CustomBlock = BaseBlock & Record<string, any>;

export interface BlockSpan extends BaseBlock {
  _type: 'span';
  marks: string[];
  text: string;
}

export interface BlockText extends BaseBlock {
  _type: 'block';
  children: Array<Block | BlockSpan>;
  level?: number;
  listItem?: string;
  markDefs: MarkDefinition[];
  style: string;
}

export type Block = BlockText | CustomBlock;

export interface BlockList {
  _type: 'list';
  _key: string;
  level: number;
  listItem: string;
  children: Block[];
}

// Serializers

export type SerializedNode = string | VNode;

export type BlockSerializer = (
  block: Block,
  serializers: Serializers
) => SerializedNode | SerializedNode[];

export type MarkSerializer = (
  props: Record<string, any>,
  children: SerializedNode | SerializedNode[]
) => SerializedNode | SerializedNode[];

export type SpanSerializer = (
  span: BlockSpan,
  serializers: Serializers,
  markDefs: MarkDefinition[]
) => SerializedNode | SerializedNode[];

export type Serializer =
  | string
  | DefineComponent
  | SpanSerializer
  | BlockSerializer
  | MarkSerializer;

export type DynamicSerializer<T> = string | DefineComponent | T;

export interface Serializers {
  types: Record<string, DynamicSerializer<BlockSerializer>>;
  marks: Record<string, DynamicSerializer<MarkSerializer>>;
  styles: Record<string, string>;
  list: DynamicSerializer<BlockSerializer>;
  listItem: DynamicSerializer<BlockSerializer>;
  container: DynamicSerializer<BlockSerializer>;
  span: SpanSerializer;
  hardBreak: () => VNode;
}
