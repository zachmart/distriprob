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

export type PackageFunction = (value, config?: Configuration) => any;
export type PackageFunctionGen = (fw: FunctionWrapper, index: number) => PackageFunction;


export class Input {
  public static className: string;

  public static init0(): void {
    Input.className = "Input";
  }

  public static getInputValuesForExternalFunct(
    internalFunctionSpec: internalFunctionSpec,
    method?: MethodSpec
  ): {
    params: Array<ParameterSpec>,
    packageFunctGens: Array<PackageFunctionGen>,
    configParamIndex: number
  } {
    let configParamIndex = -1;
    const params: Array<ParameterSpec> = [];
    const packageFunctionGens: Array<PackageFunctionGen> = [];
    let i: number;

    for(i = 0; i < internalFunctionSpec.params.length; i++) {
      const paramSpec = internalFunctionSpec.params[i];

      switch(paramSpec.type) {
        case "string":
          packageFunctionGens.push(Input.getStringArgPackagingFunction);
          params.push(paramSpec);
          break;
        case "boolean":
          packageFunctionGens.push(Input.getBooleanArgPackagingFunction);
          params.push(paramSpec);
          break;
        case "number":
          packageFunctionGens.push(Input.getNumberEquivalentArgPackageFunction);
          params.push({
            type: "numberEquivalent",
            name: paramSpec.name,
            default: paramSpec.default,
          });
          break;
        case "float":
          if (method &&
            method.type === "Float" &&
            method.thisParamName === paramSpec.name){
            params.push({
              type: "Float",
              name: "the_Float_instance",
              instance: true
            });
            packageFunctionGens.push(Input.getFloatInstanceArgPackageFunction);
          } else {
            packageFunctionGens.push(
              Input.getFloatEquivalentArgPackagingFunction
            );
            params.push({
              type: "FloatEquivalent",
              name: paramSpec.name,
              default: Core.instance(paramSpec.default) ?
                FloatUtil.createFloat(paramSpec.default)
                :
                paramSpec.default
            });
          }
          break;
        case "int":
          if (method &&
            method.type === "Int" &&
            method.thisParamName === paramSpec.name) {
            params.push({
              type: "Int",
              name: "the_Int_instance",
              instance: true
            });
            packageFunctionGens.push(Input.getIntInstanceArgPackageFunction);
          } else {
            packageFunctionGens.push(Input.getIntEquivalentArgPackageFunction);
            params.push({
              type: "IntEquivalent",
              name: paramSpec.name,
              default: Core.instanceI(paramSpec.default) ?
                IntUtil.createInt(paramSpec.default)
                :
                paramSpec.default
            });
          }
          break;
        case "P":
          packageFunctionGens.push(Input.getConfigToPrecArgPackageFunction);
          params.push({
            type: "Config",
            name: "config",
          });
          configParamIndex = i;
          break;
        case "Config":
          packageFunctionGens.push(Input.getConfigArgPackageFunction);
          params.push({
            type: "Config",
            name: "config"
          });
          configParamIndex = i;
          break;
        default:
          throw new LibError(
            "Input",
            "constructor",
            `Unrecognized parameter specification type, given: ${paramSpec.type
              }.`
          );
      }
    }

    // Add Config parameter to end if it hasn't been specified in the internal function
    if (configParamIndex < 0) {
      packageFunctionGens.push(this.getConfigArgPackageFunction);
      params.push({
        type: "Config",
        name: "config"
      });
      configParamIndex = i;
    }

    return {
      params: params,
      packageFunctGens: packageFunctionGens,
      configParamIndex: configParamIndex
    }
  }


  private static getStringArgPackagingFunction(
    fw: FunctionWrapper,
    index: number,
  ): (value: any) => string {
    const paramSpec = fw.internalSpec.params[index];
    const defaultVal = paramSpec.default;
    const defaultAvailable = typeof defaultVal === "string";

    return (value: any): string => {
      if (typeof value === "string") {
        return value;
      } else if (defaultAvailable && (value === null || typeof value === "undefined")) {
        return <string>defaultVal;
      } else {
        // Todo fill out with correct ArgumentError
        throw Error("Not correctly implemented yet");
      }
    };
  }

