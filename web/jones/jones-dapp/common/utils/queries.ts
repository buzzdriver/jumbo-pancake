import axios from "axios";

export const fetchUrl = async <T>(url: string): Promise<T> => {
  try {
    const { data } = await axios.get<T>(url);

    return data;
  } catch (err) {
    throw new Error(`Error while fetching ${url}`);
  }
};
