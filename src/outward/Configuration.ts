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


export class Configuration {
  public static className: string;
  public static default: Configuration;

  public static init0(): void {
    Configuration.className = "Configuration";
  }

  public static init3(): void {
    Configuration.default = new Configuration(
      PREC.getPFromDecimalDigits(7),
      "throw error",
      "allow",
      "throw error",
      "throw error",
      "allow"
    );
  }

  public static defaultBaseDigits(): number {
    return Configuration.default._p.baseDigits;
  }

  public static defaultBinaryDigits(): number {
    return Configuration.default._p.binDigits;
  }

  public static defaultDecimalDigits(): number {
    return Configuration.default._p.decDigits;
  }

  public static defaultOnNaNInput(): "throw error" | "return NaN" {
    return Configuration.default._onNaNInput;
  }

  public static defaultOnInfiniteInput(): "throw error" | "allow" {
    return Configuration.default._onInfiniteOutput;
  }

  public static defaultOnOutsideDomainInput(): "throw error" | "return NaN" {
    return Configuration.default._onOutsideDomainInput;
  }

  public static defaultOnUnparsableInput(): "throw error" | "return NaN" {
    return Configuration.default._onUnparsableInput;
  }

  public static defaultOnInfiniteOutput():  "throw error" | "allow" {
    return Configuration.default._onInfiniteOutput;
  }

  public static setDefaultBaseDigits(baseDigits: number): void {
    Configuration.default = new Configuration(
      PREC.getPFromBaseDigits(baseDigits),
      Configuration.default.onNaNInput,
      Configuration.default.onInfiniteInput,
      Configuration.default.onOutsideDomainInput,
      Configuration.default.onUnparsableInput,
      Configuration.default.onInfiniteOutput
    );
  }

  public static setDefaultBinaryDigitsPrecision(binaryDigits: number): void {
    Configuration.default =
      Configuration.default.getIdenticalConfigExceptBinaryDigitsPrecisionIs(binaryDigits);
  }

  public static setDefaultDecimalDigitsPrecision(decimalDigits: number): void {
    Configuration.default =
      Configuration.default.getIdenticalConfigExceptDecimalDigitsPrecisionIs(
        decimalDigits
      );
  }

  public static setDefaultOnNaNInput(onNaNInput: "throw error" | "return NaN"): void {
    Configuration.default =
      Configuration.default.getIdenticalConfigExceptOnNaNInputIs(onNaNInput);
  }

  public static setDefaultOnInfiniteInput(onInfiniteInput: "throw error" | "allow"): void{
    Configuration.default =
      Configuration.default.getIdenticalConfigExceptOnInfiniteInputIs(onInfiniteInput);
  }

  public static setDefaultOnOutsideDomainInput(
    onOutsideDomainInput: "throw error" | "return NaN"
  ): void {
    Configuration.default =
      Configuration.default.getIdenticalConfigExceptOnOutsideDomainInputIs(
        onOutsideDomainInput
      );
  }

  public static setDefaultOnUnparsableInput(
    onUnparsableInput: "throw error" | "return NaN"
  ): void {
    Configuration.default =
      Configuration.default.getIdenticalConfigExceptOnUnparsableInputIs(
        onUnparsableInput
      );
  }

  public static setDefaultOnInfiniteOutput(
    onInfiniteOutput:  "throw error" | "allow"
  ): void {
    Configuration.default =
      Configuration.default.getIdenticalConfigExceptOnInfiniteOutputIs(onInfiniteOutput);
  }

  public static instance(x: any): x is Configuration {
    return typeof x === "object" && x !== null && P.instance(x._p) &&
      typeof x._onNaNInput === "string" &&
      (x._onNaNInput === "throw error" || x._onNaNInput === "return NaN") &&
      typeof x._onInfiniteInput === "string" &&
      (x._onInfiniteInput === "throw error" || x._onInfiniteInput === "allow") &&
      typeof x._onOutsideDomainInput === "string" &&
      (x._onOutsideDomainInput==="throw error"||x._onOutsideDomainInput==="return NaN") &&
      typeof x._onUnparsableInput === "string" &&
      (x._onUnparsableInput === "throw error" || x._onUnparsableInput === "return NaN") &&
      typeof x._onInfiniteOutput === "string" &&
      (x._onInfiniteOutput === "throw error" || x._onInfiniteOutput === "allow");
  }

  public static getP(config: Configuration): P {
    return config._p;
  }

  public static getIdenticalConfigExceptRelativePIs(
    config: Configuration,
    relativeBaseDigits: number
  ): Configuration {
    return new Configuration(
      PREC.getRelativeP(config._p, relativeBaseDigits),
      config._onNaNInput,
      config._onInfiniteInput,
      config._onOutsideDomainInput,
      config._onUnparsableInput,
      config._onInfiniteOutput
    );
  }

