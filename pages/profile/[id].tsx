import { useRouter } from "next/router";
import { Heading, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import prisma from "../../lib/prisma";
import moment from "moment";
import { scaleLog } from "d3-scale";
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import { add, differenceInCalendarDays, format, sub } from "date-fns";
import { groupBy } from "lodash";

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
    x: moment(t.entry_timestamp).unix(),
    y: t.profit_or_loss * 100,
  };
};

const getTicks = (startDate, endDate, num) => {
  console.log(startDate);
  console.log(endDate);
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
  return format(new Date(timestamp * 1000), "dd/MMM");
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

  const { shadow_trade_summary: shadowTrades } = insider;

  const shadowTradesData = shadowTrades.map(toDataPoint);

  const maxDate = Math.max(
    ...shadowTrades.map((t) => moment(t.entry_timestamp).unix())
  );
  const minDate = Math.min(
    ...shadowTrades.map((t) => moment(t.entry_timestamp).unix())
  );

  const ticks = getTicks(
    new Date(minDate * 1000),
    new Date(maxDate * 1000),
    10
  );
  console.log(ticks);

  return (
    <>
      <Text py={4}>wallet address: {id}</Text>
      <ScatterChart
        width={730}
        height={250}
        margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          name="time"
          unit=""
          ticks={ticks}
          tickFormatter={dateFormatter}
        />
        <YAxis dataKey="y" name="% returns" unit="%" />
        <Scatter name="Trades" data={shadowTradesData} fill="#00b5d8" />
      </ScatterChart>
      <Link href={"/"}>
        <Button>Go Back</Button>
      </Link>
    </>
  );
};

export default User;
