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


export class Int {

  public static className: string;

  public static init0(): void {
    Int.className = "Int";
  }

  private readonly i: int;
  private readonly f: float;

  constructor(i: int) {
    this.i = i;
    this.f = Conversion.intToFloatFullPrecision(i, true);
  }

  public static getInt(a: Int): int { return a.i; }

  public static instance(a: any): a is Int {
    return typeof a === "object" && a !== null && Core.instanceI(a.i) &&
      typeof a.abs === "function" && typeof a.isPOSITIVE_INFINITY === "function";
  }

  public abs(): Int {
    if (!this.i.neg) {
      return this;
    } else {
      return new Int(Sign.negateI(this.i));
    }
  }

  public dec(): Int {
    return new Int(Basic.addII(this.i, C.I_NEG_1));
  }

  public divBy(
    divisor: Flt | Int | number | string,
    type?: "euclidean"| "trunc" | "ceil" | "floor" | "round" | null | undefined
  ): {quotient: Int, remainder: Int} {
    // TODO: implement this function
    throw new Error("this method is not implemented yet");
  }

  public divide(
    dividend: Flt | Int | number | string,
    type?: "euclidean"| "trunc" | "ceil" | "floor" | "round" | null | undefined
  ): {quotient: Int, remainder: Int} {
    // TODO: implement this function
    throw new Error("this method is not implemented yet");
  }

  public equals(y: Flt | Int | number): boolean {
    if (Core.instanceI(y)) {
      return Comparison.equalsI(this.i, y)
    } else if (Flt.instance(y)) {
      return Comparison.equals(this.f, Flt.getFloat(y));
    } else if (typeof y === "number") {
      return Comparison.equals(this.f, Core.numberToFloat(y))
    } else {
      throw new Error(
        `The Int class equals method cannot parse the argument ${y.toString()}`
      );
    }
  }

  public gt(y: Flt | Int | number): boolean {
    if (Core.instanceI(y)) {
      return Comparison.gtI(this.i, y)
    } else if (Flt.instance(y)) {
      return Comparison.gt(this.f, Flt.getFloat(y));
    } else if (typeof y === "number") {
      return Comparison.gt(this.f, Core.numberToFloat(y))
    } else {
      throw new Error(
        `The Int class gt (greater than) method cannot parse the argument ${
          y.toString()}`
      );
    }
  }

  public gte(y: Flt | Int | number): boolean {
    // TODO: implement this function
    throw new Error("this method is not implemented yet");
  }

  public inc(): Int { return new Int(Basic.addII(this.i, C.I_1)); }

  public isEven(): boolean { return Parity.isEvenI(this.i); }

  public isFinite(): boolean { return Comparison.isFiniteI(this.i); }

  public isNaN(): boolean { return Comparison.isNaN_I(this.i); }

  public isNegative(): boolean { return Comparison.isNegativeI(this.i); }

  public isNEGATIVE_INFINITY(): boolean {
    return Comparison.isNEGATIVE_INFINITY_I(this.i);
  }

  public isOdd(): boolean { return Parity.isOddI(this.i); }

  public isOne(): boolean { return Comparison.isOneI(this.i); }

  public isPositive(): boolean { return Comparison.isPositiveI(this.i); }

  public isPOSITIVE_INFINITY(): boolean {
    return Comparison.isPOSITIVE_INFINITY_I(this.i);
  }

  public isZero(): boolean { return Comparison.isZeroI(this.i); }

  public lt(y: Flt | Int | number): boolean {
    // TODO: implement this function
    throw new Error("this method is not implemented yet");
  }

  public lte(y: Flt | Int | number): boolean {
    // TODO: implement this function
    throw new Error("this method is not implemented yet");
  }

  public minus(y: Flt | Int | number | string): Int {
    // TODO: implement this function
    throw new Error("this method is not implemented yet");
  }

  public neg(): Int {
    return new Int(Sign.negateI(this.i));
  }

  public plus(b: Flt | Int | number | string): Int {
    // TODO: implement this function
    throw new Error("this method is not implemented yet");
  }

  public squared(): Int {
    return new Int(Basic.squareI(this.i));
  }

  public toFloat(p?: P | null | undefined): Flt {
    if (p) {
      return new Flt(Conversion.intToFloat(this.i, p, false));
    } else {
      return new Flt(this.f);
    }
  }

  public toJSON(): string {
    return JSONInt.stringify(this.i);
  }

  public toNumber(): number {
    return Core.intToNumber(this.i);
  }

  public toPow(exponent: Flt | Int | number | string): Int {
    // TODO: implement this function
    throw new Error("this method is not implemented yet");
  }

  public toString(
    radix?: number | null | undefined,
    maxPrecision?: number | null | undefined
  ): string {
    return StringWriter.toStr(this.i, radix, maxPrecision);
  }
}


// *** imports come at end to avoid circular dependency ***

import {int} from "../interfacesAndTypes/int";
import {float} from "../interfacesAndTypes/float";

import {Float as FltAlias} from "./Float";
const Flt = FltAlias;
export type Flt = FltAlias;

import {JSONInt as JSONIntAlias} from "../dataTypes/JSONInt";
const JSONInt = JSONIntAlias;

import {C as CAlias} from "../constants/C";
const C = CAlias;

import {Comparison as ComparisonAlias} from "../basicFunctions/Comparison";
const Comparison = ComparisonAlias;

import {Sign as SignAlias} from "../basicFunctions/Sign";
const Sign = SignAlias;

import {Parity as ParityAlias} from "../basicFunctions/Parity";
const Parity = ParityAlias;

import {Core as CoreAlias} from "../core/Core";
const Core = CoreAlias;

import {Basic as BasicAlias} from "../basicFunctions/Basic";
const Basic = BasicAlias;

import {Conversion as ConversionAlias} from "../core/Conversion";
const Conversion = ConversionAlias;

import {StringWriter as StringWriterAlias} from "../core/StringWriter";
const StringWriter = StringWriterAlias;

import {P as PAlias} from "../dataTypes/P";
const P = PAlias;
export type P = PAlias;
