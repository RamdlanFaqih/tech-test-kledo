type Province = { id: number; name: string };
type Regency = { id: number; name: string; province_id: number };
type District = { id: number; name: string; regency_id: number };

export type RegionData = {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
};

export async function loader(): Promise<RegionData> {
  const response = await fetch('/data/indonesia_regions.json');
  if (!response.ok) {
    throw new Response('Failed to load region data', { status: response.status });
  }
  return response.json();
}
