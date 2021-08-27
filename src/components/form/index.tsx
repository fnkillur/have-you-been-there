import { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Backdrop,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  TextareaAutosize,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Alert, Rating } from '@material-ui/lab';
import { Color } from '@material-ui/lab/Alert/Alert';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { MapRounded, SearchRounded } from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import { auth, firebaseDB } from '../../firebase.config';
import useLoginCheck from '../../hooks/login/useLoginCheck';
import { allCategories } from '../../const/categories';
import { useQuery } from '../../utils/RouteUtils';
import Map from '../map';
import './Form.scss';

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

type Message = {
  open: boolean;
  contents?: string;
  type: Color;
};

const initMessage: Message = { open: false, contents: undefined, type: 'success' };

export type FormRecord = {
  id?: any;
  placeId: string;
  placeName: string;
  price?: number;
  menus: string;
  category: string;
  visitedDate: Date;
  score: number | null;
  comment: string;
  x?: string;
  y?: string;
  url?: string;
  address?: string;
};

export type SearchPlace = {
  address_name?: string;
  category_group_code?: string;
  category_group_name?: string;
  category_name?: string;
  distance?: string;
  id: string;
  phone?: string;
  place_name: string;
  place_url?: string;
  road_address_name?: string;
  x: string;
  y: string;
};

