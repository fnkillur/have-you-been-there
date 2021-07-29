import { Container, FormControl, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useFormik } from 'formik';
import './Form.scss';

function Form() {
  const formik = useFormik({
    initialValues: {
      price: 0,
      placeName: '',
      placeId: undefined,
      menus: [],
      visitedDate: new Date(),
      visitedTime: 0,
    },
    onSubmit(values) {
      console.log(values);
    },
  });

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container maxWidth="lg" component="article" className="form-container">
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <FormControl fullWidth variant="outlined" className="form-control">
            <InputLabel htmlFor="price">금액</InputLabel>
            <OutlinedInput
              type="number"
              id="price"
              label="금액"
              startAdornment={<InputAdornment position="start">₩</InputAdornment>}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" className="form-control">
            <InputLabel htmlFor="place">장소</InputLabel>
            <OutlinedInput id="place" label="장소" />
          </FormControl>
          <FormControl fullWidth variant="outlined" className="form-control">
            <InputLabel htmlFor="menus">내역</InputLabel>
            <OutlinedInput id="menus" label="내역" />
          </FormControl>
          {/*<KeyboardDatePicker*/}
          {/*  margin="normal"*/}
          {/*  id="visitedDate"*/}
          {/*  name="visitedDate"*/}
          {/*  label="방문날짜"*/}
          {/*  format="MM/dd/yyyy"*/}
          {/*  value={formik.values.visitedDate}*/}
          {/*  onChange={formik.handleChange}*/}
          {/*/>*/}
          {/*<KeyboardTimePicker*/}
          {/*  margin="normal"*/}
          {/*  id="visitedTime"*/}
          {/*  name="visitedTime"*/}
          {/*  label="방문시간"*/}
          {/*  value={formik.values.visitedTime}*/}
          {/*  onChange={formik.handleChange}*/}
          {/*/>*/}
        </form>
      </Container>
    </MuiPickersUtilsProvider>
  );
}

export default Form;
