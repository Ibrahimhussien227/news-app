import { useNavigate } from "react-router-dom";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Card, CardActionArea, Typography } from "@mui/material";

import { NewsDetailsResponse } from "../app/services/newsApi";
import React from "react";

interface PropsType {
  news: NewsDetailsResponse;
}

const NewsCard: React.FC<PropsType> = ({
  news: { id, title, by, time, descendants, score },
}) => {
  const navigate = useNavigate();
  const date = new Date(time * 1000);

  return (
    <CardActionArea>
      <Card
        className="flex h-full"
        onClick={() => {
          navigate(`/news/${id}`);
        }}
      >
        <div className="flex flex-1 flex-col justify-between bg-white p-6">
          <div className="flex-1">
            <Typography className="text-xl font-semibold text-gray-900">
              {title}
            </Typography>
          </div>
          <div className="mt-6 flex justify-between">
            <div>
              <Typography className="text-sm font-medium text-gray-900">
                {by}
              </Typography>
              <div className="flex space-x-1 text-sm text-gray-500">
                <Typography>{date.toLocaleDateString("en-US")}</Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Typography className="text-base text-gray-900">
                Total Comments
              </Typography>
              <Typography className="text-base text-gray-500">
                {descendants}
              </Typography>
            </div>

            <div className="flex justify-center items-center">
              <StarBorderIcon style={{ color: "black" }} />
              <Typography className="text-base text-gray-500">
                {score}
              </Typography>
            </div>
          </div>
        </div>
      </Card>
    </CardActionArea>
  );
};

export default NewsCard;
