import React, { useEffect, useState } from 'react'

let kakaoPromise

const useKakaoLoader = () => {
    //절대긍정
    const [ready, setReady] = useState(!!window.kakao?.maps)
    const [error, setError] = useState(null)
    useEffect(() => {
        // 1. 이미 카카오 SDK가 로드된 경우
        if (window.kakao?.maps) {
            setReady(true)
            return
        }

        // 2. vite 환경변수에서 앱 키 가져오기
        const key = import.meta.env.VITE_KAKAO_APP_KEY
        if (!key) {
            setError(new Error('VITE_KAKAO_APP_KEY가 없음'))
            return
        }

        // 3. 아직 SDK로딩 Promise가 없다면 생성
        if (!kakaoPromise) {
            kakaoPromise = new Promise((resolve, reject) => {
                const existing = document.querySelector(
                    `script[data-kakao-sdk="true"]`
                )
                if (existing) {
                    // 로드완료시 resolve
                    existing.addEventListener('load', () => resolve(window.kakao))
                    // 에러시 reject
                    existing.addEventListener('error', () => reject(new Error('kakao sdk로드 실패')))
                    return
                }
                // 4. script 태그 생성
                const script = document.createElement('script')
                // 식별용 데이터속성
                script.dataset.kakaoSdk = 'true'
                // 비동기 로드
                script.async = true
                // autoload=false -> 우리가 직업 kakao.maps.load() 호출
                script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`
                script.onload = () => resolve(window.kakao)
                script.onerror = () => reject(new Error('kakao sdk 로드 실패'))
                document.head.appendChild(script)


            })
        }
        kakaoPromise
        .then(()=>setReady(true))
        .catch((e)=>setError(e))
    }, [])
    return {ready, error}
}

export default useKakaoLoader
