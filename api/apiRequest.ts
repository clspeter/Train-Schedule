import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = `https://tdx.transportdata.tw/api/basic`;
const API_AUTH_URL = `https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token`;
const CLIENT_ID = 'mustpe-a102ed9a-d8a6-4b33';
const CLIENT_SECRET = 'f1b32b6d-d6a4-4106-956b-359611040357';

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

export const apiTodayTrainStatusByNo = (token: string, trainNo: number): Promise<AxiosResponse> =>
  apiRequest(token).get(`/v3/Rail/TRA/SpecificTrainTimetable/TrainNo/${trainNo}`);

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
