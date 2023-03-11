const str = `hi`;
let newStr = "";
let parenthesis = "(";
let comma = ",";

for (let i = 0; i < str.length; i++) {
  if (str[i] === parenthesis) {
    newStr += comma;
  } else if (str[i] === comma) {
    newStr += parenthesis;
  } else {
    newStr += str[i];
  }
}

console.log(newStr);
