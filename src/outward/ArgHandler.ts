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

export type DefaultSpec = {
  canBeNull: boolean,
  canBeUndefined: boolean,
  value: float | int | number | string | boolean | null,
};

export type BoundSpec = {
  value: number | string | int | float,
  type: "open" | "closed",
  descriptor?: string | null,
}

export type DomainDescription =
  "real" |
  "positive real" |
  "nonnegative real" |
  "negative real" |
  "nonpositive real" |
  "integer" |
  "positive integer" |
  "nonnegative integer" |
  "negative integer" |
  "nonpositive integer" |
  "positive noninteger real" |
  "nonnegative noninteger real" |
  "negative noninteger real" |
  "nonpositive noninteger real" |
  "probability" |
  "positive infinity" |
  "negative infinity";

export type input = "Int" | "Float" | "number" | "string"

export type DomainSpec = {
  upperBound?: BoundSpec,
  lowerBound?: BoundSpec,
  unacceptableValues?: Array<number | string | float | int>,
  description: Array<DomainDescription>,
  in: Array<input>,
  out: "number" | "Int" | "Float"
}

export type ParameterSpec = {
  default?: DefaultSpec,
  finiteAcceptableValues?: Array<any>,
  domain: DomainSpec |
    "boolean" |
    "string" |
    "seed" |
    "prec" |
    "JSONInt" |
    "JSONFloat",
};


export class ArgHandler {
  private readonly functionName: string;
  private readonly domainDescriptionStrings: {[parameterName: string]: string};
  private readonly paramSpecs: {[parameterName: string]: ParameterSpec};
  private readonly paramOrder: Array<String>;
  private readonly conversionErrors: {[parameterName: string]: string};
  private readonly domainErrors: {[parameterName: string]: Array<string>};
  public readonly outputValues: Array<any>;

  constructor(
    functionName: string,
    paramSpecs: {[parameterName: string]: ParameterSpec},
    paramOrder: Array<String>
  ) {
    this.functionName = functionName;
    this.domainDescriptionStrings = {};
    this.domainErrors = {};
    for (let parameterName in paramSpecs) {
      if (typeof paramSpecs[parameterName].domain !== "string") {
        this.domainDescriptionStrings[parameterName] = ArgHandler.domainDescriptionStr(
          (<DomainSpec>paramSpecs[parameterName].domain).description
        );
      }
      this.domainErrors[parameterName] = [];
    }

    this.funct = funct;
    this.paramSpecs = paramSpecs;
    this.paramOrder = paramOrder;
    this.outputValues = [];
  }

  private convertArgToFloat(
    parameterName: string,
    value: any,
    prec: P
  ): float {
    const paramSpec = this.paramSpecs[parameterName];

    if (Flt.instance(value)) {
      return Flt.getFloat(value);
    } else if (Int.instance(value)) {
      return Conversion.intToFloat(Int.getInt(value), prec, false);
    } else if (Core.instance(value)) {
      return value;
    } else if (typeof value === "number") {
      return Core.numberToFloat(value);
    } else if (Core.instanceI(value)) {
      return Conversion.intToFloat(value, prec, false);
    } else if ((value === null && paramSpec.default && paramSpec.default.canBeNull) ||
               (typeof value === "undefined" && paramSpec.default &&
                 paramSpec.default.canBeUndefined)) {
      return <float>paramSpec.default.value;
    } else if ( typeof value === "string") {
      try {
        return (new StringParser(value)).float(prec);
      } catch (e) {
        this.conversionErrors[parameterName] = e;
        return C.F_NaN;
      }
    } else {
      this.conversionErrors[parameterName] =
        `Unable to parse argument value as a Float, given: ${value.toString()}`;
      return C.F_NaN;
    }
  }

