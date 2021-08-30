import { useState } from 'react';
import { format } from 'date-fns';

function Stats() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <section style={{ padding: '20px' }}>
      <h1>{format(date, 'M월')} 통계</h1>
    </section>
  );
}

export default Stats;
