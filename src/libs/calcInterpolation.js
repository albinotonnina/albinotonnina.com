const calcInterpolation = (val1, val2, progress) => {
  let valueIndex;
  const val1Length = val1.length;

  // They both need to have the same length
  if (val1Length !== val2.length) {
    throw `Can't interpolate between "${val1[0]}" and "${val2[0]}"`;
  }

  // Add the format string as first element.
  const interpolated = [val1[0]];

  valueIndex = 1;

  for (; valueIndex < val1Length; valueIndex++) {
    // That's the line where the two numbers are actually interpolated.
    interpolated[valueIndex] =
      val1[valueIndex] + (val2[valueIndex] - val1[valueIndex]) * progress;
  }

  return interpolated;
};

export default calcInterpolation;
