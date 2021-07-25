import { useEffect, useRef, useState } from 'react';
import { mapApiKey } from '../../google.api.config';

type Position = {
  lat: number;
  lng: number;
};

function Map() {
  const mapObj = useRef<google.maps.Map | undefined>(undefined);
  const [position, setPosition] = useState<Position>({ lat: 37.31252759943007, lng: 127.08845821697777 });

  // Geolocation API 로 기기의 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function success(currentPosition: GeolocationPosition) {
          const { latitude, longitude } = currentPosition.coords;
          setPosition({ lat: latitude, lng: longitude });
        },
        function error() {
          console.error('사용자의 위치정보를 가져올 수 없습니다.');
        },
      );
    }
  }, []);

  // 구글 지도 API 초기화
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${mapApiKey}`;
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);
      script.addEventListener('load', function onLoadMap() {
        const center: google.maps.LatLngLiteral = position;
        mapObj.current = new window.google.maps.Map(document.getElementById('map') as HTMLElement, {
          center,
          zoom: 16,
        });
      });
    }
  }, []);

  return <div id="map" style={{ width: window.innerWidth, height: window.innerHeight }} />;
}

export default Map;
