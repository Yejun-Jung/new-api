import React, { useEffect, useRef } from 'react'
import useKakaoLoader from '../hook/useKakaoLoader'

const MapView = ({ selectedSpot, spots = [] }) => {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const markersRef = useRef([])
    const infoRef = useRef(null)


    const { ready } = useKakaoLoader()

    useEffect(() => {
        if (!ready) return
        if (mapInstanceRef.current) return
        if (!mapRef.current) return

        window.kakao.maps.load(() => {
            const center = new window.kakao.maps.LatLng(37.5665, 126.978)
            const map = new window.kakao.maps.Map(mapRef.current, {
                center,
                level: 5,

            })
            mapInstanceRef.current = map
            infoRef.current = new window.kakao.maps.InfoWindow({
                zIndex: 10,
                removable: true,
            })
        })
    }, [ready])

    useEffect(() => {
        //1. 카카오 SDK 준비 안됐거나
        //    지도 인스턴스가 없으면 실행 중단
        if (!ready || !mapInstanceRef.current || !window.kakao?.maps) return
        const map = mapInstanceRef.current
        /* 2.기존 마커 제거
             * 
             * spots가 변경될 때마다 새로 그리기 때문에
             * 기존 마커를 먼저 지워줘야 중복이 안 생김
         */
        markersRef.current.forEach((m) => m.setMap(null))
        // 마커 배열 초기화
        markersRef.current = []
        // 표시할 배열 없으면 종료
        if (!spots.length) return
        // 3. spots 배열을 돌면서 마커 생성
        spots.forEach((spot) => {
            // 위도/경도 없으면 생성하지 않음
            if (!spot.lat || !spot.lng) return
            //  카카오 지도용 좌표 객체 생성
            const position = new window.kakao.maps.LatLng(
                Number(spot.lat),
                Number(spot.lng),

            )
            // 마커생성
            const marker = new window.kakao.maps.Marker({
                position,
                map
            })
            // 마커 객체에 spot 데이터 저장 (선택적)
            marker.spot = spot
            //  나중에 제거하기 위해 ref 배열에 저장
            markersRef.current.push(marker)
            // 4. 마커클릭이벤트
            window.kakao.maps.event.addListener(marker, 'click', () => {
                if (infoRef.current) {
                    infoRef.current.setContent(
                        <div class="p-2 min-w-[160px]">
                            <div class="font-semibold text-sm">
                                ${spot.name}
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                ${spot.detail || '-'}
                            </div>
                            <div class="text-xs text-slate-500">
                                ${spot.phone || '-'}
                            </div>
                        </div>

                    )
                    infoRef.current.open(map, marker)
                }
            })
        })
    }, [ready, spots])
    useEffect(() => {
        if (!ready || !selectedSpot || !mapInstanceRef.current || !window.kakao?.maps) return
        const map = mapInstanceRef.current
        const { lat, lng } = selectedSpot
        const position = new window.kakao.maps.LatLng(Number(lat), Number(lng))
        map.setCenter(position)
        map.setLevel(3)

        const marker = markersRef.current.find(
            (m) => m.spot?.name === selectedSpot.name
        )
        if (marker && infoRef.current) {
            infoRef.current.setContent(
                `<div class="p-2 min-w-[160px]">
                    <div class="font-semibold text-sm">${selectedSpot.name}</div>
                    <div class="text-xs text-slate-500 mt-1">${selectedSpot.detail || '-'}</div>
                    <div class="text-xs text-slate-500">${selectedSpot.phone || '-'}</div>
                </div>`
            )
            infoRef.current.open(map,marker)
        }
    },[ready, selectedSpot])
    return <div ref={mapRef} className='w-full h-full' />
}

export default MapView