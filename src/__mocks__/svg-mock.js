import React from "react";

// eslint-disable-next-line react/prop-types
export default function MockSvg({ width, height }) {
  return (
    <div data-testid="mock-svg" data-width={width} data-height={height}>
      <svg>
        <text fontFamily="Roboto-Thin">Thin Text</text>
        <text fontFamily="Roboto-Light">Light Text</text>
        <text fontFamily="Roboto-Regular">Regular Text</text>
        <text fontFamily="Roboto-Black">Black Text</text>
        <tspan fontFamily="Roboto-Thin">Thin Span</tspan>
      </svg>
      <button id="contactsbutton">Contacts</button>
      <button id="githubbutton">GitHub</button>
    </div>
  );
}
