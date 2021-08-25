import React from 'react';
// eslint-disable-next-line import/no-cycle
import { SearchPlace } from '../form';

type Props = {
  place: SearchPlace;
  isSelected: boolean;
  handleMarkerClick?: () => void;
};

function InfoWindow({ place, isSelected, handleMarkerClick }: Props) {
  return (
    <div style={{ textAlign: 'left' }}>
      <a href={place.place_url} target="_blank" style={{ fontSize: '14px', textDecoration: 'none' }} rel="noreferrer">
        {place.place_name}
      </a>
      <div style={{ margin: '5px 0' }} id="placeInfo">
        {place.road_address_name || place.address_name}
      </div>
      {isSelected ? (
        <strong>선택됨</strong>
      ) : (
        <button type="button" style={{ width: '60px', height: '25px', fontSize: '12px' }} onClick={handleMarkerClick}>
          선택하기
        </button>
      )}
    </div>
  );
}

export default InfoWindow;
