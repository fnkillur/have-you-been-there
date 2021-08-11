import { KeyboardEventHandler, useState } from 'react';
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
import { MapRounded } from '@material-ui/icons';
import DateFnsUtils from '@date-io/date-fns';
import { auth, firebaseDB } from '../../firebase.config';
import useLoginCheck from '../../hooks/login/useLoginCheck';
import { allCategories } from '../../const/categories';
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
};

function Form() {
  useLoginCheck();

  const [message, setMessage] = useState<Message>(initMessage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenMap, setIsOpenMap] = useState<boolean>(false);

  const formik = useFormik<FormRecord>({
    initialValues: {
      placeId: '',
      placeName: '',
      price: undefined,
      menus: '',
      category: '음식점',
      visitedDate: new Date(),
      score: 0,
      comment: '',
    },
    async onSubmit(values) {
      if (!auth.currentUser?.uid) {
        return;
      }

      setIsLoading(true);

      try {
        await firebaseDB
          .ref(`/records/${auth.currentUser.uid}`)
          .push({ ...values, visitedDate: values.visitedDate.toISOString() });
        setMessage({ open: true, contents: '저장이 완료됐습니다.', type: 'success' });
        formik.resetForm();
        window.scrollTo(0, 0);
      } catch (e) {
        setMessage({ open: true, contents: e.message, type: 'error' });
      }

      setIsLoading(false);
    },
  });

  const handleDisableEnter: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const handleMapSearch: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('엔터');
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
              required
            />
            <IconButton
              color={isOpenMap ? 'primary' : 'default'}
              style={{ position: 'absolute', right: '1px', top: '7px', padding: '10px' }}
              aria-label="directions"
              onClick={() => setIsOpenMap(!isOpenMap)}
            >
              <MapRounded />
            </IconButton>
          </FormControl>
          {isOpenMap && <Map width={window.innerWidth - 40} height={window.innerHeight - 300} useSearchBar={false} />}
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
        </form>
        <Snackbar open={message.open} autoHideDuration={3000} onClose={() => setMessage(initMessage)}>
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