  private static getBooleanArgPackagingFunction(
    fw: FunctionWrapper,
    index: number,
  ): (value: any) => boolean {
    const paramSpec = fw.internalSpec.params[index];
    const defaultVal = paramSpec.default;
    const defaultAvailable = typeof defaultVal === "boolean";

    return (value: any): boolean => {
      if (typeof value === "boolean") {
        return value;
      } else if (defaultAvailable && (value === null || typeof value === "undefined")) {
        return <boolean>defaultVal;
      } else {
        // Todo fill out with correct ArgumentError
        throw Error("Not correctly implemented yet");
      }
    };
  }

  private static getFloatInstanceArgPackageFunction(
    fw: FunctionWrapper,
    index: number
  ): (value: any) => float {
    return FloatUtil.getfloat;
  }

  private static getFloatEquivalentArgPackagingFunction(
    fw: FunctionWrapper,
    index: number
  ): (value: any, config: Configuration) => float {
    const paramSpec = fw.internalSpec.params[index];
    const defaultVal = paramSpec.default;
    const defaultAvailable = Core.instance(defaultVal);

    return (value: any, config: Configuration): float => {
      let result: float;

      if (FloatUtil.isFloat(value)) {
        result = FloatUtil.getfloat(value);
      } else if (JSONFloat.instance(value)) {
        result = JSONFloat.parse(value);
      } else if (IntUtil.isInt(value)) {
        result = Conversion.intToFloatFullPrecision(
          IntUtil.getint(value),
          true
        );
      } else if (JSONInt.instance(value)) {
        result = Conversion.intToFloatFullPrecision(
          JSONInt.parse(value),
          true
        );
      } else if (typeof value === "number") {
        result = Core.numberToFloat(value);
      } else if (defaultAvailable && (value === null || typeof value === "undefined")) {
        result = <float>defaultVal;
      } else if ( typeof value === "string") {
        try {
          result = (new StringParser(value)).float(Configuration.getP(config));
        } catch (e) {
          // Todo fill out with correct ArgumentError
          throw Error("Not correctly implemented yet");
        }
      } else {
        // Todo fill out with correct ArgumentError
        throw Error("Not correctly implemented yet");
      }

      return result;
    };
  }

  private static getIntInstanceArgPackageFunction(
    fw: FunctionWrapper,
    index: number
  ): (value: any) => int {
    return IntUtil.getint;
  }

  private static getIntEquivalentArgPackageFunction(
    fw: FunctionWrapper,
    index: number
  ): (value: any) => int {
    const paramSpec = fw.internalSpec.params[index];
    const defaultVal = paramSpec.default;
    const defaultAvailable = Core.instanceI(defaultVal);

    return (value: any): int => {
      let result: int;

      if (FloatUtil.isFloat(value)) {
        const floatValue = FloatUtil.getfloat(value);

        if (!Conversion.isInteger(floatValue)) {
          // Todo fill out with correct ArgumentError
          throw Error("Not correctly implemented yet3");
        } else {
          result = Conversion.floatToInt(floatValue, "trunc");
        }
      } else if (IntUtil.isInt(value)) {
        result = IntUtil.getint(value);
      } else if (Core.instance(value)) {
        if (!Conversion.isInteger(value)) {
          // Todo fill out with correct ArgumentError
          throw Error("Not correctly implemented yet");
        } else {
          result = Conversion.floatToInt(value, "trunc");
        }
      } else if (typeof value === "number") {
        if (!Number.isInteger(value)) {
          // Todo fill out with correct ArgumentError
          throw Error("Not correctly implemented yet");
        } else {
          result = Core.numberToInt(value);
        }
      } else if (Core.instanceI(value)) {
        result = value;
      } else if (defaultAvailable && (value === null || typeof value === "undefined")) {
        result = <int>defaultVal;
      } else if (typeof value === "string") {
        try {
          result = (new StringParser(value)).int;
        } catch (e) {
          /// Todo fill out with correct ArgumentError
          throw Error("Not correctly implemented yet");
        }
      } else {
        // Todo fill out with correct ArgumentError
        throw Error("Not correctly implemented yet");
      }

      return result;
    };
  }

