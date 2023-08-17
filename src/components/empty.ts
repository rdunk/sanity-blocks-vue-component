import { h, Component } from 'vue';

export const basicElement =
  (name: string): Component =>
  (_, { slots }) =>
    h(name, slots.default?.());
