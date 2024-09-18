import { DEFAULT_TEMPLATE } from "./ActivityRenderer";

export const VALID_FRONT_MATTER_PROPERTIES = [
  "id",
  "start_date",
  "name",
  "type",
  "description",
  "private_note",
  "elapsed_time",
  "moving_time",
  "distance",
  "max_heart_rate",
  "max_speed",
  "average_speed",
  "total_elevation_gain",
  "elev_low",
  "elev_high",
  "calories"
]

export const DEFAULT_SETTINGS: Settings = {
  authentication: {
    stravaClientId: '',
    stravaClientSecret: '',
    stravaAccessToken: undefined,
    stravaRefreshToken: undefined,
    stravaTokenExpiresAt: undefined
  },
  syncLocation: {
    folder: "Strava/{{start_date}}",
    folderDateFormat: "yyyy-MM-dd",
    filename: "{{id}} {{name}}",
    filenameDateFormat: "yyyy-MM-dd"
  },
  activity: {
    contentDateFormat: "yyyy-MM-dd HH:mm:ss",
    frontMatterProperties: [],
    template: DEFAULT_TEMPLATE
  }
}

export interface AuthenticationSettings {
  stravaClientId: string;
  stravaClientSecret: string;
  stravaAccessToken?: string;
  stravaRefreshToken?: string;
  stravaTokenExpiresAt?: number;
}

interface SyncLocationSettings {
  folder: string;
  folderDateFormat: string;
  filename: string;
  filenameDateFormat: string;
}

interface ActivitySettings {
  contentDateFormat: string;
  frontMatterProperties: string[];
  template: string;
}

export interface Settings {
  authentication: AuthenticationSettings;
  syncLocation: SyncLocationSettings;
  activity: ActivitySettings;
}