function Form() {
  useLoginCheck();

  const history = useHistory();
  const query = useQuery();
  const id = query.get('id');

  const [message, setMessage] = useState<Message>(initMessage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenMap, setIsOpenMap] = useState<boolean>(false);

  const kakaoPlaces = useRef(new window.kakao.maps.services.Places());
  const [searchList, setSearchList] = useState<SearchPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SearchPlace | undefined>();

  const [isDelete, setIsDelete] = useState<boolean>(false);

  const formik = useFormik<FormRecord>({
    initialValues: {
      placeId: '',
      placeName: '',
      price: 0,
      menus: '',
      category: '음식점',
      visitedDate: new Date(),
      score: 0,
      comment: '',
      x: '',
      y: '',
      url: '',
      address: '',
    },
    async onSubmit(values) {
      if (!auth.currentUser?.uid) {
        return;
      }

      setIsLoading(true);

      const record = {
        placeId: selectedPlace?.id || '',
        placeName: selectedPlace?.place_name || values.placeName,
        price: values.price,
        menus: values.menus,
        category: values.category,
        visitedDate: values.visitedDate.toISOString(),
        score: values.score,
        comment: values.comment,
        x: selectedPlace?.x || '',
        y: selectedPlace?.y || '',
        url: selectedPlace?.place_url || '',
        address: selectedPlace?.road_address_name || selectedPlace?.address_name || '',
      };
      try {
        if (values.id) {
          await firebaseDB.ref(`/records/${auth.currentUser.uid}/${values.id}`).update(record);
        } else {
          await firebaseDB.ref(`/records/${auth.currentUser.uid}`).push(record);
        }

        setMessage({ open: true, contents: '저장이 완료됐습니다.', type: 'success' });
        formik.resetForm();
        window.scrollTo(0, 0);
      } catch (e) {
        setMessage({ open: true, contents: e.message, type: 'error' });
      }

      setIsLoading(false);
    },
  });

  // 수정할 데이터
  useEffect(() => {
    if (id && auth.currentUser?.uid) {
      firebaseDB
        .ref(`/records/${auth.currentUser.uid}/${id}`)
        .get()
        .then((snapshot) => {
          const record = snapshot.val();
          if (!record) {
            return;
          }

          formik.setValues({
            id,
            ...record,
            visitedDate: new Date(record.visitedDate as Date),
          });

          if (record.placeId) {
            setSelectedPlace({
              id: record.placeId,
              place_name: record.placeName,
              place_url: record.url,
              x: record.x,
              y: record.y,
            });
          }
        });
    }
  }, [id]);

  // 데이터 삭제
  useEffect(() => {
    if (isDelete && id && auth.currentUser?.uid) {
      setIsLoading(true);
      firebaseDB
        .ref(`/records/${auth.currentUser.uid}/${id}`)
        .remove()
        .then(() => {
          setMessage({ open: true, contents: '삭제가 완료됐습니다.', type: 'success' });

          history.replace('/form');
          formik.resetForm();
          setSelectedPlace(undefined);
          window.scrollTo(0, 0);

          setIsLoading(false);
          setIsDelete(false);
        });
    }
  }, [isDelete]);

  const handleDisableEnter: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const searchMap = async () => {
    if (!isOpenMap || !formik.values.placeName) {
      return;
    }

    await kakaoPlaces.current.keywordSearch(
      formik.values.placeName,
      (data: SearchPlace[], status: string, pagination: any) => {
        if (status !== window.kakao.maps.services.Status.OK) {
          return;
        }

        setSearchList(data);
      },
    );
  };

  const handleMapSearch: KeyboardEventHandler<HTMLDivElement> = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchMap();
    }
  };

  const handleMapDelete = (e: any) => {
    if (selectedPlace) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm('선택한 장소를 제거하시겠습니까?')) {
        setSelectedPlace(undefined);
        formik.setValues({
          ...formik.values,
          placeId: '',
          x: '',
          y: '',
          url: '',
          address: '',
        });
      } else {
        e.preventDefault();
      }
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container maxWidth="lg" component="article" className="form-container" style={{ padding: '20px' }}>
        <Typography variant="h6" component="div" style={{ textAlign: 'left', margin: '10px 0', fontWeight: 'bold' }}>
          기록하기🧑‍💻
        </Typography>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <FormControl fullWidth variant="outlined" className="form-control">
            <InputLabel htmlFor="price">금액</InputLabel>
            <OutlinedInput
              type="number"
              inputMode="numeric"
              id="price"
              name="price"
              label="금액"
              startAdornment={<InputAdornment position="start">₩</InputAdornment>}
              value={formik.values.price}
              onChange={formik.handleChange}
              onKeyPress={handleDisableEnter}
              required
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" className="form-control">
            <InputLabel htmlFor="placeName">장소</InputLabel>
            <OutlinedInput
              id="placeName"
              name="placeName"
              label="장소"
              value={formik.values.placeName}
              onChange={formik.handleChange}
              onKeyPress={handleMapSearch}
              onKeyDown={handleMapDelete}
              required
            />
            {isOpenMap && (
              <IconButton
                color="primary"
                style={{ position: 'absolute', right: '40px', top: '7px', padding: '10px' }}
                onClick={searchMap}
              >
                <SearchRounded />
              </IconButton>
            )}
            <IconButton
              color={isOpenMap ? 'primary' : 'default'}
              style={{ position: 'absolute', right: '1px', top: '7px', padding: '10px' }}
              aria-label="directions"
              onClick={() => setIsOpenMap(!isOpenMap)}
            >
              <MapRounded />
            </IconButton>
          </FormControl>
          {isOpenMap && (
            <Map
              width={window.innerWidth - 40}
              height={window.innerHeight - 300}
              useSearchBar={false}
              searchList={searchList}
              selectedPlace={selectedPlace}
              handleMarkerClick={(place: SearchPlace) => setSelectedPlace(place)}
            />
          )}
          <FormControl fullWidth variant="outlined" className="form-control">
            <InputLabel htmlFor="menus">내역</InputLabel>
            <OutlinedInput
              id="menus"
              name="menus"
              label="내역"
              value={formik.values.menus}
              onChange={formik.handleChange}
              onKeyPress={handleDisableEnter}
            />
          </FormControl>
          <FormControl variant="outlined" className="form-control">
            <InputLabel id="category">카테고리</InputLabel>
            <Select
              labelId="category"
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              label="카테고리"
            >
              {allCategories.map(({ label, icon }) => (
                <MenuItem key={label} value={label}>
                  {label}
                  <span style={{ marginLeft: '5px' }}>{icon}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ display: 'flex' }}>
            <KeyboardDatePicker
              margin="normal"
              name="visitedDate"
              label="방문날짜"
              format="MM/dd/yyyy"
              value={formik.values.visitedDate}
              onChange={(isoDate) => {
                if (isoDate) {
                  formik.setValues({ ...formik.values, visitedDate: new Date(Date.parse(isoDate.toString())) });
                }
              }}
              onKeyPress={handleDisableEnter}
            />
            <KeyboardTimePicker
              margin="normal"
              name="visitedTime"
              label="방문시간"
              value={formik.values.visitedDate}
              onChange={(date: MaterialUiPickersDate) => {
                if (!date) {
                  return;
                }

                const next = new Date(formik.values.visitedDate.getTime());
                next.setHours(date.getHours());
                next.setMinutes(date.getMinutes());
                formik.setValues({ ...formik.values, visitedDate: next });
              }}
              onKeyPress={handleDisableEnter}
            />
          </div>
          <Typography gutterBottom style={{ textAlign: 'left', margin: '10px 0' }}>
            평점
          </Typography>
          <StyledRating
            name="score"
            precision={0.5}
            value={formik.values.score}
            onChange={(e, next: number | null) => formik.setValues({ ...formik.values, score: next })}
            icon={<FavoriteIcon fontSize="inherit" />}
          />
          <Typography gutterBottom style={{ textAlign: 'left', margin: '10px 0' }}>
            한줄평
          </Typography>
          <TextareaAutosize
            style={{
              width: '100%',
              padding: '18.5px 14px',
              boxSizing: 'border-box',
              borderRadius: '5px',
              borderColor: '#D8D8D8',
              fontSize: '16px',
              outline: 'none',
            }}
            aria-label="한줄평"
            name="comment"
            placeholder="한줄평"
            value={formik.values.comment}
            onChange={formik.handleChange}
            onMouseOver={(e) => {
              const textarea = e.target as HTMLTextAreaElement;
              textarea.style.borderColor = 'black';
            }}
            onMouseLeave={(e) => {
              const textarea = e.target as HTMLTextAreaElement;
              textarea.style.borderColor = '#D8D8D8';
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: '20px', width: '100%', height: '50px', fontSize: '16px', fontWeight: 'bold' }}
            disabled={!formik.isValid}
          >
            저장하기
          </Button>
          {!!id && (
            <Button
              variant="contained"
              color="secondary"
              type="button"
              style={{ marginTop: '20px', width: '100%', height: '50px', fontSize: '16px', fontWeight: 'bold' }}
              onClick={() => setIsDelete(true)}
              disabled={isDelete}
            >
              삭제하기
            </Button>
          )}
        </form>
        <Snackbar
          open={message.open}
          autoHideDuration={3000}
          onClose={() => setMessage(initMessage)}
          style={{ marginBottom: '70px' }}
        >
          <Alert onClose={() => setMessage(initMessage)} severity={message.type}>
            {message.contents}
          </Alert>
        </Snackbar>
        <Backdrop open={isLoading} onClick={() => setIsLoading(false)} style={{ zIndex: 10, color: '#FFF' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    </MuiPickersUtilsProvider>
  );
}

export default Form;
