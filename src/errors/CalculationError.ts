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


/**
 * This class's instances are meant to be thrown when a calculation fails for some reason.
 */
export class CalculationError {
  public readonly name: "CalculationError";
  public readonly message: string;
  public readonly className: string;
  public readonly functionName: string;
  public readonly stack: string | undefined;

  constructor(className: string, functionName: string, message: string) {
    this.name = "CalculationError";
    this.message = message;
    this.className = className;
    this.functionName = functionName;
    this.stack = (new Error("")).stack;
  }

  public static instance(x: any): x is CalculationError {
    return typeof x === "object" && x !== null && x.name === "CalculationError" &&
      typeof x.message === "string" && typeof x.className === "string" &&
      typeof x.functionName === "string" &&
      (typeof x.stack === "undefined" || typeof x.stack === "string");
  }
}
