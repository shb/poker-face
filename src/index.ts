import Pretender from 'pretender';

import { PretenderBuilder } from "./builder";

export default function pretend(): PretenderBuilder {
  const pretender = new Pretender();
  return new PretenderBuilder(pretender);
}
