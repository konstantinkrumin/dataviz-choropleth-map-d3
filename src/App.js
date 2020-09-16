import React, { useEffect, useRef } from 'react';
import './styles/main.scss';

import { useFetch } from './helpers/fetchData';
import { render } from './helpers/chart';

export default function App() {
  const WIDTH = 1260;
  const HEIGHT = 600;

  const EDU_DATA_LINK =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
  const COUNTIES_DATA_LINK =
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

  const [eduData] = useFetch(EDU_DATA_LINK);
  const [countyData, countyLoading] = useFetch(COUNTIES_DATA_LINK);

  const ref = useRef();

  useEffect(() => {
    if (eduData.length !== 0 && countyData !== 0) {
      render(eduData, countyData, ref, WIDTH, HEIGHT);
    }
  }, [countyLoading]);

  return (
    <div className="app">
      <div className="viz-container">
        <svg className="graph" ref={ref} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} />
      </div>
    </div>
  );
}
