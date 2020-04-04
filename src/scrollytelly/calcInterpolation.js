const calcInterpolation = (val1, val2, progress) =>
  val1.map((val, index) =>
    index === 0 ? val : val + (val2[index] - val1[index]) * progress
  );

export default calcInterpolation;
