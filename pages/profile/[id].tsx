import { useRouter } from "next/router";
import { Heading, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import prisma from "../../lib/prisma";
import moment from "moment";
import { scaleLog } from "d3-scale";
import {
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import { add, differenceInCalendarDays, format, sub } from "date-fns";
import { groupBy } from "lodash";
import { useEffect, useRef, useState } from "react";

type ShadowTrade = {
  //   entryPrice: number;
  profit_or_loss: number;
  entry_timestamp: number;
  exit_timestamp?: number;
  collection_name: string;
};

// const getRandomTrade = () => {
//   const entryDateAgo = Math.round(Math.random() * 100);
//   const entryMoment = sub(new Date(), { days: entryDateAgo });
//   const entryTimestamp = entryMoment.getTime();
//   const hasClosed = Math.round(Math.random()) === 0;

//   const trade: ShadowTrade = {
//     profitOrLoss: (Math.random() - 0.5) * 3,
//     entryTimestamp,
//     collectionName: "Bored Ape Yacht Club",
//   };
//   if (hasClosed) {
//     const closedDaysAfter = Math.round(Math.random() * 100);
//     trade.exitTimestamp = sub(entryMoment, { days: closedDaysAfter }).getTime();
//   }
//   console.log(trade);
//   return trade;
// };

// let shadowTrades = new Array(100).fill(getRandomTrade());
// shadowTrades = shadowTrades.map((_) => getRandomTrade());

// server side data fetch
export async function getServerSideProps(context) {
  const { id } = context.query;
  const insider = await prisma.insider.findUnique({
    where: { id: id as string },
    include: { shadow_trade_summary: true },
  });
  console.log("end");
  // return { props: { posts: JSON.parse(JSON.stringify(posts)) } };
  return {
    props: {
      insider: JSON.parse(JSON.stringify(insider)),
    },
  };
}

const toDataPoint = (t: ShadowTrade) => {
  return {
    x: moment(t.entry_timestamp).unix() * 1000,
    y: t.profit_or_loss * 100,
  };
};

const getTicks = (startDate, endDate, num) => {
  const diffDays = differenceInCalendarDays(endDate, startDate);

  let current = startDate,
    velocity = Math.round(diffDays / (num - 1));

  const ticks = [startDate.getTime()];

  for (let i = 1; i < num - 1; i++) {
    ticks.push(add(current, { days: i * velocity }).getTime());
  }

  ticks.push(endDate.getTime());
  return ticks;
};

const dateFormatter = (timestamp: number) => {
  const dateStr = format(new Date(timestamp), "M/dd");
  console.log(dateStr);
  return dateStr;
};

// const getYScale = (scale) => {
//   var positive = scaleLog()
//     .domain([1e-6, 1000])
//     .range([250 / 2, 0]);

//   var negative = scaleLog()
//     .domain([-1000, -1e-6])
//     .range([250, 250 / 2]);

//   if (scale > 1e-6) return positive(scale);
//   else if (scale < -1e-6) return negative(scale);
//   else return 250 / 2; // zero value.
// };

const User = ({ insider }) => {
  const router = useRouter();
  const { id } = router.query;

  const ref = useRef();
  const [graphWidth, setGraphWidth] = useState(1024);
  const { shadow_trade_summary: shadowTrades } = insider;

  const shadowTradesData = shadowTrades.map(toDataPoint);

  shadowTradesData.sort((a, b) => a.x - b.x);
  const maxDate = Math.max(
    ...shadowTrades.map((t) => moment(t.entry_timestamp).unix())
  );
  const minDate = Math.min(
    ...shadowTrades.map((t) => moment(t.entry_timestamp).unix())
  );

  const ticks = getTicks(new Date(minDate * 1000), new Date(maxDate * 1000), 5);
  console.log(ticks);

  useEffect(() => {
    setGraphWidth(ref?.current?.clientWidth || 1024);
  }, []);

  return (
    <div ref={ref}>
      <Text py={4}>wallet address: {id}</Text>
      <ScatterChart
        width={graphWidth}
        height={300}
        margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <ReferenceLine y="0" stroke="green" label="Break Even" />
        <XAxis
          dataKey="x"
          name="time"
          scale="time"
          type="number"
          ticks={ticks}
          domain={[() => minDate * 1000, () => maxDate * 1000]}
          tickFormatter={dateFormatter}
        />
        <YAxis dataKey="y" name="% returns" unit="%" />
        <Scatter name="Trades" data={shadowTradesData} fill="#00b5d8" />
      </ScatterChart>
      <Link href={"/"}>
        <Button>Go Back</Button>
      </Link>
    </div>
  );
};

export default User;
