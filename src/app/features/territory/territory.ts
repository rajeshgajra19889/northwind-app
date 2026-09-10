export interface Territory {
  territoryId: string;
  territoryDescription: string;
  regionId: number | null;
  regionName?: string | null;
  region?: { regionId: number; regionDescription: string } | null;
}