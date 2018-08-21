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

export type IntSpec = {
  type: "int",
  paramIndex: number,
  default?: int
}

export type FloatSpec = {
  type: "float",
  paramIndex: number,
  default?: float
}

export type NumberSpec = {
  type: "number",
  paramIndex: number,
  default?: number
}

export type PSpec = {
  type: "P",
  paramIndex: number,
  default?: P
}

export type BooleanSpec = {
  type: "boolean",
  paramIndex: number,
  default?: boolean
}

export type StringSpec = {
  type: "string",
  paramIndex: number,
  default: string
}

export type ParameterSpec = IntSpec | FloatSpec | NumberSpec | PSpec | BooleanSpec |
  StringSpec;

export type ReturnType = "float" | "int" | "Config" | "JSONFloat" | "JSONInt" |
  "string" | "number" | "boolean" | "IntDivResult" | "FloatDivResult";


// export type DefaultSpec = {
//   canBeNull: boolean,
//   canBeUndefined: boolean,
//   value: float | int | number | string | boolean | null,
// };
//
// export type ValueSpec = {
//   convertTo: "number" | "int" | "float"
// }
//
// export type ConfigSpec = {
//   relativeBaseDigitsToRun: number,
//   useAs: "Config" | "P"
// }
//
// export type ParameterSpec = {
//   inIndex: number,
//   default?: DefaultSpec,
//   domain: ValueSpec |
//     ConfigSpec |
//     "boolean" |
//     "string" |
//     "seed"
// };
//
// export type thisSpec = {
//   thisIndex: number;
//   type: "float" | "int"
// }
//
//
//
// export type ExternalReturnType = "Flt" | "Int" | "Config" | "JSONFloat" | "JSONInt" |
//   "string" | "number" | "boolean";


/**
 * This class's instances are used to store metadata on internal functions that are
 * exposed outside the library through the library interface. Data stored in this class's
 * instances include:
 *  - information on function parameters
 *    + the internal name of the parameter
 *    + the expected type of each parameter
 *    + the index of the parameter in the function's argument list
 *    + any default values of the parameter when the given value is null or undefined
 *  - the return type of the function
 *  - the class in which the function resides
 *  - the name of the function in the class in which it resides
 *
 *  This class also maintains a table of wrapped functions hierarchically by class name
 *  and then by function name within that class
 */
export class Wrapper {
  public static className: string;
  private static _table: {[className: string]: {[functionName: string]: Wrapper}};

  private static init0(): void {
    Wrapper.className = "LibraryEntry";
    Wrapper._table = {};
  }

  private static insertTableEntry(
    className: string,
    functionName: string,
    wrapper: Wrapper
  ): void {
    if (typeof Wrapper._table[className] === "undefined") {
      Wrapper._table[className] = {};
    }

    Wrapper._table[className][functionName] = wrapper;
  }

  private readonly class: Class;
  private readonly functionName: string;
  private readonly funct: Function;
  private readonly paramSpecs: {[parameterName: string]: ParameterSpec};
  private readonly returnType: ReturnType;

  // private readonly argUseOrder: Array<string>;
  // private readonly argPackagingFuncts:
  //   {[parameterName: string]: (
  //      functionName: string,
  //      parameterName: string,
  //      value: any,
  //      defaultSpec: DefaultSpec,
  //      thisIndex,
  //      p: P
  //     ) => any};
  // private readonly configInIndex: number;


  constructor(
    classImp: Class,
    functionName: string,
    funct: Function,
    paramSpecs: {[parameterName: string]: ParameterSpec},
    argUseOrder: Array<string>,
    returnType: ReturnType
  ) {
    this.class = classImp;
    this.functionName = functionName;
    this.funct = funct;
    this.paramSpecs = paramSpecs;
    this.returnType = returnType;

    // for (let parameterName in paramSpecs) {
    //   const paramSpec = this.paramSpecs[parameterName];
    //
    //   if (Wrapper.isValSpec(paramSpec.domain)) {
    //     if (paramSpec.domain.convertTo === "float") {
    //       this.argPackagingFuncts[parameterName] = Wrapper.packageArgAsFloat;
    //     }
    //   } else if (Wrapper.isConfigSpec(paramSpec.domain)) {
    //     this.configInIndex = paramSpec.inIndex;
    //
    //     this.argPackagingFuncts
    //   } else if (paramSpec.domain === "string") {
    //
    //   } else if (paramSpec.domain === "boolean") {
    //
    //   } else if (paramSpec.domain === "seed") {
    //
    //   }
    // }
  }

