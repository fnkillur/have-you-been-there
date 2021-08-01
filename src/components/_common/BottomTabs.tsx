import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { FormatListBulletedOutlined, MoreHorizOutlined, RoomOutlined, TrendingUpOutlined } from '@material-ui/icons';
import { useHistory, useLocation } from 'react-router-dom';

function BottomTabs() {
  const location = useLocation();
  const history = useHistory();

  return (
    <BottomNavigation value={location.pathname} style={{ position: 'fixed', bottom: 0, width: '100%' }}>
      <BottomNavigationAction
        showLabel
        label="목록"
        value="/list"
        icon={<FormatListBulletedOutlined />}
        onClick={() => history.push('/list')}
      />
      <BottomNavigationAction
        showLabel
        label="지도"
        value="/map"
        icon={<RoomOutlined />}
        onClick={() => history.push('/map')}
      />
      <BottomNavigationAction
        showLabel
        label="통계"
        value="/stats"
        icon={<TrendingUpOutlined />}
        onClick={() => history.push('/stats')}
      />
      <BottomNavigationAction
        showLabel
        label="더보기"
        value="/settings"
        icon={<MoreHorizOutlined onClick={() => history.push('/settings')} />}
      />
    </BottomNavigation>
  );
}

export default BottomTabs;
