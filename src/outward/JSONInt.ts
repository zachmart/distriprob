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


export class JSONInt {
  public static stringify(a: int): string {
    if (a.type === intType.finite) {
      let result = `JSONInt${a.neg ? "-" : "+"}`;

      for (let i = 0 ; i < a.digits.length; i++) {
        const digitStr =  a.digits[i].toString(36);

        if (digitStr.length === 6) {
          result += digitStr;
        } else if (digitStr.length === 5) {
          result += `0${digitStr}`;
        } else if (digitStr.length === 4) {
          result += `00${digitStr}`;
        } else if (digitStr.length === 3) {
          result += `000${digitStr}`;
        } else if (digitStr.length === 2) {
          result += `0000${digitStr}`;
        } else if (digitStr.length === 1) {
          result += `00000${digitStr}`;
        } else {
          throw new Error(
            `digitStr length must be between 6 and 1, got: ${digitStr.length}`
          );
        }
      }

      return result;
    } else if (a.type === intType.infinite) {
      return `JSONInt${a.neg ? "-" : "+"}Infinity`;
    } else {
      return `JSONIntNaN`;
    }
  }

  public static parse(str: string): int {
    if (str.substring(7, 10) === "NaN") {
      return C.NaN;
    } else if (str.substring(8, 16) === "Infinity") {
      if (str.substring(7, 8) === "+") {
        return C.POSITIVE_INFINITY;
      } else {
        return C.NEGATIVE_INFINITY;
      }
    } else {
      const neg = str.substring(7, 8) === "-";
      const digitsLength = (str.length - 8) / 6;
      const digits = new Uint32Array(digitsLength);
      let start = 8;
      let end = 14;

      for (let i = 0; i < digitsLength; i++) {
        digits[i] = parseInt(str.substring(start, end), 36);
        start += 6;
        end += 6;
      }

      return new Integer(neg, digits);
    }
  }

  public static instance(x: any): boolean {
    if (typeof x === "string" && x.length >= 10 && x.substring(0, 7) === "JSONInt") {
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

        if ((x.length - 8) % 6 !== 0) {
          return false;
        }

        let charCode: number;

        for (let i = 8; i < x.length; i++) {
          charCode = x.charCodeAt(i);
          if (charCode < 48 || charCode > 122 || (charCode > 57 && charCode < 97)) {
            return false
          }
        }

        return true;
      }
    } else {
      return false;
    }
  }
}

import {int, intType} from "../interfaces/int";

import {Integer as IntegerAlias} from "../dataTypes/Integer";
const Integer = IntegerAlias;

import {C as CAlias} from "../constants/C";
const C = CAlias;

import {Int as IntAlias} from "./Int";
const Int = IntAlias;
export type Int = IntAlias;