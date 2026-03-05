import React, { useEffect, useMemo, useState } from "react";
import toiletData from "../assets/toilet.json";
import MapView from "../components/MapView";
import { useLocation } from "react-router-dom";
import { useFavoritesContext } from "../contexts/FavoritesContext";

const MapPage = () => {
  const [q, setQ] = useState("");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const { state } = useLocation();
  const { toggle, isFavorite } = useFavoritesContext();

  useEffect(() => {
    if (state?.selectedSpot) {
      setSelectedSpot(state.selectedSpot);
    }
  }, [state?.selectedSpot]);

  const filtered = useMemo(() => {
    const keyword = q.trim();

    const dataArray = Array.isArray(toiletData)
      ? toiletData
      : toiletData.DATA || [];

    const mappedData = dataArray.map((item) => ({
      name: item.name,
      detail: item.detail,
      phone: item.phone || "전화번호 없음",
      lat: item.lat,
      lng: item.lng,
    }));

    if (!keyword) return mappedData.slice(0, 50);

    return mappedData
      .filter((x) =>
        (x.name + " " + x.detail).toLowerCase().includes(keyword.toLowerCase()),
      )
      .slice(0, 50);
  }, [q]);

  const isSameSpot = (a, b) =>
    a?.name === b?.name && a?.lat === b?.lat && a?.lng === b?.lng;

  const spotsToShow = useMemo(() => {
    if (!selectedSpot) return filtered;
    if (filtered.some((f) => isSameSpot(f, selectedSpot))) {
      return filtered;
    }
    return [selectedSpot, ...filtered];
  }, [filtered, selectedSpot]);

  const totalCount = Array.isArray(toiletData)
    ? toiletData.length
    : toiletData.DATA?.length || 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <section className="overflow-hidden border border-slate-200 rounded-3xl bg-white flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-white z-10">
          <h1 className="text-lg font-bold text-slate-800">Map</h1>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            내 주변 공중화장실
          </span>
        </div>
        <div className="flex-1 bg-slate-50 relative min-h-[70vh]">
          {selectedSpot && (!selectedSpot.lat || !selectedSpot.lng) ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-20">
              <div className="text-4xl mb-3">📍</div>
              <p className="text-sm font-medium text-slate-500">
                위도, 경도 정보가 없어 정확한 위치 정보가 없습니다
              </p>
            </div>
          ) : (
            <div className="absolute inset-0">
              <MapView
                selectedSpot={selectedSpot}
                spots={spotsToShow.filter((s) => s.lat && s.lng)}
              />
            </div>
          )}
        </div>
      </section>

      <aside className="flex flex-col border border-slate-200 rounded-3xl bg-white overflow-hidden max-h-[calc(100vh-8rem)]">
        <div className="border-b border-slate-100 px-6 py-5 bg-white">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            🚻 서울시 공중화장실 위치
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            전체 <span className="text-blue-600">{totalCount}</span>건 중 <span className="text-blue-600">{filtered.length}</span>건 표시
          </p>
        </div>
        <div className="flex gap-2 border-b border-slate-100 px-4 py-4 bg-slate-50/50">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all"
            type="text"
            placeholder="화장실 이름 또는 주소 검색"
          />
          <button className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl px-5 py-2.5 text-white text-sm font-semibold cursor-pointer">
            검색
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filtered.map((item, idx) => {
            const isSelected = selectedSpot?.name === item.name;
            return (
              <li
                key={idx}
                onClick={() => setSelectedSpot(item)}
                className={`group rounded-2xl p-4 cursor-pointer border-2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className={`text-base font-bold truncate transition-colors ${isSelected ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-600'}`}>
                      {item.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 truncate">
                      {item.detail}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(item);
                    }}
                    className="flex-shrink-0 cursor-pointer text-xl hover:scale-110 transition-transform p-1"
                    aria-label={isFavorite(item) ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                  >
                    {isFavorite(item) ? "⭐️" : "☆"}
                  </button>
                </div>
                <div className="mt-3">
                  <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-medium
                    ${item.phone === '전화번호 없음' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'}
                  `}>
                    📞 {item.phone}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default MapPage;