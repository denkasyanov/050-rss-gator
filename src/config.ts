import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

function getConfigFilePath(): string {
  const configName = ".gatorconfig.json";
  const homeDir = os.homedir();
  return path.join(homeDir, configName);
}

function validateConfig(rawConfig: any): Config {
  if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
    throw new Error("dbUrl must be a string");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name must be a string");
  }

  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name || "",
  };
}

export function readConfig(): Config {
  const configPath = getConfigFilePath();
  const rawConfig = fs.readFileSync(configPath, "utf8");
  return validateConfig(JSON.parse(rawConfig));
}

function writeConfig(cfg: Config): void {
  const configPath = getConfigFilePath();

  const jsonConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  const data = JSON.stringify(jsonConfig, null, 2);

  fs.writeFileSync(configPath, data, { encoding: "utf8" });
}

export function setUser(name: string) {
  const config = readConfig();
  config.currentUserName = name;
  writeConfig(config);
}
