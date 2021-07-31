import { useFormik } from 'formik';
import {
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextareaAutosize,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Rating } from '@material-ui/lab';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import DateFnsUtils from '@date-io/date-fns';
import './Form.scss';

const StyledRating = withStyles({
  iconFilled: {
    color: '#ff6d75',
  },
  iconHover: {
    color: '#ff3d47',
  },
})(Rating);

type Record = {
  price: number;
  placeName: string;
  placeId: string;
  menus: string[];
  visitedDate: Date;
  score: number | null;
  comment: string;
};

function Form() {
  const formik = useFormik<Record>({
    initialValues: {
      price: 0,
      placeName: '',
      placeId: '',
      menus: [],
      visitedDate: new Date(),
      score: null,
      comment: '',
    },
    onSubmit(values) {
      console.log(values);
    },
  });

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container maxWidth="lg" component="article" className="form-container" style={{ padding: '20px' }}>
        <Typography variant="h6" component="div" style={{ textAlign: 'left', margin: '10px 0', fontWeight: 'bold' }}>
          기록하기🧑‍💻
        </Typography>
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <FormControl fullWidth variant="outlined" className="form-control">
            <InputLabel htmlFor="price">금액</InputLabel>
            <OutlinedInput
              type="number"
              id="price"
              name="price"
              label="금액"
              startAdornment={<InputAdornment position="start">₩</InputAdornment>}
              value={formik.values.price}
              onChange={formik.handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" className="form-control">
            <InputLabel htmlFor="placeName">장소</InputLabel>
            <OutlinedInput
              id="placeName"
              name="placeName"
              label="장소"
              required
              value={formik.values.placeName}
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" className="form-control">
            <InputLabel htmlFor="menus">내역</InputLabel>
            <OutlinedInput id="menus" label="내역" />
          </FormControl>
          <div style={{ display: 'flex' }}>
            <KeyboardDatePicker
              margin="normal"
              name="visitedDate"
              label="방문날짜"
              format="MM/dd/yyyy"
              value={formik.values.visitedDate}
              onChange={formik.handleChange}
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
        </form>
      </Container>
    </MuiPickersUtilsProvider>
  );
}

export default Form;
