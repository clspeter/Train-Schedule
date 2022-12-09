import axios from 'axios';
import React, { useContext, useEffect } from 'react';

import { StationContext } from '../StationContext';

const API_BASE_URL = `https://tdx.transportdata.tw/api/basic/`;
const API_AUTH_URL = `https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token`;
const CLIENT_ID = 'mustpe-a102ed9a-d8a6-4b33';
const CLIENT_SECRET = 'f1b32b6d-d6a4-4106-956b-359611040357';

const apiTokenRequest = () => {
  return axios.create({
    baseURL: `${API_AUTH_URL}`,
    responseType: 'json',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    },
  });
};

export const getApiToken = async () => {
  return await axios({
    method: 'post',
    url: API_AUTH_URL,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    },
  }).then((res) => {
    return res.data.access_token;
  });
};

/*
const { journey } = useContext(StationContext);
const { departure, destination, time } = journey;
const TrainDate = time.toISOString().split('T')[0];
const DestinationStationID = destination?.StationID;
const StationID = departure?.StationID;
const getApiData = () => {
axios.get(API_AUTH_URL).then((res) => {
  console.log(res.data);
});
}; */