"use strict";

/**
 * Created by zacharymartin on August 10, 2018.
 */


export interface Class  {
  className: string,
  toString(): string,
  dependencies?: () => Set<Class>,
  init0?: () => void,
  init1?: () => void,
  init2?: () => void,
  init3?: () => void,
  init4?: () => void,
  init5?: () => void,
  init6?: () => void,
}