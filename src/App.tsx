import React, { useEffect, useRef, useMemo } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';
import type { RegionData } from './loader';

type ComboOption = { id: number; name: string };

type ComboProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: ComboOption[];
  icon: React.ReactNode;
  disabled?: boolean;
};

// ==================== CUSTOM HOOK (FILTER LOGIC) ====================
const useFilter = () => {
  const data = useLoaderData() as RegionData;
  const [searchParams, setSearchParams] = useSearchParams();
  const hasInitialized = useRef(false);

  const provinceId = searchParams.get('province') || '';
  const regencyId = searchParams.get('regency') || '';
  const districtId = searchParams.get('district') || '';

  const provinces = useMemo(() => data?.provinces || [], [data]);
  const regencies = useMemo(() => data?.regencies || [], [data]);
  const districts = useMemo(() => data?.districts || [], [data]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      const hasParams = searchParams.toString().length > 0;
      if (!hasParams && provinces.length > 0) {
        const firstProvince = provinces[0];
        setSearchParams({ province: firstProvince.id.toString() });
      }
    }
  }, [provinces, searchParams, setSearchParams]);

  const filteredRegencies = provinceId
    ? regencies.filter(r => r.province_id.toString() === provinceId)
    : [];

  const filteredDistricts = regencyId
    ? districts.filter(d => d.regency_id.toString() === regencyId)
    : [];

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('province', val);
    } else {
      newParams.delete('province');
    }
    newParams.delete('regency');
    newParams.delete('district');
    setSearchParams(newParams);
  };

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('regency', val);
    } else {
      newParams.delete('regency');
    }
    newParams.delete('district');
    setSearchParams(newParams);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set('district', val);
    } else {
      newParams.delete('district');
    }
    setSearchParams(newParams);
  };

  const handleReset = () => {
    const firstProvince = provinces[0];
    if (firstProvince) {
      setSearchParams({ province: firstProvince.id.toString() });
    }
  };

  const selectedProvince = provinces.find(p => p.id.toString() === provinceId);
  const selectedRegency = regencies.find(r => r.id.toString() === regencyId);
  const selectedDistrict = districts.find(d => d.id.toString() === districtId);

  return {
    provinceId,
    regencyId,
    districtId,
    handleProvinceChange,
    handleRegencyChange,
    handleDistrictChange,
    provinces,
    filteredDistricts,
    filteredRegencies,
    handleReset,
    selectedProvince,
    selectedRegency,
    selectedDistrict,
  };
};


// ==================== COMBO COMPONENT ====================
const Combo = ({ label, name, value, onChange, options, icon, disabled = false }: ComboProps) => (
  <div className="space-y-2">
    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E5E7EB] rounded-2xl text-[13px] text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none shadow-sm cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed whitespace-nowrap overflow-hidden text-ellipsis"
      >
        <option value="" disabled hidden></option>
        {options.map(item => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-400">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  </div>
);


// ==================== MAIN COMPONENT ====================
const FilterPage = () => {
  const {
    districtId,
    provinceId,
    handleProvinceChange,
    provinces,
    regencyId,
    handleDistrictChange,
    handleRegencyChange,
    filteredDistricts,
    filteredRegencies,
    handleReset,
    selectedDistrict,
    selectedProvince,
    selectedRegency
  } = useFilter();

  return (
    <div className="flex w-full h-screen font-sans text-slate-800 bg-white overflow-hidden">
      <aside className="w-80 bg-[#FAFAFC] border-r border-[#E5E7EB] flex flex-col shrink-0 relative">
        <div className="px-6 py-6 flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1E3A8A]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-500">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <h1 className="font-bold text-[15px] text-slate-800 tracking-tight">Frontend Assessment</h1>
        </div>
        <div className="px-6 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-6">FILTER WILAYAH</p>

          <div className="space-y-6">
            <Combo
              label="PROVINSI"
              name="province"
              value={provinceId}
              onChange={handleProvinceChange}
              options={provinces}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-400">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" x2="9" y1="3" y2="18" />
                  <line x1="15" x2="15" y1="6" y2="21" />
                </svg>
              }
            />

            <Combo
              label="KOTA/KABUPATEN"
              name="regency"
              value={regencyId}
              onChange={handleRegencyChange}
              options={filteredRegencies}
              disabled={!provinceId}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-400">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                  <path d="M9 22v-4h6v4" />
                  <path d="M8 6h.01" />
                  <path d="M16 6h.01" />
                  <path d="M12 6h.01" />
                  <path d="M12 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 10h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 10h.01" />
                  <path d="M8 14h.01" />
                </svg>
              }
            />

            <Combo
              label="KECAMATAN"
              name="district"
              value={districtId}
              onChange={handleDistrictChange}
              options={filteredDistricts}
              disabled={!regencyId}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-gray-400">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
            />

            <div className="pt-8">
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center py-3 border border-[#1e3a8a] text-[#1e3a8a] bg-white rounded-2xl text-[11px] font-extrabold tracking-wider hover:bg-slate-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
                  <path d="M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055" />
                  <path d="m22 3-5 5" />
                  <path d="m17 3 5 5" />
                </svg>
                RESET
              </button>
            </div>

          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col bg-white">
        <div className="breadcrumb px-8 py-6 border-b border-[#F1F5F9] bg-white">
          <div className="flex items-center space-x-2 text-[11px] font-bold tracking-widest uppercase">
            <span className={!provinceId ? "text-blue-500" : "text-gray-400"}>Indonesia</span>
            {selectedProvince && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-gray-300">
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <span className={(!regencyId) ? "text-blue-500" : "text-gray-400"}>{selectedProvince.name}</span>
              </>
            )}

            {selectedRegency && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-gray-300">
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <span className={(!districtId) ? "text-blue-500" : "text-gray-400"}>{selectedRegency.name}</span>
              </>
            )}

            {selectedDistrict && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-gray-300">
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <span className="text-blue-500">{selectedDistrict.name}</span>
              </>
            )}
          </div>
        </div>
        <main className="flex-1 w-full flex items-center justify-center py-12 px-8 overflow-y-auto bg-white">
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-full">
            {selectedProvince ? (
              <div className="flex flex-col items-center w-full">
                <div className="text-center group flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-[0.2em] mb-3">Provinsi</span>
                  <h1 className="text-[52px] font-extrabold text-[#0F172A] tracking-[-0.04em] leading-none mb-4">{selectedProvince.name}</h1>
                </div>
                {selectedRegency && (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-300 my-8">
                      <path d="M12 4v16" />
                      <path d="m18 14-6 6-6-6" />
                    </svg>
                    <div className="text-center group flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-[0.2em] mb-3">Kota / Kabupaten</span>
                      <h2 className="text-[52px] font-extrabold text-[#0F172A] tracking-[-0.04em] leading-none mb-4">{selectedRegency.name}</h2>
                    </div>
                  </>
                )}
                {selectedDistrict && (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-300 my-8">
                      <path d="M12 4v16" />
                      <path d="m18 14-6 6-6-6" />
                    </svg>
                    <div className="text-center group flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase font-bold text-blue-400 tracking-[0.2em] mb-3">Kecamatan</span>
                      <h3 className="text-[52px] font-extrabold text-[#0F172A] tracking-[-0.04em] leading-none mb-4">{selectedDistrict.name}</h3>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-gray-400 flex flex-col items-center opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mb-6">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                </svg>
                <p className="text-sm font-medium tracking-wide">Pilih provinsi untuk memulai filter</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FilterPage;
