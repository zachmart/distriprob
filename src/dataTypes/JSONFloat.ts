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


export class JSONFloat {
  public static className: string;

  public static init0(): void {
    JSONFloat.className = "JSONFloat";
  }

  public static stringify(x: float): string {
    if (Comparison.isNaN(x)) {
      return "JSONFltNaN";
    } else if (Comparison.isPOSITIVE_INFINITY(x)) {
      return "JSONFloat+Infinity";
    } else if (Comparison.isNEGATIVE_INFINITY(x)) {
      return "JSONFloat-Infinity";
    } else {
      return `JSONFlt${JSONInt.stringify(x.coef)}#${JSONInt.stringify(x.exp)}`;
    }
  }

  public static parse(str: string): float {
    if (str.substring(7, 10) === "NaN") {
      return C.F_NaN;
    } else if (str.substring(8, 16) === "Infinity") {
      if (str.substring(7, 8) === "+") {
        return C.F_POSITIVE_INFINITY;
      } else {
        return C.F_NEGATIVE_INFINITY;
      }
    } else {
      const indexToBreakOn = str.indexOf("#", 19);
      const coefStr = str.substring(7, indexToBreakOn);
      const expStr = str.substring(indexToBreakOn + 1);

      return new FloatingPoint(JSONInt.parse(coefStr), JSONInt.parse(expStr));
    }
  }

  public static instance(x: any): boolean {
    if (typeof x === "string" && x.length >= 10 && x.substring(0, 7) === "JSONFloat") {
      if (x.length === 10 && x.substring(7, 10) === "NaN") {
        return true;
      } else if (x.length === 16 && x.substring(8, 16) === "Infinity") {
        const signSubstr = x.substring(7, 8);
        return signSubstr === "+" || signSubstr === "-";
      } else {
        const signSubstr = x.substring(7, 8);

        if (signSubstr !== "+" && signSubstr !== "-") {
          return false;
        }

        const indexToBreakOn = x.indexOf("#", 19);

        if (indexToBreakOn === -1) {
          return false;
        }

        const coefStr = x.substring(7, indexToBreakOn);
        const expStr = x.substring(indexToBreakOn + 1);

        return JSONInt.instance(coefStr) && JSONInt.instance(expStr);
      }
    } else {
      return false;
    }
  }


  // class dependencies
  public static dependencies(): Set<Class> {
    return new Set([
      FloatingPoint, C, Comparison, JSONInt,
    ]);
  }
}


// *** imports come at end to avoid circular dependency ***

// interface/type imports
import {float} from "../interfaces/float";
import {Class} from "../interfaces/Class";


// functional imports
import {FloatingPoint as FloatingPointAlias} from "./FloatingPoint";
const FloatingPoint = FloatingPointAlias;

import {C as CAlias} from "../constants/C";
const C = CAlias;

import {Comparison as ComparisonAlias} from "../basicFunctions/Comparison";
const Comparison = ComparisonAlias;

import {JSONInt as JSONIntAlias} from "./JSONInt";
const JSONInt = JSONIntAlias;