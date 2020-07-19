/* global describe, it, expect */

import * as u from "../src/scene/transition-utilities";

describe("Transition Utilities", () => {
  describe("rotate", () => {
    it("should add units", () => {
      expect(u.rotate(10)).toEqual("rotate(10deg)");
    });
  });

  describe("scale", () => {
    it("should clone assign x to y if y is not passed", () => {
      expect(u.scale(10)).toEqual("scale(10, 10)");
    });

    it("should assign x and y", () => {
      expect(u.scale(10, 20)).toEqual("scale(10, 20)");
    });
  });
});
