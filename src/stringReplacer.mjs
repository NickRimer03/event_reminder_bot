export default function stringReplacer(string, ...args) {
  let newString = string;

  args.forEach((arg, i) => {
    newString = newString.replace(`%${i}`, args[i]);
  });

  return newString;
}
