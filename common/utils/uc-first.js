// global.ucFirst = (str) => {
//   if (!str) {
//     return str;
//   }


// Note to Ethnar: The version below was an attempt to expose it to window AND global thinking it was a lead, but it seems the issue it not in this file at all.
// but rather in preview.js not loading.
const ucFirst = (str) => {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
};


if (typeof window !== "undefined") {
  window.ucFirst = ucFirst;
} else if (typeof global !== "undefined") {
  global.ucFirst = ucFirst;
}

export default ucFirst;