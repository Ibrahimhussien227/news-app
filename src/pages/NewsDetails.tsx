import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import LoopIcon from "@mui/icons-material/Loop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Loader } from "../components";
import {
  NewsDetailsResponse,
  useLazyGetNewsByIdQuery,
} from "../app/services/newsApi";
import { CardActionArea } from "@mui/material";

const NewsDetails = () => {
  const [parentComments, setParentComments] = useState<NewsDetailsResponse[]>(
    []
  );
  const [kidsComments, setKidsComments] = useState<NewsDetailsResponse[]>([]);

  const [index, setIndex] = useState(1);
  const [news, setNews] = useState<NewsDetailsResponse>({
    by: "",
    descendants: 0,
    id: 0,
    score: 0,
    time: 0,
    title: "",
    type: "",
    url: "",
    kids: [],
    text: "",
  });

  const date = new Date(news?.time * 1000);

  const { newsId } = useParams();

  const [getItem, { isFetching }] = useLazyGetNewsByIdQuery();

  const fetchNewsDetails = async () => {
    await getItem(newsId!)
      .unwrap()
      .then((res) => setNews(res));
  };

  useEffect(() => {
    fetchNewsDetails();
  }, []);

  useEffect(() => {
    if (news?.kids) {
      news.kids.map(async (id: number) => {
        await getItem(id)
          .unwrap()
          .then((res) => {
            setParentComments((oldComments) => [...oldComments, res]);
          });
      });
    }
  }, [news]);

  const reformateDate = (time: number) => {
    const date = new Date(time * 1000);
    return date.toLocaleDateString("en-US");
  };

  const getKidsComment = async () => {
    parentComments.map(async ({ kids: kidsId }) => {
      await getItem(kidsId)
        .unwrap()
        .then((res) => {
          if (res) {
            setKidsComments((oldComments) => [...oldComments, res]);
          }
        });
    });
  };

  const addElement = () => {
    setKidsComments([]);
    setIndex(parentComments.length);
    getKidsComment();
  };

  const onRefreshNews = () => {
    fetchNewsDetails();
  };

  const getElements = (
    parentComments: NewsDetailsResponse[],
    kidsComments: NewsDetailsResponse[],
    index: number
  ) => {
    return parentComments?.slice(0, index).map((parentComment) => {
      return (
        <div key={parentComment.id}>
          <CardActionArea>
            <div className="flex flex-col justify-center overflow-hidden rounded-lg shadow-lg">
              <p
                className="px-6 mt-5 "
                dangerouslySetInnerHTML={{ __html: parentComment.text }}
              />
              <div className="flex flex-row justify-between items-center p-6 text-gray-500">
                <p>{parentComment.by}</p>
                <p>{reformateDate(parentComment.time)}</p>
              </div>
            </div>
            {index > 0 &&
              kidsComments
                .filter(({ id }) => parentComment?.kids?.includes(id))
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-center overflow-hidden rounded-lg shadow-lg ml-10"
                  >
                    <p
                      className="px-6 mt-5 "
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                    <div className="flex flex-row justify-between items-center p-6 text-gray-500">
                      <p>{item.by}</p>
                      <p>{reformateDate(item.time)}</p>
                    </div>
                  </div>
                ))}
          </CardActionArea>
        </div>
      );
    });
  };

  return (
    <div className="px-6 pt-16 pb-20 lg:px-8 lg:pt-14 lg:pb-28 overflow-hidden rounded-lg shadow-lg">
      {isFetching ? (
        <Loader />
      ) : (
        <div className="mx-auto flex flex-col gap-5">
          <div className="flex items-center justify-between pb-20">
            <Link to="/">
              <ArrowBackIcon />
            </Link>
            <div
              onClick={onRefreshNews}
              className="flex flex-row items-center justify-center gap-2 cursor-pointer overflow-hidden rounded-lg shadow-lg p-2 w-24"
            >
              <LoopIcon style={{ cursor: "pointer" }} />
              <p>Reload</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
              <div className="flex justify-between">
                <p className="text-xl font-semibold text-gray-900">
                  {news?.title}
                </p>
                <Link
                  to={news?.url}
                  className="text-xl border bg-blue-500 text-white rounded-md py-2 px-10"
                >
                  Visit
                </Link>
              </div>
              <div className="mt-6 flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {news?.by}
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <p>{date.toLocaleDateString("en-US")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-base text-gray-900">Total Comments</p>
                  <p className="text-base text-gray-500">{news?.descendants}</p>
                </div>

                <div className="flex justify-center items-center">
                  <StarBorderIcon style={{ color: "black" }} />
                  <p className="text-base text-gray-500">{news?.score}</p>
                </div>
              </div>
            </div>
          </div>
          <div onClick={addElement} className="mt-10 cursor-pointer">
            {getElements(parentComments, kidsComments, index)}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetails;
