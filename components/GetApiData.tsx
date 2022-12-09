import axios from 'axios';
import React, { useContext } from 'react';

import { StationContext } from '../StationContext';

export default function GetApiData() {
  const { journey } = useContext(StationContext);
  const { departure, destination, time } = journey;
  const TrainDate = time.toISOString().split('T')[0];
  const DestinationStationID = destination?.StationID;
  const StationID = departure?.StationID;
  const url = `https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/DailyTimetable/OD/${StationID}/to/${DestinationStationID}/${TrainDate}?$top=30&$format=JSON`;
  const getApiData = async () => {
    const { data } = await axios.get(url);
    console.log(data);
  };
  getApiData();
  return null;
}
