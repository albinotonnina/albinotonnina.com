// Numeric values with optional sign.
const rxNumericValue = /[-+]?[\d]*\.?[\d]+/g;

const parseProp = (val) => {
  const numbers = [];

  numbers.unshift(
    val.replace(rxNumericValue, (n) => {
      numbers.push(+n);
      return "{?}";
    })
  );

  return numbers;
};

export default parseProp;
