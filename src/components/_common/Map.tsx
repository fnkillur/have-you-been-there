import React, { useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';
import { Box, Button } from '@material-ui/core';
import { mapApiKey } from '../../google.api.config';
import useLoginCheck from '../../hooks/login/useLoginCheck';
import SearchBar from './SearchBar';
import InfoWindow from './InfoWindow';
import { SearchPlace } from '../form';
import { ListRecord } from '../list';

type Position = {
  lat: number;
  lng: number;
};

type Props = {
  width?: number;
  height?: number;
  useSearchBar?: boolean;
  searchList?: SearchPlace[];
  selectedPlace?: SearchPlace;
  handleMarkerClick?: (place: SearchPlace) => void;
  records?: ListRecord[];
  setCurrentPosition?: (next: google.maps.LatLngBounds | undefined) => void;
};

function Map({
  width = window.innerWidth,
  height = window.innerHeight - 56 - 50,
  useSearchBar = true,
  searchList,
  selectedPlace,
  handleMarkerClick,
  records,
  setCurrentPosition,
}: Props) {
  useLoginCheck();

  const mapObj = useRef<google.maps.Map | undefined>(undefined);
  const [isMove, setIsMove] = useState<boolean>(true);
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

        mapObj.current?.addListener('center_changed', () => {
          if (setIsMove) {
            setIsMove(true);
          }
        });
      });
    }
  }, [mapObj.current]);

  // 검색 마커
  useEffect(() => {
    markers.map((marker: google.maps.Marker) => marker.setMap(null));

    if (!searchList?.length) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    setMarkers(
      searchList.map((place: SearchPlace) => {
        const position: google.maps.LatLngLiteral = { lat: parseFloat(place.y), lng: parseFloat(place.x) };
        bounds.extend(position);

        const marker = new google.maps.Marker({
          position,
          title: place.place_name,
          map: mapObj.current,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div id='infoWindow${place.id}'/>`,
        });

        infoWindow.addListener('domready', () => {
          render(
            <InfoWindow
              place={place}
              isSelected={place.id === selectedPlace?.id}
              handleMarkerClick={() => {
                if (handleMarkerClick) {
                  handleMarkerClick(place);
                }
              }}
            />,
            document.getElementById(`infoWindow${place.id}`),
          );
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
  }, [searchList, selectedPlace]);

  // 기록 마커
  useEffect(() => {
    markers.map((marker: google.maps.Marker) => marker.setMap(null));

    if (!records?.length) {
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    setMarkers(
      records.map((record: ListRecord) => {
        const position: google.maps.LatLngLiteral = {
          lat: parseFloat(record?.y || '0'),
          lng: parseFloat(record?.x || '0'),
        };
        bounds.extend(position);

        const marker = new google.maps.Marker({
          position,
          title: record.placeName,
          map: mapObj.current,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div>
            <div><a href="${record?.url}" target="_blank">${record.placeName}</a></div>
            <div>${record?.score ? `${record?.score}점` : '미평가'}</div>
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

    if (setIsMove) {
      setIsMove(false);
    }

    mapObj.current?.fitBounds(bounds);
  }, [records]);

  return (
    <Box component="article" maxWidth="lg">
      {isMove && setCurrentPosition && (
        <Button
          variant="contained"
          style={{
            zIndex: 2,
            position: 'absolute',
            top: '100px',
            left: `${(window.innerWidth - 100) / 2}px`,
            borderRadius: '20px',
            width: '100px',
            backgroundColor: '#FFF',
          }}
          onClick={() => {
            setIsMove(false);
            setCurrentPosition(mapObj.current?.getBounds());
          }}
        >
          여기 검색
        </Button>
      )}
      {useSearchBar && <SearchBar />}
      <div id="map" style={{ width, height }} />
    </Box>
  );
}

export default Map;