  // private static getArgError(
  //   functionName: string,
  //   message: string,
  //   wrap: Wrapper,
  //   thisIndex: number,
  // ): {[parameterName: string]: {value: any, expectedType: TypeDescriptor}} {
  //   let parameters: {[parameterName: string]: {value: any, expectedType: TypeDescriptor}}
  //     = {};
  //
  //   for (let paramName in wrap.paramSpecs) {
  //     const paramSpec = wrap.paramSpecs[paramName];
  //     if (thisIndex === paramSpec.inIndex) {}
  //
  //     parameters[paramName] = {value:}
  //   }
  //
  //   return result;
  // }
  //
  // private static packageArgAsFloat(
  //   functName: string,
  //   parameterName: string,
  //   value: any,
  //   defaultSpec: DefaultSpec | undefined,
  //   thisIndex: number,
  //   p: P
  // ): float {
  //   if (Flt.instance(value)) {
  //     return Flt.getFloat(value);
  //   } else if (JSONFloat.instance(value)) {
  //     return JSONFloat.parse(value);
  //   } else if (Int.instance(value)) {
  //     return Conversion.intToFloatFullPrecision(Int.getInt(value), true);
  //   } else if (JSONInt.instance(value)) {
  //     return Conversion.intToFloatFullPrecision(
  //       JSONInt.parse(value),
  //       true
  //     );
  //   } else if (typeof value === "number") {
  //     return Core.numberToFloat(value);
  //   } else if ((value === null && defaultSpec && defaultSpec.canBeNull) ||
  //           (typeof value === "undefined" && defaultSpec && defaultSpec.canBeUndefined)) {
  //     return <float>defaultSpec.value;
  //   } else if ( typeof value === "string") {
  //     try {
  //       return (new StringParser(value)).float(p);
  //     } catch (e) {
  //       throw new ArgumentError(
  //         functName,
  //
  //       )
  //
  //       this.conversionErrors[parameterName] = e;
  //       return C.F_NaN;
  //     }
  //   } else {
  //     this.conversionErrors[parameterName] =
  //       `Unable to parse argument value as a Float, given: ${value.toString()}`;
  //     return C.F_NaN;
  //   }
  // }
  //
  // private convertArgToInt(
  //   parameterName: string,
  //   value: any
  // ): int {
  //   const paramSpec = this.paramSpecs[parameterName];
  //
  //   if (Flt.instance(value)) {
  //     const floatValue = Flt.getFloat(value);
  //
  //     if (!Conversion.isInteger(floatValue)) {
  //       this.conversionErrors[parameterName] =
  //         `Argument must be an integer, given: ${StringWriter.toStr(floatValue)}`;
  //       return C.NaN;
  //     } else {
  //       return Conversion.floatToInt(floatValue, "trunc");
  //     }
  //   } else if (Int.instance(value)) {
  //     return Int.getInt(value);
  //   } else if (Core.instance(value)) {
  //     if (!Conversion.isInteger(value)) {
  //       this.conversionErrors[parameterName] =
  //         `Argument must be an integer, given: ${StringWriter.toStr(value)}`;
  //       return C.NaN;
  //     } else {
  //       return Conversion.floatToInt(value, "trunc");
  //     }
  //   } else if (typeof value === "number") {
  //     if (!Number.isInteger(value)) {
  //       this.conversionErrors[parameterName] =
  //         `Argument must be an integer, given: ${value}`;
  //       return C.NaN;
  //     } else {
  //       return Core.numberToInt(value);
  //     }
  //   } else if (Core.instanceI(value)) {
  //     return value;
  //   } else if ((value === null && paramSpec.default && paramSpec.default.canBeNull) ||
  //     (typeof value === "undefined" && paramSpec.default &&
  //       paramSpec.default.canBeUndefined)) {
  //     return <int>paramSpec.default.value;
  //   } else if ( typeof value === "string") {
  //     try {
  //       return (new StringParser(value)).int;
  //     } catch (e) {
  //       this.conversionErrors[parameterName] = e;
  //       return C.NaN;
  //     }
  //   } else {
  //     this.conversionErrors[parameterName] =
  //       `Unable to parse argument value as an Integer, given: ${value.toString()}`;
  //     return C.NaN;
  //   }
  // }
  //
  // private convertArgToNumber(
  //   parameterName: string,
  //   value: any
  // ): number {
  //   const paramSpec = this.paramSpecs[parameterName];
  //
  //   if (Flt.instance(value)) {
  //     return Core.floatToNumber(Flt.getFloat(value));
  //   } else if (Int.instance(value)) {
  //     return Core.intToNumber(Int.getInt(value));
  //   } else if (Core.instance(value)) {
  //     return Core.floatToNumber(value);
  //   } else if (typeof value === "number") {
  //     return value;
  //   } else if (Core.instanceI(value)) {
  //     return Core.intToNumber(value);
  //   } else if ((value === null && paramSpec.default && paramSpec.default.canBeNull) ||
  //     (typeof value === "undefined" && paramSpec.default &&
  //       paramSpec.default.canBeUndefined)) {
  //     return <number>paramSpec.default.value;
  //   } else if ( typeof value === "string") {
  //     const parse = parseFloat(value);
  //
  //     if (Number.isNaN(parse) && value.toLowerCase() !== "nan") {
  //       this.conversionErrors[parameterName] =
  //         `Unable to parse string argument as a number, given ${value}`;
  //       return NaN;
  //     } else {
  //       return parse;
  //     }
  //   } else {
  //     this.conversionErrors[parameterName] =
  //       `Unable to parse argument value as a Number given: ${value.toString()}`;
  //     return NaN;
  //   }
  // }
  //
  // private static isValSpec(x: any): x is ValueSpec {
  //   return typeof x === "object" && x !== null &&
  //     (x.convertTo === "float" || x.convertTo === "int" || x.convertTo === "number");
  // }
  //
  // private static isConfigSpec(x: any): x is ConfigSpec {
  //   return typeof x === "object" && x !== null &&
  //     typeof x.relativeBaseDigitsToRun === "number";
  // }
}


// *** imports come at end to avoid circular dependency ***

// interface/type imports
import {int} from "../interfaces/int";
import {float} from "../interfaces/float";
import {Class} from "../interfaces/Class";

import {P as PAlias} from "../dataTypes/P";
export type P = PAlias;