  private readonly _p: P;
  private readonly _onNaNInput: "throw error" | "return NaN";
  private readonly _onInfiniteInput: "throw error" | "allow";
  private readonly _onOutsideDomainInput: "throw error" | "return NaN";
  private readonly _onUnparsableInput: "throw error" | "return NaN";
  private readonly _onInfiniteOutput: "throw error" | "allow";

  constructor(
    p: P,
    onNaNInput: "throw error" | "return NaN",
    onInfiniteInput: "throw error" | "allow",
    onOutsideDomainInput: "throw error" | "return NaN",
    onUnparsableInput: "throw error" | "return NaN",
    onInfiniteOutput: "throw error" | "allow"
  ) {
    this._p = p;
    this._onNaNInput = onNaNInput;
    this._onInfiniteInput = onInfiniteInput;
    this._onOutsideDomainInput = onOutsideDomainInput;
    this._onUnparsableInput = onUnparsableInput;
    this._onInfiniteOutput = onInfiniteOutput;
  }

  public get binaryDigitsPrecision(): number{ return this._p.binDigits; }

  public get decimalDigitsPrecsion(): number { return this._p.decDigits; }

  public get onNaNInput(): "throw error" | "return NaN" { return this._onNaNInput; }

  public get onInfiniteInput(): "throw error" | "allow" { return this._onInfiniteInput; }

  public get onOutsideDomainInput(): "throw error" | "return NaN" {
    return this._onOutsideDomainInput;
  }

  public get onUnparsableInput(): "throw error" | "return NaN" {
    return this._onUnparsableInput;
  }

  public get onInfiniteOutput(): "throw error" | "allow" { return this._onInfiniteOutput;}

  public getIdenticalConfigExceptBinaryDigitsPrecisionIs(
    binaryDigitsPrecision: number
  ): Configuration {
    return new Configuration(
      PREC.getPFromBinaryDigits(binaryDigitsPrecision),
      this._onNaNInput,
      this._onInfiniteInput,
      this._onOutsideDomainInput,
      this._onUnparsableInput,
      this._onInfiniteOutput
    );
  }

  public getIdenticalConfigExceptDecimalDigitsPrecisionIs(
    decimalDigitsPrecision: number
  ): Configuration {
    return new Configuration(
      PREC.getPFromDecimalDigits(decimalDigitsPrecision),
      this._onNaNInput,
      this._onInfiniteInput,
      this._onOutsideDomainInput,
      this._onUnparsableInput,
      this._onInfiniteOutput
    );
  }

  public getIdenticalConfigExceptOnNaNInputIs(
    onNaNInput: "throw error" | "return NaN"
  ): Configuration {
    return new Configuration(
      this._p,
      onNaNInput,
      this._onInfiniteInput,
      this._onOutsideDomainInput,
      this._onUnparsableInput,
      this._onInfiniteOutput
    );
  }

  public getIdenticalConfigExceptOnInfiniteInputIs(
    onInfiniteInput: "throw error" | "allow"
  ): Configuration {
    return new Configuration(
      this._p,
      this._onNaNInput,
      onInfiniteInput,
      this._onOutsideDomainInput,
      this._onUnparsableInput,
      this._onInfiniteOutput
    );
  }

  public getIdenticalConfigExceptOnOutsideDomainInputIs(
    onOutsideDomainInput: "throw error" | "return NaN"
  ): Configuration {
    return new Configuration(
      this._p,
      this._onNaNInput,
      this._onInfiniteInput,
      onOutsideDomainInput,
      this._onUnparsableInput,
      this._onInfiniteOutput
    );
  }

  public getIdenticalConfigExceptOnUnparsableInputIs(
    onUnparsableInput: "throw error" | "return NaN"
  ): Configuration {
    return new Configuration(
      this._p,
      this._onNaNInput,
      this._onInfiniteInput,
      this._onOutsideDomainInput,
      onUnparsableInput,
      this._onInfiniteOutput
    );
  }

  public getIdenticalConfigExceptOnInfiniteOutputIs(
    onInfiniteOutput: "throw error" | "allow"
  ): Configuration {
    return new Configuration(
      this._p,
      this._onNaNInput,
      this._onInfiniteInput,
      this._onOutsideDomainInput,
      this._onUnparsableInput,
      onInfiniteOutput
    );
  }


  // class dependencies
  public static dependencies(): Set<Class> {
    return new Set([
      P, PREC,
    ]);
  }
}

// *** imports come at end to avoid circular dependency ***

// interface/type imports
import {Class} from "../interfacesAndTypes/Class";

// functional imports
import {P as PAlias} from "../dataTypes/P";
const P = PAlias;
export type P = PAlias;

import {PREC as PRECAlias} from "../constants/PREC";
const PREC = PRECAlias;