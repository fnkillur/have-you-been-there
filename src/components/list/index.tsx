import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentData } from '@firebase/firestore-types';
import {
  Skeleton,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@material-ui/lab';
import { Box, Button, Paper, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { firebaseDB } from '../../firebase.config';
import useLoginCheck from '../../hooks/login/useLoginCheck';
import SearchBar from '../_common/SearchBar';
import { getCategoryIcon } from '../../const/categories';
import { useQuery } from '../../utils/RouteUtils';

const PAGE_UNIT = 20;

export type ListRecord = {
  id: string;
  userId: string;
  placeId: string;
  placeName: string;
  menus: string;
  category: string;
  price?: string;
  visitedDate: string;
  score: string | null;
  comment: string;
  x?: string;
  y?: string;
  url?: string;
  address?: string;
};

function List() {
  const userId = useLoginCheck();
  const query = useQuery();
  const keyword = query.get('search');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<ListRecord[]>([]);
  const [page, setPage] = useState<number>(1);
  const [lastRecord, setLastRecord] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (page > 0 && userId) {
      setIsLoading(true);

      const isFirstPage = page === 1;
      let db = firebaseDB
        .collection('records')
        .where('visitedDate', '>=', new Date(2019, 1, 1).getTime())
        .where('userId', '==', userId);

      if (keyword) {
        db = db.where('keywords', 'array-contains', keyword);
      }

      db.orderBy('visitedDate', 'desc');

      if (!isFirstPage) {
        db = db.startAt(lastRecord);
      }

      db.limit(PAGE_UNIT + 1)
        .get()
        .then((snapshot) => {
          const nextPageFirstDoc = snapshot.docs[PAGE_UNIT];
          if (nextPageFirstDoc) {
            setLastRecord(nextPageFirstDoc);
          } else {
            setPage(-1);
          }

          const nextPage = snapshot.docs
            .slice(0, PAGE_UNIT)
            .map((doc) => ({ id: doc.id, ...doc.data() } as ListRecord));
          setRecords(isFirstPage ? nextPage : records.concat(nextPage));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [page, userId, keyword]);

  return (
    <Box component="article" maxWidth="lg">
      <SearchBar />
      <Timeline align="alternate">
        {records.length ? (
          records.map(({ id, visitedDate, category, placeName, price, menus }) => {
            return (
              <TimelineItem key={id}>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="textSecondary">
                    {format(new Date(visitedDate), 'M월 d일  h:m')}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot>{getCategoryIcon(category)}</TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} style={{ padding: '6px 16px' }}>
                    <Link to={`/form?id=${id}`} style={{ outline: 'none' }}>
                      <Typography component="h6" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {placeName.split(' ').map((name) => (
                          <>
                            {name}
                            <br />
                          </>
                        ))}
                      </Typography>
                    </Link>
                    <Typography style={{ textAlign: 'center', fontSize: '14px' }}>{category}</Typography>
                    {price && (
                      <Typography style={{ textAlign: 'center' }}>{parseInt(price, 10).toLocaleString()}원</Typography>
                    )}
                    {menus && (
                      <Typography style={{ textAlign: 'center', fontSize: '14px' }}>
                        {menus.split(',').map((menu: string) => (
                          <>
                            {menu}
                            <br />
                          </>
                        ))}
                      </Typography>
                    )}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            );
          })
        ) : (
          <Typography>기록이 없습니다.🤪</Typography>
        )}
        {!isLoading && page !== -1 && (
          <Button variant="contained" style={{ marginTop: '30px' }} onClick={() => setPage(page + 1)}>
            더보기
          </Button>
        )}
      </Timeline>
    </Box>
  );
}

export default List;
