"use strict";

/**
 * (C) Copyright Zachary Martin 2018.
 * Use, modification and distribution are subject to the
 * Boost Software License:
 *
 * Permission is hereby granted, free of charge, to any person or organization
 * obtaining a copy of the software and accompanying documentation covered by
 * this license (the "Software") to use, reproduce, display, distribute,
 * execute, and transmit the Software, and to prepare derivative works of the
 * Software, and to permit third-parties to whom the Software is furnished to
 * do so, all subject to the following:
 *
 * The copyright notices in the Software and this entire statement, including
 * the above license grant, this restriction and the following disclaimer,
 * must be included in all copies of the Software, in whole or in part, and
 * all derivative works of the Software, unless such copies or derivative
 * works are solely in the form of machine-executable object code generated by
 * a source language processor.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE
 * FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */


export class Extreme {
  public static className: string;

  public static init0(): void {
    Extreme.className = "Extreme";
  }

  private static findInt(
    compFunction: (a: int, b: int) => number,
    vals: Iterable<int>,
    maxIndex?: number
  ): int {
    if (typeof maxIndex === "undefined") {
      maxIndex = Number.POSITIVE_INFINITY;
    } else if (maxIndex < 0) {
      return C.NaN;
    }

    let i = 0;
    let extreme = C.NaN;

    for (let val of vals) {
      if (compFunction(val, extreme) > 0) {
        extreme = val;
      }
      i++;
      if (i > maxIndex) {
        break;
      }
    }

    return extreme;
  }

  private static findFloat(
    compFunction: (a: float, b: float) => number,
    vals: Iterable<float>,
    maxIndex?: number
  ): float {
    if (typeof maxIndex === "undefined") {
      maxIndex = Number.POSITIVE_INFINITY;
    } else if (maxIndex < 0) {
      return C.F_NaN;
    }

    let i = 0;
    let extreme = C.F_NaN;

    for (let val of vals) {
      if (compFunction(val, extreme) > 0) {
        extreme = val;
      }
      i++;
      if (i > maxIndex) {
        break;
      }
    }

    return extreme;
  }

  private static findGeneral(
    compFunction: (a: float, b: float) => number,
    vals: Iterable<number | int | float>,
    maxIndex: number,
    prec: P
  ): float {
    let i = 0;
    let extreme = C.F_NaN;
    let valFloat: float;

    for (let val of vals) {
      if (typeof val === "number") {
        valFloat = Core.numberToFloat(val);
      } else if (Core.instanceI(val)) { // x is an int
        valFloat = Conversion.intToFloat(val, prec, false);
      } else {
        valFloat = val;
      }

      if (compFunction(valFloat, extreme) > 0) {
        extreme = valFloat;
      }
      i++;
      if (i > maxIndex) {
        break;
      }
    }

    return extreme;
  }


  // class dependencies
  public static dependencies(): Set<Class> {
    return new Set([
      C, Conversion, Core,
    ]);
  }
}


// *** imports come at end to avoid circular dependency ***

// interface/type imports
import {int} from "../interfacesAndTypes/int";
import {float} from "../interfacesAndTypes/float";
import {Class} from "../interfacesAndTypes/Class";

import {P as PAlias} from "../dataTypes/P";
export type P = PAlias;


// functional imports
import {C as CAlias} from "../constants/C";
const C = CAlias;

import {Conversion as ConversionAlias} from "../core/Conversion";
const Conversion = ConversionAlias;

import {Core as CoreAlias} from "../core/Core";
const Core = CoreAlias;


