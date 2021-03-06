"use strict";

/**
 * (C) Copyright Eric Ford & Hubert Holin 2001.
 * (C) Copyright John Maddock 2008.
 * (C) Copyright Zachary Martin 2018 (port to javascript).
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


export class Asinh {
  public static className: string;

  public static init0(): void {
    Asinh.className = "Asinh";
  }

  public static imp(x: float, p: P): float {
    if (Comparison.gte(x, PREC.fourthRootEPS(p))) {
      if (Comparison.gt(x, PREC.reciprocalSqrtEPS(p))) {
        // approximation by laurent series in 1/x at 0+ order from -1 to 1
        const oneDiv4xSquared = Basic.reciprocalF(Basic.multiplyFF(
          C.F_4,
          Basic.squareF(x, p),
          p
        ), p);

        return Basic.addFF(
          LN2.value(p),
          Basic.addFF(Log.f(x, p), oneDiv4xSquared, p),
          p
        );
      } else if (Comparison.lt(x, C.F_ONE_HALF)) {
        // As below, but rearranged to preserve digits:
        return Log.onePlusF(Basic.addFF(
          x,
          Sqrt1pm1.f(Basic.squareF(x, p), p),
          p
        ), p);
      } else {
        // return log( x + sqrt(x*x+1) )
        const xSquaredPlus1 = Basic.incF(Basic.squareF(x, p), p);
        return Log.f(Basic.addFF(
          x,
          Root.squareF(xSquaredPlus1, p),
          p
        ), p);

      }
    } else if (Comparison.lte(x,  Sign.negateF(PREC.fourthRootEPS(p)))) {
      return Sign.negateF(Asinh.imp(Sign.negateF(x), p));
    } else {
      // approximation by taylor series in x at 0 up to order 2
      let result = x;

      if (Comparison.gte(Sign.absF(x), PREC.sqrtEPS(p))) {
        const x3 = Basic.multiplyFF(Basic.squareF(x, p), x, p);
        result = Basic.subtractFF(
          result,
          Basic.multiplyFF(x3, RATIO.value(1, 6, p), p),
          p
        );
      }

      return result;
    }
  }


  // class dependencies
  public static dependencies(): Set<Class> {
    return new Set([
      C, Sign, Basic, Comparison, PREC, RATIO, Root, Log, LN2, Sqrt1pm1,
    ]);
  }
}


// *** imports come at end to avoid circular dependency ***

// interface/type imports
import {float} from "../../interfacesAndTypes/float";
import {Class} from "../../interfacesAndTypes/Class";

import {P as PAlias} from "../../dataTypes/P";
export type P = PAlias;


// functinal imports
import {C as CAlias} from "../../constants/C";
const C = CAlias;

import {Sign as SignAlias} from "../../basicFunctions/Sign";
const Sign = SignAlias;

import {Basic as BasicAlias} from "../../basicFunctions/Basic";
const Basic = BasicAlias;

import {Comparison as ComparisonAlias} from "../../basicFunctions/Comparison";
const Comparison = ComparisonAlias;

import {PREC as PRECAlias} from "../../constants/PREC";
const PREC = PRECAlias;

import {RATIO as RATIOAlias} from "../../constants/RATIO";
const RATIO = RATIOAlias;

import {Root as RootAlias} from "../../basicFunctions/Root";
const Root = RootAlias;

import {Log as LogAlias} from "../../basicFunctions/Log";
const Log = LogAlias;

import {LN2 as LN2Alias} from "../../constants/LN2";
const LN2 = LN2Alias;

import {Sqrt1pm1 as Sqrt1pm1Alias} from "./sqrt1pm1";
const Sqrt1pm1 = Sqrt1pm1Alias;



