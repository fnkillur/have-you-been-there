import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, InputBase, Paper } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { mapApiKey } from '../../google.api.config';
import useLoginCheck from '../../hooks/login/useLoginCheck';
import './Map.scss';

type Position = {
  lat: number;
  lng: number;
};

function Map() {
  useLoginCheck();

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

  return (
    <Box component="article" maxWidth="lg">
      <Paper component="form" className="root">
        {/*<IconButton className={classes.iconButton} aria-label="menu">*/}
        {/*  <MenuIcon />*/}
        {/*</IconButton>*/}
        <InputBase className="input" placeholder="장소 검색" inputProps={{ 'aria-label': '장소 검색' }} />
        <IconButton type="submit" className="iconButton" aria-label="search">
          <Search />
        </IconButton>
        {/*<Divider className={classes.divider} orientation="vertical" />*/}
        {/*<IconButton color="primary" className={classes.iconButton} aria-label="directions">*/}
        {/*  <DirectionsIcon />*/}
        {/*</IconButton>*/}
      </Paper>
      <div id="map" style={{ width: window.innerWidth, height: window.innerHeight - 56 - 50 }} />
    </Box>
  );
}

export default Map;
