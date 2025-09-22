export namespace Api {
  export namespace User {
    export namespace Res {
      export interface Detail {
        _id: string;
        email: string;
        first_name: string;
        last_name: string;
        current_plan: string;
        complete_profile: boolean;
        members_allow: number;
        current_members: number;
        age: string;
        birth_data: BirthData;
        birthplace: string;
        created_at: string;
        gender: string;
        user_id: string;
      }

      export interface BirthData {
        [key: string]: any; // This can be expanded based on actual birth data structure
      }

      export interface ProfileDataResponse {
        status: boolean;
        message: string | null;
        data: {
          data: any[];
          user_details: Detail;
        };
      }
    }
  }

  // AI Response types for General Analysis and other topics
  export interface InsightItem {
    heading: string;
    insights: string[];
  }

  export interface GeneralSummaryData {
    "General Summary": InsightItem[];
  }

  export interface SnapshotPredictionData {
    "Snapshot Prediction": InsightItem[];
  }

  export interface AIResponseData {
    user_id: string;
    topic: string;
    house: number;
    sub_topic: string;
    level: string;
    base_topic: string;
    data: (GeneralSummaryData | SnapshotPredictionData)[];
  }

  export interface AIResponse {
    status?: boolean;
    message?: string;
    data: AIResponseData;
  }
}

// Dasha related types
export interface DashaPeriod {
  planet: string;
  planet_id: number;
  start: string;
  end: string;
}

export interface DashaTypeData {
  planet?: {
    major?: string;
    minor?: string;
    sub_minor?: string;
    sub_sub_minor?: string;
  };
  dasha_period: DashaPeriod[];
}

// New API response structure for individual dasha types
export interface DashaData {
  planet: string;
  start: string;
  end: string;
  path: string;
}

// New API response structure
export interface NewDashaResponse {
  MahaDasha?: DashaData;
  AntarDasha?: DashaData;
  PratyantarDasha?: DashaData;
  SookshmaDasha?: DashaData;
  PranDasha?: DashaData;
}

// Legacy structure for backward compatibility
export interface DashaDetails {
  major: DashaTypeData;
  minor: DashaTypeData;
  sub_minor: DashaTypeData;
  sub_sub_minor: DashaTypeData;
  sub_sub_sub_minor: DashaTypeData;
}

// Union type to support both old and new structures
export type DashaResponse = DashaDetails | NewDashaResponse;

export interface DashaScreenProps {
  dashaDetails: DashaResponse;
}

// Current Dasha Time API response types
export interface CurrentDashaTimeResponse {
  Mahadasha: {
    [planet: string]: string[];
  };
  Antardasha: {
    [planet: string]: string[];
  };
  "Mahadasha Refined Analysis": {
    [planet: string]: string[];
  };
  "Antardasha Refined Analysis": {
    [planet: string]: string[];
  };
}
