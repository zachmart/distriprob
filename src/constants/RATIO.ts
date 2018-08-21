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


export class RATIO {
  public static className: string;
  private static _table:
    {[num: number]: {[denom: number]: {value: float, numDigits: number}}};

  public static init0(): void {
    RATIO.className = "RATIO";
    RATIO._table = {};
  }

  public static value(numerator: number, denominator: number, p: P): float {
    const negative = numerator * denominator < 0;

    if (numerator < 0) { numerator = Math.abs(numerator); }
    if (denominator < 0) { denominator = Math.abs(denominator); }

    if (typeof RATIO._table[numerator] === "undefined") { RATIO._table[numerator] = {}; }

    let entry = RATIO._table[numerator][denominator];

    if (typeof entry === "undefined" || entry.numDigits < p.baseDigits) {
      entry = {
        value: Basic.divideFF(
          Core.numberToFloatUnchecked(numerator),
          Core.numberToFloatUnchecked(denominator),
          p
        ),
        numDigits: p.baseDigits
      };
      RATIO._table[numerator][denominator] = entry;
    }

    return negative ? Sign.negateF(entry.value) : entry.value;
  }


  // class dependencies
  public static dependencies(): Set<Class> {
    return new Set([
      Sign, Core, Basic,
    ]);
  }
}


// *** imports come at end to avoid circular dependency ***

// interface/type imports
import {float} from "../interfaces/float";
import {Class} from "../interfaces/Class";

import {P as PAlias} from "../dataTypes/P";
export type P = PAlias;


// functional imports
import {Sign as SignAlias} from "../basicFunctions/Sign";
const Sign = SignAlias;

import {Core as CoreAlias} from "../core/Core";
const Core = CoreAlias;

import {Basic as BasicAlias} from "../basicFunctions/Basic";
const Basic = BasicAlias;