  private convertArgToInt(
    parameterName: string,
    value: any
  ): int {
    const paramSpec = this.paramSpecs[parameterName];

    if (Flt.instance(value)) {
      const floatValue = Flt.getFloat(value);

      if (!Conversion.isInteger(floatValue)) {
        this.conversionErrors[parameterName] =
          `Argument must be an integer, given: ${StringWriter.toStr(floatValue)}`;
        return C.NaN;
      } else {
        return Conversion.floatToInt(floatValue, "trunc");
      }
    } else if (Int.instance(value)) {
      return Int.getInt(value);
    } else if (Core.instance(value)) {
      if (!Conversion.isInteger(value)) {
        this.conversionErrors[parameterName] =
          `Argument must be an integer, given: ${StringWriter.toStr(value)}`;
        return C.NaN;
      } else {
        return Conversion.floatToInt(value, "trunc");
      }
    } else if (typeof value === "number") {
      if (!Number.isInteger(value)) {
        this.conversionErrors[parameterName] =
          `Argument must be an integer, given: ${value}`;
        return C.NaN;
      } else {
        return Core.numberToInt(value);
      }
    } else if (Core.instanceI(value)) {
      return value;
    } else if ((value === null && paramSpec.default && paramSpec.default.canBeNull) ||
      (typeof value === "undefined" && paramSpec.default &&
        paramSpec.default.canBeUndefined)) {
      return <int>paramSpec.default.value;
    } else if ( typeof value === "string") {
      try {
        return (new StringParser(value)).int;
      } catch (e) {
        this.conversionErrors[parameterName] = e;
        return C.NaN;
      }
    } else {
      this.conversionErrors[parameterName] =
        `Unable to parse argument value as an Integer, given: ${value.toString()}`;
      return C.NaN;
    }
  }

  private convertArgToNumber(
    parameterName: string,
    value: any
  ): number {
    const paramSpec = this.paramSpecs[parameterName];

    if (Flt.instance(value)) {
      return Core.floatToNumber(Flt.getFloat(value));
    } else if (Int.instance(value)) {
      return Core.intToNumber(Int.getInt(value));
    } else if (Core.instance(value)) {
      return Core.floatToNumber(value);
    } else if (typeof value === "number") {
      return value;
    } else if (Core.instanceI(value)) {
      return Core.intToNumber(value);
    } else if ((value === null && paramSpec.default && paramSpec.default.canBeNull) ||
      (typeof value === "undefined" && paramSpec.default &&
        paramSpec.default.canBeUndefined)) {
      return <number>paramSpec.default.value;
    } else if ( typeof value === "string") {
      const parse = parseFloat(value);

      if (Number.isNaN(parse) && value.toLowerCase() !== "nan") {
        this.conversionErrors[parameterName] =
          `Unable to parse string argument as a number, given ${value}`;
        return NaN;
      } else {
        return parse;
      }
    } else {
      this.conversionErrors[parameterName] =
        `Unable to parse argument value as a Number given: ${value.toString()}`;
      return NaN;
    }
  }

