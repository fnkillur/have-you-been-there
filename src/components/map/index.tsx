import { useEffect, useRef, useState } from 'react';
import { Box } from '@material-ui/core';
import { mapApiKey } from '../../google.api.config';
import useLoginCheck from '../../hooks/login/useLoginCheck';
import SearchBar from '../_common/SearchBar';
// eslint-disable-next-line import/no-cycle
import { SearchPlace } from '../form';
import './Map.scss';

type Position = {
  lat: number;
  lng: number;
};

type Props = {
  width?: number;
  height?: number;
  useSearchBar?: boolean;
  searchList?: SearchPlace[];
  handleMarkerClick?: (props: any) => void;
};

function Map({
  width = window.innerWidth,
  height = window.innerHeight - 56 - 50,
  useSearchBar = true,
  searchList,
  handleMarkerClick,
}: Props) {
  useLoginCheck();

  const mapObj = useRef<google.maps.Map | undefined>(undefined);
  const [position, setPosition] = useState<Position>({ lat: 37.31252759943007, lng: 127.08845821697777 });
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

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
    if (!mapObj.current) {
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
          disableDefaultUI: true,
        });
      });
    }
  }, [mapObj.current]);

  // 마커
  useEffect(() => {
    markers.map((marker: google.maps.Marker) => marker.setMap(null));

    if (!searchList?.length) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    setMarkers(
      searchList.map((place: SearchPlace, index: number) => {
        const position: google.maps.LatLngLiteral = { lat: parseFloat(place.y), lng: parseFloat(place.x) };
        bounds.extend(position);

        const marker = new google.maps.Marker({
          position,
          title: place.place_name,
          map: mapObj.current,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="text-align: left;">
          <a href="${place.place_url}" target="_blank" style="font-size: 14px; text-decoration:none;">${
            place.place_name
          }</a>
          <div style="margin: 5px 0;">${place.road_address_name || place.address_name}</div>
          <button type="button" style="width: 60px; height: 25px; font-size: 12px;" data-index="${index}" id="btnSelect${index}">선택하기</button>
        </div>`,
        });

        marker.addListener('click', () => {
          infoWindow.open({
            anchor: marker,
            map: mapObj.current,
            shouldFocus: false,
          });
        });

        return marker;
      }),
    );

    mapObj.current?.fitBounds(bounds);
  }, [searchList]);

  return (
    <Box component="article" maxWidth="lg">
      {useSearchBar && <SearchBar />}
      <div id="map" style={{ width, height }} />
    </Box>
  );
}

export default Map;
