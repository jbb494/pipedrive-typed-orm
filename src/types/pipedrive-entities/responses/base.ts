import {
  DealDetailResponse,
  PersonDetailResponse,
  LeadDetailResponse,
} from "./details";

export type BaseDetailResponse<Data> = {
  success: boolean;
  data: Data;
};

export type DeatilsResponse = {
  deal: BaseDetailResponse<DealDetailResponse>;
  person: BaseDetailResponse<PersonDetailResponse>;
  lead: BaseDetailResponse<LeadDetailResponse>;
};

export type DeatilsResponseKeys = keyof DeatilsResponse;