  private checkForDomainDescriptionMatchF(
    parameterName: string,
    value: float
  ): void {
    const dd = (<DomainSpec>this.paramSpecs[parameterName].domain).description;

    // no description, implies a domain description match
    if (dd.length === 0) { return; }

    for (let subdomain of dd) {
      if (subdomain === "real") {
        if (Comparison.isFinite(value)) {
          return;
        }
      } else if (subdomain === "positive real") {
        if (Comparison.isPositive(value) && Comparison.isFinite(value)) {
          return;
        }
      } else if (subdomain === "nonnegative real") {
        if (!Comparison.isNegative(value) && Comparison.isFinite(value)){
          return;
        }
      } else if (subdomain === "negative real") {
        if (Comparison.isNegative(value) && Comparison.isFinite(value)) {
          return;
        }
      } else if (subdomain === "nonpositive real") {
        if (!Comparison.isPositive(value) && Comparison.isFinite(value)){
          return;
        }
      } else if (subdomain === "integer") {
        if (Conversion.isInteger(value)) {
          return;
        }
      } else if (subdomain === "positive integer") {
        if (Conversion.isInteger(value) && Comparison.isPositive(value)) {
          return;
        }
      } else if (subdomain === "nonnegative integer") {
        if (Conversion.isInteger(value) && !Comparison.isNegative(value)){
          return;
        }
      } else if (subdomain === "negative integer") {
        if (Conversion.isInteger(value) && Comparison.isNegative(value)) {
          return;
        }
      } else if (subdomain === "nonpositive integer") {
        if (Conversion.isInteger(value) && !Comparison.isPositive(value)){
          return;
        }
      } else if (subdomain === "positive noninteger real") {
        if (!Conversion.isInteger(value) &&
          Comparison.isPositive(value) &&
          Comparison.isFinite(value)) {
          return;
        }
      } else if (subdomain === "nonnegative noninteger real") {
        if (!Conversion.isInteger(value) &&
          !Comparison.isNegative(value) &&
          Comparison.isFinite(value)){
          return;
        }
      } else if (subdomain === "negative noninteger real") {
        if (!Conversion.isInteger(value) &&
          Comparison.isNegative(value) &&
          Comparison.isFinite(value)) {
          return;
        }
      } else if (subdomain === "nonpositive noninteger real") {
        if (!Conversion.isInteger(value) &&
          !Comparison.isPositive(value) &&
          Comparison.isFinite(value)){
          return;
        }
      } else if (subdomain === "probability") {
        if (!Comparison.isNegative(value) && Comparison.lteOne(value)) {
          return;
        }
      } else if (subdomain === "positive infinity") {
        if (Comparison.isPOSITIVE_INFINITY(value)) {
          return;
        }
      } else if (subdomain === "negative infinity") {
        if (Comparison.isNEGATIVE_INFINITY(value)) {
          return;
        }
      } else if (subdomain === "NaN"){
        if (Comparison.isNaN(value)) {
          return;
        }
      } else {
        throw new Error(`Unrecognized domain description: ${subdomain}`);
      }
    }

    // if we reach here, there was no domain description match
    this.domainErrors[parameterName].push(
      `The argument must be ${this.domainDescriptionStrings[parameterName]
      }. Given ${StringWriter.toStr(value)}`
    );
  }

  private checkForDomainDescriptionMatchI(
    parameterName: string,
    value: int
  ): void {
    const dd = (<DomainSpec>this.paramSpecs[parameterName].domain).description;

    // no description, implies a domain description match
    if (dd.length === 0) { return; }

    for (let subdomain of dd) {
      if (subdomain === "real") {
        if (Comparison.isFiniteI(value)) {
          return;
        }
      } else if (subdomain === "positive real") {
        if (Comparison.isPositiveI(value) && Comparison.isFiniteI(value)) {
          return;
        }
      } else if (subdomain === "nonnegative real") {
        if (!Comparison.isNegativeI(value) && Comparison.isFiniteI(value)){
          return;
        }
      } else if (subdomain === "negative real") {
        if (Comparison.isNegativeI(value) && Comparison.isFiniteI(value)) {
          return;
        }
      } else if (subdomain === "nonpositive real") {
        if (!Comparison.isPositiveI(value) && Comparison.isFiniteI(value)){
          return;
        }
      } else if (subdomain === "integer") {
        return;
      } else if (subdomain === "positive integer") {
        if (Comparison.isFiniteI(value) && Comparison.isPositiveI(value)) {
          return;
        }
      } else if (subdomain === "nonnegative integer") {
        if (Comparison.isFiniteI(value) && !Comparison.isNegativeI(value)){
          return;
        }
      } else if (subdomain === "negative integer") {
        if (Comparison.isFiniteI(value) && Comparison.isNegativeI(value)) {
          return;
        }
      } else if (subdomain === "nonpositive integer") {
        if (Comparison.isFiniteI(value) && !Comparison.isPositiveI(value)){
          return;
        }
      } else if (subdomain === "positive noninteger real") {
        // never matches for ints
      } else if (subdomain === "nonnegative noninteger real") {
        // never matches for ints
      } else if (subdomain === "negative noninteger real") {
        // never matches for ints
      } else if (subdomain === "nonpositive noninteger real") {
        // never matches for ints
      } else if (subdomain === "probability") {
        if (Comparison.isZeroI(value) && Comparison.isOneI(value)) {
          return;
        }
      } else if (subdomain === "positive infinity") {
        if (Comparison.isPOSITIVE_INFINITY_I(value)) {
          return;
        }
      } else if (subdomain === "negative infinity") {
        if (Comparison.isNEGATIVE_INFINITY_I(value)) {
          return;
        }
      } else if (subdomain === "NaN"){
        if (Comparison.isNaN_I(value)) {
          return;
        }
      } else {
        throw new Error(`Unrecognized domain description: ${subdomain}`);
      }
    }

    // if we reach here, there was no domain description match
    this.domainErrors[parameterName].push(
      `The argument must be ${this.domainDescriptionStrings[parameterName]
        }. Given ${StringWriter.toStr(value)}`
    );
  }

