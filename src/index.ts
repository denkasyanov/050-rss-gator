import { readConfig, setUser } from "./config.js";

function main() {
  setUser("Den");
  const config = readConfig();
  console.log(config);
}

main();
