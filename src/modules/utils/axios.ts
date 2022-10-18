import axios from 'axios';
import config from '../../config/config';

interface MoralisHeader {
  Accept: string;
  'X-API-Key': string;
}

async function axiosFetchJSON<T>(url: string, headers?: MoralisHeader): Promise<T> {
  const { data, status } = await axios.get<T>(url, {
    headers: headers ?? {
      Accept: 'application/json',
      'X-API-Key': config.moralis.key,
    },
  });
  if (status !== 200) {
    throw new Error(`axiosFetchJSON Request for ${url} failed: code ${status}`);
  }
  return data;
}

export default axiosFetchJSON;
