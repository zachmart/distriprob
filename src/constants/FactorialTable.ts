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

import {float} from "../interfaces/float";
import {int} from "../interfaces/int";

import {Integer as IntegerAlias} from "../dataTypes/Integer";
const Integer = IntegerAlias;

import {C as CAlias} from "./C";
const C = CAlias;

import {Core as CoreAlias} from "../core/Core";
const Core = CoreAlias;

import {Longhand as LonghandAlias} from "../core/Longhand";
const Longhand = LonghandAlias;

import {Basic as BasicAlias} from "../basicFunctions/Basic";
const Basic = BasicAlias;

import {Comparison as ComparisonAlias} from "../basicFunctions/Comparison";
const Comparison = ComparisonAlias;

import {Conversion as ConversionAlias} from "../core/Conversion";
const Conversion = ConversionAlias;

import {P as PAlias} from "../dataTypes/P";
const P = PAlias;
export type P = PAlias;


export class FactorialTable {
  public static maxIndex: number;
  public static _Uint32ArrayTable: Array<Uint32Array>;
  private static _intTable: Array<int>;
  private static _fltTable: Array<float>;
  private static _prec: P;

  public static setup(): void {
    FactorialTable.maxIndex = 1000;
    const digitTable: Array<Uint32Array> = Array(FactorialTable.maxIndex + 1);

    digitTable[0] = C.ARR_1;
    digitTable[1] = C.ARR_1;

    for (let i = 2; i <= FactorialTable.maxIndex; i++) {
      digitTable[i] = Longhand.multiplication(Uint32Array.of(i), digitTable[i-1]);
    }

    FactorialTable._Uint32ArrayTable = digitTable;

    FactorialTable._intTable = Array(FactorialTable.maxIndex + 1).fill(C.I_0);
    FactorialTable._fltTable = Array(FactorialTable.maxIndex + 1).fill(C.F_0);
    FactorialTable._prec
      = P.createPFromNumDigits(digitTable[FactorialTable.maxIndex].length);
  }

  public static uint32(n: number): Uint32Array {
    if (!FactorialTable._Uint32ArrayTable) { FactorialTable.setup(); }

    return FactorialTable._Uint32ArrayTable[n];
  }

  public static int(n: number): int {
    if (!FactorialTable._Uint32ArrayTable) { FactorialTable.setup(); }

    if (Comparison.isZeroI(FactorialTable._intTable[n])) {
      FactorialTable._intTable[n] = new Integer(
        false,
        FactorialTable._Uint32ArrayTable[n]
      );
    }

    return FactorialTable._intTable[n];
  }

  public static float(n: number): float {
    if (!FactorialTable._Uint32ArrayTable) { FactorialTable.setup(); }

    if (Comparison.isZero(FactorialTable._fltTable[n])) {
      FactorialTable._fltTable[n] = Conversion.intToFloat(
        FactorialTable.int(n),
        FactorialTable._prec,
        true
      );
    }

    return FactorialTable._fltTable[n];
  }

  public static calcFact(
    factObj: {value: float, index: number, nextIndex: number},
    prec: P
  ): void {
    if (factObj.nextIndex <= FactorialTable.maxIndex) {
      factObj.value = FactorialTable.float(factObj.nextIndex);
      factObj.index = factObj.nextIndex;
    } else {
      for(let i = factObj.index + 1; i <= factObj.nextIndex; i++) {
        factObj.value = Basic.multiplyFF(
          factObj.value,
          Core.numberToFloatUnchecked(i),
          prec
        );
        factObj.index = factObj.nextIndex;
      }
    }
  }
}