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


export interface WELL512AState extends IRandomState {
  readonly type: "WELL512A";
  readonly s: number[];
  readonly i: number;
}


export class WELL512A {
  public static className: "WELL512A";
  private static K: number;
  private static W: number;
  private static R: number;
  private static R_MINUS_1: number;
  private static M1: number;
  private static M2: number;
  private static M3: number;
  private static A1: number;

  public static init0(): void {
    WELL512A.className = "WELL512A";
    WELL512A.K = 512;
    WELL512A.W = 32;
    WELL512A.R = 16;
    WELL512A.R_MINUS_1 = WELL512A.R - 1;
    WELL512A.M1 = 13;
    WELL512A.M2 = 9;
    WELL512A.M3 = 5;
    WELL512A.A1 = 0xDA442D24;
  }

  public static isState(x: any): x is WELL512AState {
    if (typeof x === "object" && x !== null && typeof x.type === "string" &&
      x.type === WELL512A.className && typeof x.i === "number" && Array.isArray(x.s) &&
      x.s.length === WELL512A.R) {
      for(let i = 0; i < WELL512A.R; i++) {
        if (typeof x.s[i] !== "number") {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  }

  private _s: Uint32Array;
  private _i: number;

  constructor(seed: number | string | null | undefined | WELL512AState) {
    if (WELL512A.isState(seed)) {
      this._i = seed.i;
      this._s = Uint32Array.from(seed.s);
    } else {
      this._i = 0;

      const seedType = typeof seed;

      if (seedType === "undefined" || seed === null) {
        // get a random seed
        this._s = <Uint32Array> RandomUtil.getRandomTypedArray(
          WELL512A.R,
          32
        );
      } else if (seedType === "number" || seedType === "string") {
        this._s = <Uint32Array> RandomUtil.getSeededTypedArray(
          WELL512A.R,
          32,
          seed + "\0" // forcing numbers into strings here
        );

      } else {
        throw new DomainError(
          WELL512A.className,
          "constructor",
          {seed: {value: seed, expectedType: "seed"}},
          `A WELL512A random number generator seed must be a number, string, or valid${""
            } WELL512A state`
        );
      }

      // throw away first 1024 iterations
      for (let i = 0; i < 1024; i++) { this.next(); }
    }
  }

  public get outputWidth(): number { return WELL512A.W; }

  public next(): number {
    const currentRMinus1 = (this._i + WELL512A.R_MINUS_1) & WELL512A.R_MINUS_1;
    const currentV0 = this._s[this._i];
    const z0 = this._s[currentRMinus1]; // = currentV(WELL512A.R_MINUS_1)
    const z1 = WELLUtil.m3Neg(16, currentV0) ^
      WELLUtil.m3Neg(15, this.currentV(WELL512A.M1));
    const z2 = WELLUtil.m3Pos(11, this.currentV(WELL512A.M2));
    const z3 = z1 ^ z2;
    const z4 = WELLUtil.m3Neg(2, z0) ^
      WELLUtil.m3Neg(18, z1) ^
      WELLUtil.m2Neg(28, z2) ^
      WELLUtil.m5Neg(5, WELL512A.A1, z3);
    this._s[currentRMinus1] = z3;
    this._s[this._i] = z4;
    this._i = currentRMinus1;

    return this._s[this._i];
  }

  public state(): WELL512AState {
    const s = new Array(WELL512A.R).fill(0);

    for (let i = 0; i < WELL512A.R; i++) {
      s[i] = this._s[i];
    }

    return {
      type: WELL512A.className,
      s: s,
      i: this._i
    };
  }

  private currentV(j: number): number {
    return this._s[(this._i + j) & WELL512A.R_MINUS_1];
  }


  // class dependencies
  public static dependencies(): Set<Class> {
    return new Set([
      RandomUtil, WELLUtil, DomainError,
    ]);
  }
}


// *** imports come at end to avoid circular dependency ***

// interface/type imports
import {IRandomState} from "../interfaces/IRandomState";
import {Class} from "../interfaces/Class";


// functional imports
import {RandomUtil as RandomUtilAlias} from "./RandomUtil";
const RandomUtil = RandomUtilAlias;

import {WELLUtil as WELLUtilAlias} from "./WELLUtil";
const WELLUtil = WELLUtilAlias;

import {DomainError as DomainErrorAlias} from "../errors/DomainError";
const DomainError = DomainErrorAlias;
