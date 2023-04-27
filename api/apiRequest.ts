import axios, { AxiosResponse } from 'axios';
import Constatns from 'expo-constants';

const API_BASE_URL = `https://tdx.transportdata.tw/api/basic`;
const API_AUTH_URL = `https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token`;
const CLIENT_ID = Constatns?.expoConfig?.extra?.CLIENT_ID;
const CLIENT_SECRET = Constatns?.expoConfig?.extra?.CLIENT_SECRET;

const apiRequest = (token: string) => {
  return axios.create({
    baseURL: `${API_BASE_URL}`,
    responseType: 'json',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};
export const apiDailyTimetableOD = (
  token: string,
  OriginStationID: string,
  DestinationStationID: string,
  TrainDate: string
): Promise<AxiosResponse> =>
  apiRequest(token).get(
    `/v2/Rail/TRA/DailyTimetable/OD/${OriginStationID}/to/${DestinationStationID}/${TrainDate}`
  );

export const apiDailyStationTimetableTodayStation = (
  token: string,
  StationID: string
): Promise<AxiosResponse> =>
  apiRequest(token).get(`/v3/Rail/TRA/DailyStationTimetable/Today/Station/${StationID}`);

export const apiTodayTrainStatusByNo = (token: string, trainNo: string): Promise<AxiosResponse> =>
  apiRequest(token).get(`/v3/Rail/TRA/DailyTrainTimetable/Today/TrainNo/${trainNo}`);

export const apiTrainStatusByNo = (token: string, trainNo: string): Promise<AxiosResponse> =>
  apiRequest(token).get(`/v3/Rail/TRA/GeneralTrainTimetable/TrainNo/${trainNo}`);

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
    return res.data;
  });
};

export const apiTrainStatus = (token: string): Promise<AxiosResponse> =>
  apiRequest(token).get(`/v3/Rail/TRA/TrainLiveBoard`);
