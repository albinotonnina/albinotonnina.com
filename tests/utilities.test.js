/* global describe, it, expect, jest */

import * as utils from "../src/site/utilities";

jest.mock("webfontloader", () => {
  return {
    load: ({ active }) => active(),
  };
});

describe("Utilities", () => {
  describe("waitForWebfonts", () => {
    it("should invoke callback after load", (done) => {
      utils.waitForWebfonts(["Roboto:400,100,300,700,900"], () => {
        done();
      });
    });
  });

  describe("setAttribute", () => {
    it("should set an attribute to an element", () => {
      const dummyEl = document.createElement("div");
      utils.setAttributes(dummyEl, { ping: "pong", foo: "bar" });
      expect(dummyEl.attributes.length).toEqual(2);
    });

    it("should set an attribute with value to element", () => {
      const dummyEl = document.createElement("div");
      utils.setAttributes(dummyEl, { ping: "pong" });
      expect(dummyEl.getAttribute("ping")).toEqual("pong");
    });
  });

  describe("createElementWithAttrs", () => {
    it("should create an element and set an attribute to it", () => {
      const dummyEl = utils.createElementWithAttrs("div", {
        ping: "pong",
        foo: "bar",
      });
      expect(dummyEl.attributes.length).toEqual(2);
    });

    it("should set an attribute with value to element", () => {
      const dummyEl = utils.createElementWithAttrs("div", { ping: "pong" });
      expect(dummyEl.getAttribute("ping")).toEqual("pong");
    });
  });

  describe("shouldFallbackToBoringCV", () => {
    it("should fallback because the window is too narrow", () => {
      global.window.innerWidth = 500;
      global.window.innerHeight = 600;
      expect(utils.shouldFallbackToBoringCV()).toEqual(true);
    });

    it("should not fallback", () => {
      global.window.innerWidth = 600;
      global.window.innerHeight = 400;
      expect(utils.shouldFallbackToBoringCV()).toEqual(false);
    });
  });
});
