import React, { useEffect, useState } from 'react';
import Map from '../_common/Map';
import { firebaseDB } from '../../firebase.config';
import { ListRecord } from '../list';
import useLoginCheck from '../../hooks/login/useLoginCheck';
import { useQuery } from '../../utils/RouteUtils';

function MapPage() {
  const userId = useLoginCheck();
  const query = useQuery();
  const keyword = query.get('search');

  const [records, setRecords] = useState<ListRecord[]>([]);
  const [position, setPosition] = useState<google.maps.LatLngBounds | undefined>();

  useEffect(() => {
    if (userId && position) {
      return;
      let db = firebaseDB.collection('records').where('userId', '==', userId);

      if (keyword) {
        db = db.where('keywords', 'array-contains', keyword);
      }

      db.get().then((snapshot) => {
        setRecords(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ListRecord)));
      });
    }
  }, [userId, keyword, position]);

  return (
    <Map
      records={records.filter((record: ListRecord) => !!record.placeId && record.category === '음식점')}
      setCurrentPosition={setPosition}
    />
  );
}

export default MapPage;
