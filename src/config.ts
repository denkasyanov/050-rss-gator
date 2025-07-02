import fs from "fs";
import os from "os";
import path from "path";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

function getConfigFilePath(): string {
  const homeDir = os.homedir();
  const configName = ".gatorconfig.json";
  return path.join(homeDir, configName);
}

function validateConfig(rawConfig: unknown): Config {
  if (!rawConfig || typeof rawConfig !== "object") {
    throw new Error("Config must be an object");
  }

  const config = rawConfig as Record<string, unknown>;

  if (!config.db_url || typeof config.db_url !== "string") {
    throw new Error("dbUrl must be a string");
  }
  if (
    !config.current_user_name ||
    typeof config.current_user_name !== "string"
  ) {
    throw new Error("current_user_name must be a string");
  }

  return {
    dbUrl: config.db_url,
    currentUserName: config.current_user_name || "",
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