  private static getNumberEquivalentArgPackageFunction(
    fw: FunctionWrapper,
    index: number
  ): (value: any) => number {
    const internalParamSpec = fw.internalSpec.params[index];
    const defaultVal = internalParamSpec.default;
    const defaultAvailable = typeof defaultVal === "number";

    return (value: any): number => {
      if (FloatUtil.isFloat(value)) {
        return Core.floatToNumber(FloatUtil.getfloat(value));
      } else if (IntUtil.isInt(value)) {
        return Core.intToNumber(IntUtil.getint(value));
      } else if (Core.instance(value)) {
        return Core.floatToNumber(value);
      } else if (typeof value === "number") {
        return value;
      } else if (Core.instanceI(value)) {
        return Core.intToNumber(value);
      } else if (defaultAvailable && (value === null || typeof value === "undefined")) {
        return <number>defaultVal;
      } else if (typeof value === "string") {
        const parse = parseFloat(value);

        if (Number.isNaN(parse) &&(<string>value).toLowerCase() !== "nan") {
          // Todo fill out with correct ArgumentError
          throw Error("Not correctly implemented yet");
        } else {
          return parse;
        }
      } else {
        // Todo fill out with correct ArgumentError
        throw Error("Not correctly implemented yet");
      }
    }
  }


  private static getConfigToPrecArgPackageFunction(
    fw: FunctionWrapper,
    index: number
  ): (value: any) => P {
    return (value: any): P => {
      if (Configuration.instance(value)) {
        return PREC.getRelativeP(Configuration.getP(value), fw.relPrec);
      } else if (value === null || typeof value === "undefined") {
        return PREC.getRelativeP(Configuration.getP(Configuration.default), fw.relPrec);
      } else {
        // Todo fill out with correct ArgumentError
        throw Error("Not correctly implemented yet");
      }
    };
  }

  private static getConfigArgPackageFunction(
    fw: FunctionWrapper,
    index: number
  ): (value: any) => Configuration {
    return (value: any): Configuration => {
      if (Configuration.instance(value)) {
        return Configuration.getIdenticalConfigExceptRelativePIs(
          value,
          fw.relPrec
        );
      } else if (value === null || typeof value === "undefined") {
        return Configuration.getIdenticalConfigExceptRelativePIs(
          Configuration.default,
          fw.relPrec
        );
      } else {
        // Todo fill out with correct ArgumentError
        throw Error("Not correctly implemented yet");
      }
    }
  }


  public static dependencies(): Set<Class> {
    return new Set([
      Core, JSONFloat, FloatUtil, JSONInt, IntUtil, PREC, Conversion, StringParser,
      LibError, Configuration,
    ]);
  }
}


// *** imports come at end to avoid circular dependency ***

import {Configuration as ConfigurationAlias} from "../Configuration";
import {P as PAlias} from "../../dataTypes/P";
import {FunctionWrapper as FunctionWrapperAlias} from "./FunctionWrapper";

// interface/type imports
import {Class} from "../../interfacesAndTypes/Class";
import {float} from "../../interfacesAndTypes/float";
import {int} from "../../interfacesAndTypes/int";
import {ParameterSpec} from "../../interfacesAndTypes/ParameterSpecs/ParameterSpec";
import {internalFunctionSpec} from "../../core/Library";
import {MethodSpec} from "../API/APISpec";
type FunctionWrapper = FunctionWrapperAlias;
type Configuration = ConfigurationAlias;
type P = PAlias;

// functional imports
import {Core as CoreAlias} from "../../core/Core";
const Core = CoreAlias;

import {JSONFloat as JSONFloatAlias} from "../../dataTypes/JSONFloat";
const JSONFloat = JSONFloatAlias;

import {FloatUtil as FloatUtilAlias} from "../FloatUtil";
const FloatUtil = FloatUtilAlias;

import {JSONInt as JSONIntAlias} from "../../dataTypes/JSONInt";
const JSONInt = JSONIntAlias;

import {IntUtil as IntUtilAlias} from "../IntUtil";
const IntUtil = IntUtilAlias;

import {PREC as PRECAlias} from "../../constants/PREC";
const PREC = PRECAlias;

import {Conversion as ConversionAlias} from "../../core/Conversion";
const Conversion = ConversionAlias;

import {StringParser as StringParserAlias} from "../../core/StringParser";
const StringParser = StringParserAlias;

import {LibError as LibErrorAlias} from "../../errors/LibError";
const LibError = LibErrorAlias;

const Configuration = ConfigurationAlias;