  private checkForDomainDescriptionMatchN(
    parameterName: string,
    value: number
  ): void {
    const dd = (<DomainSpec>this.paramSpecs[parameterName].domain).description;

    // no description, implies a domain description match
    if (dd.length === 0) { return; }

    for (let subdomain of dd) {
      if (subdomain === "real") {
        if (Number.isFinite(value)) {
          return;
        }
      } else if (subdomain === "positive real") {
        if (value > 0 && Number.isFinite(value)) {
          return;
        }
      } else if (subdomain === "nonnegative real") {
        if (value >= 0 && Number.isFinite(value)){
          return;
        }
      } else if (subdomain === "negative real") {
        if (value < 0 && Number.isFinite(value)) {
          return;
        }
      } else if (subdomain === "nonpositive real") {
        if (value <= 0 && Number.isFinite(value)){
          return;
        }
      } else if (subdomain === "integer") {
        if (Number.isInteger(value)) {
          return;
        }
      } else if (subdomain === "positive integer") {
        if (Number.isInteger(value) && value > 0) {
          return;
        }
      } else if (subdomain === "nonnegative integer") {
        if (Number.isInteger(value) && value >= 0){
          return;
        }
      } else if (subdomain === "negative integer") {
        if (Number.isInteger(value) && value < 0) {
          return;
        }
      } else if (subdomain === "nonpositive integer") {
        if (Number.isInteger(value) && value <= 0){
          return;
        }
      } else if (subdomain === "positive noninteger real") {
        if (!Number.isInteger(value) && value > 0 && Number.isFinite(value)) {
          return;
        }
      } else if (subdomain === "nonnegative noninteger real") {
        if (!Number.isInteger(value) && value >= 0 && Number.isFinite(value)){
          return;
        }
      } else if (subdomain === "negative noninteger real") {
        if (!Number.isInteger(value) && value < 0 && Number.isFinite(value)) {
          return;
        }
      } else if (subdomain === "nonpositive noninteger real") {
        if (!Number.isInteger(value) && value <= 0 && Number.isFinite(value)){
          return;
        }
      } else if (subdomain === "probability") {
        if (value >= 0 && value <= 1) {
          return;
        }
      } else if (subdomain === "positive infinity") {
        if (value === Number.POSITIVE_INFINITY) {
          return;
        }
      } else if (subdomain === "negative infinity") {
        if (value === Number.NEGATIVE_INFINITY) {
          return;
        }
      } else if (subdomain === "NaN"){
        if (Number.isNaN(value)) {
          return;
        }
      } else {
        throw new Error(`Unrecognized domain description: ${subdomain}`);
      }
    }

    // if we reach here, there was no domain description match
    this.domainErrors[parameterName].push(
      `The argument must be ${this.domainDescriptionStrings[parameterName]
        }. Given ${value}`
    );
  }

