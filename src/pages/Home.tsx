import { useState, useEffect } from "react";
import { Typography, Card } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LoopIcon from "@mui/icons-material/Loop";

import {
  NewsDetailsResponse,
  useLazyGetAllItemIdQuery,
  useLazyGetNewsByIdQuery,
} from "../app/services/newsApi";
import { NewsCard, Loader } from "../components";

const Home = () => {
  const [news, setNews] = useState<NewsDetailsResponse[]>([]);
  const [newsIds, setNewsIds] = useState<number[]>([]);

  const [getAllItemId, { isFetching: isFetchingAllItems }] =
    useLazyGetAllItemIdQuery({
      pollingInterval: 60000,
    });

  const [getItem, { isFetching: isFetchingItem }] = useLazyGetNewsByIdQuery();

  const fetchAllDataId = async () => {
    await getAllItemId()
      .unwrap()
      .then((res) => {
        setNews([]);

        setNewsIds(res.slice(-100));
      });
  };

  useEffect(() => {
    fetchAllDataId();
  }, []);

  useEffect(() => {
    newsIds?.map(async (id) => {
      await getItem(id)
        .unwrap()
        .then((res) => {
          setNews((oldArray) => [...oldArray, res]);
        });
    });
  }, [newsIds]);

  useEffect(() => {
    const sortedDesc = news?.sort(
      (objA, objB) => Number(objB.time) - Number(objA.time)
    );
    setNews(sortedDesc);
  }, [news]);

  const onRefreshNews = () => {
    fetchAllDataId();
  };

  return (
    <div className="px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
      {isFetchingAllItems || isFetchingItem ? (
        <Loader />
      ) : news.length ? (
        <div className="flex flex-col justify-center items-center">
          <Card
            className="flex flex-row items-center justify-center px-6 py-2 cursor-pointer gap-2"
            onClick={onRefreshNews}
          >
            <LoopIcon style={{ cursor: "pointer" }} />
            <Typography>Reload</Typography>
          </Card>
          <div className="flex flex-col items-center gap-10">
            <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
              {news.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-6 sm:py-24 lg:px-8">
          <CheckCircleOutlineIcon fontSize="large" />

          <Typography className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-4">
            No News available at this moment
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Home;
