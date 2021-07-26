import React from 'react';
import { Link } from 'react-router-dom';

function BottomTabs() {
  return (
    <section className="bottom-tabs">
      <Link to="list">목록</Link>
      <Link to="map">지도</Link>
      <Link to="stats">통계</Link>
      <Link to="settings">더보기</Link>
    </section>
  );
}

export default BottomTabs;
