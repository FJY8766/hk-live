const STATION_NAME = 'Hong Kong Observatory';
const AIR_STATION_NAME = 'Central/Western';
const ISLAND_LINE_DESTINATIONS = {
  KET: 'Kennedy Town',
  HKU: 'HKU',
  SYP: 'Sai Ying Pun',
  SHW: 'Sheung Wan',
  CEN: 'Central',
  ADM: 'Admiralty',
  WAC: 'Wan Chai',
  CAB: 'Causeway Bay',
  TIH: 'Tin Hau',
  FOH: 'Fortress Hill',
  NOP: 'North Point',
  QUB: 'Quarry Bay',
  TAK: 'Tai Koo',
  SWH: 'Sai Wan Ho',
  SKW: 'Shau Kei Wan',
  HFC: 'Heng Fa Chuen',
  CHW: 'Chai Wan'
};

function formatUpdateTime(updateTime) {
  const date = new Date(updateTime);
  if (Number.isNaN(date.getTime())) {
    return String(updateTime);
  }
  return date.toLocaleString('en-HK', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

function destinationLabel(code) {
  const name = ISLAND_LINE_DESTINATIONS[code];
  if (name) {
    return 'Towards ' + name;
  }
  return 'Destination code: ' + code;
}

export function formatTemp(data) {
  const stations = data && data.temperature && data.temperature.data;
  if (!Array.isArray(stations)) {
    return null;
  }
  if (stations.length === 0) {
    return '--';
  }
  const reading = stations.find(function (item) {
    return item.place === STATION_NAME;
  });
  if (!reading || reading.value === undefined || reading.value === null || reading.value === '') {
    return null;
  }
  if (!data.updateTime) {
    return null;
  }
  return STATION_NAME + '\n' + reading.value + ' °C\nLast updated: ' + formatUpdateTime(data.updateTime);
}

export function formatAqhi(data) {
  if (!Array.isArray(data)) {
    return null;
  }
  const reading = data.find(function (item) {
    return item.station === AIR_STATION_NAME;
  });
  if (
    !reading ||
    reading.aqhi === undefined ||
    reading.aqhi === null ||
    reading.aqhi === '' ||
    reading.health_risk === undefined ||
    reading.health_risk === null ||
    reading.health_risk === ''
  ) {
    return null;
  }
  return reading.station + '\nAQHI: ' + reading.aqhi + '\nHealth Risk: ' + reading.health_risk;
}

export function nextTrain(data) {
  if (!data || data.status !== 1) {
    return null;
  }
  const stationData = data.data && data.data['ISL-HKU'];
  const upTrains = stationData && stationData.UP;
  if (!Array.isArray(upTrains) || upTrains.length === 0) {
    return null;
  }
  const train = upTrains[0];
  const minutes = Number(train.ttnt);
  if (!Number.isFinite(minutes) || train.dest === undefined || train.dest === null || train.dest === '') {
    return null;
  }
  return minutes + ' min\n' + destinationLabel(train.dest);
}