  private checkBoundConstraintsF(
    parameterName: string,
    value: float
  ): void {
    const domainSpec = (<DomainSpec>this.paramSpecs[parameterName].domain);

    if (domainSpec.upperBound) {
      const ub = <float>domainSpec.upperBound.value;
      const ubDescriptor = domainSpec.upperBound.descriptor ?
        `${domainSpec.upperBound.descriptor} = ${StringWriter.toStr(ub)}`
        :
        StringWriter.toStr(ub);

      if (domainSpec.upperBound.type === "open") {
        if (Comparison.gte(value, ub)) {
          this.domainErrors[parameterName].push(
            `The argument must be less than ${ubDescriptor}. Given ${value}`
          );
        }
      } else if (domainSpec.upperBound.type === "closed") {
        if (Comparison.gt(value, ub)) {
          this.domainErrors[parameterName].push(
            `The argument must be less than or equal to ${ubDescriptor}. Given: ${value}`
          );
        }
      } else {
        throw new Error(
          `Unrecognized domain upper bound type: ${domainSpec.upperBound.type}`
        );
      }
    }

    if (domainSpec.lowerBound) {
      const lb = <float>domainSpec.lowerBound.value;
      const lbDescriptor = domainSpec.lowerBound.descriptor ?
        `${domainSpec.lowerBound.descriptor} = ${StringWriter.toStr(lb)})`
        :
        StringWriter.toStr(lb);

      if (domainSpec.lowerBound.type === "open") {
        if (Comparison.lte(value, lb)) {
          this.domainErrors[parameterName].push(
            `The argument must be greater than ${lbDescriptor}. Given ${value}`
          );
        }
      } else if (domainSpec.lowerBound.type === "closed") {
        if (Comparison.lt(value, lb)) {
          this.domainErrors[parameterName].push(
            `The argument must be greater than or equal to ${lbDescriptor}. Given: ${value
            }`
          );
        }
      } else {
        throw new Error(
          `Unrecognized domain lower bound type: ${domainSpec.lowerBound.type}`
        );
      }
    }
  }

  private static domainDescriptionStr(dd: DomainDescription[]): string {
    let result = "";
    let str: string;
    let subdomain: string;

    for (let i = 0; i < dd.length; i++) {
      subdomain = dd[i];

      if (subdomain === "probability") {
        str = "a probability (in interval [0, 1])"
      } else if (subdomain === "integer") {
        str = `an ${subdomain}`;
      } else if (subdomain === "NaN") {
        return "not a number (NaN)"
      } else if (subdomain === "positive infinity" ||
        subdomain === "negative infinity") {
        return subdomain;
      } else {
        return `a ${subdomain}`;
      }

      if (i === 0) {
        result += str;
      } else {
        result += ` or ${str}`;
      }
    }

    return result;
  }
}

import {int} from "../interfaces/int";
import {float} from "../interfaces/float";

import {Int as IntAlias} from "./Int";
const Int = IntAlias;
export type Int = IntAlias;

import {Flt as FltAlias} from "./Flt";
const Flt = FltAlias;
export type Flt = FltAlias;

import {C as CAlias} from "../constants/C";
const C = CAlias;

import {Core as CoreAlias} from "../core/Core";
const Core = CoreAlias;

import {Comparison as ComparisonAlias} from "../basicFunctions/Comparison";
const Comparison = ComparisonAlias;

import {Conversion as ConversionAlias} from "../core/Conversion";
const Conversion = ConversionAlias;

import {StringParser as StringParserAlias} from "../core/StringParser";
const StringParser = StringParserAlias;

import {StringWriter as StringWriterAlias} from "../core/StringWriter";
const StringWriter = StringWriterAlias;

import {P as PAlias} from "../dataTypes/P";
const P = PAlias;
export type P = PAlias;