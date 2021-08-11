import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@material-ui/lab';
import { Box, Paper, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { auth, firebaseDB } from '../../firebase.config';
import useLoginCheck from '../../hooks/login/useLoginCheck';
import SearchBar from '../_common/SearchBar';
import { isoStringToDate } from '../../utils/DateUtils';
import { getCategoryIcon } from '../../const/categories';

export type ListRecord = {
  id: string;
  placeId: string;
  placeName: string;
  menus: string;
  category: string;
  price?: string;
  visitedDate: string;
  score: string | null;
  comment: string;
};

function List() {
  useLoginCheck();
  const [records, setRecords] = useState<[string, ListRecord][]>([]);

  useEffect(() => {
    if (!auth.currentUser?.uid) {
      return;
    }

    firebaseDB.ref(`/records/${auth.currentUser.uid}`).on('value', (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setRecords(Object.entries(data));
      }
    });
  }, []);

  return (
    <Box component="article" maxWidth="lg">
      <SearchBar />
      <Timeline align="alternate">
        {records.length > 0 ? (
          records.map(([id, record]) => {
            return (
              <TimelineItem key={id}>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="textSecondary">
                    {format(isoStringToDate(record.visitedDate), 'M월 d일 hh시 mm분')}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot>{getCategoryIcon(record.category)}</TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} style={{ padding: '6px 16px' }}>
                    <Link to={`/form?id=${id}`}>
                      <Typography variant="h6" component="h1">
                        {record.placeName}
                      </Typography>
                    </Link>
                    <Typography>{record.category}</Typography>
                    {record.price && <Typography>{parseInt(record.price, 10).toLocaleString()}원</Typography>}
                    {record.menus && <Typography>{record.menus}</Typography>}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            );
          })
        ) : (
          <Typography>기록이 없습니다.🤪</Typography>
        )}
      </Timeline>
    </Box>
  );
}

export default List;
