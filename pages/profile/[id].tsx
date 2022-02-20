import { useRouter } from "next/router";
import { Heading, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import prisma from "../../lib/prisma";
import moment from "moment";
import { scaleLog } from "d3-scale";
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";
import { add, differenceInCalendarDays, format, sub } from "date-fns";

type ShadowTrade = {
  //   entryPrice: number;
  profitOrLoss: number;
  entryTimestamp: number;
  exitPrice?: number;
  exitTimestamp?: number;
  collectionName: string;
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
export async function getServerSideProps(id) {
  const insider = await prisma.insider.findUnique({
    where: { id: id as string },
    include: { shadow_trade: true },
  });
  // return { props: { posts: JSON.parse(JSON.stringify(posts)) } };
  return {
    props: {
      insider,
    },
  };
}

const toDataPoint = (t: ShadowTrade) => {
  return {
    x: t.entryTimestamp,
    y: t.profitOrLoss * 100,
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
  return format(new Date(timestamp), "dd/MMM");
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

  const { shadowTrades } = insider;
  const closedTrades = shadowTrades.filter((t: ShadowTrade) => {
    return !!t.exitTimestamp;
  });
  const unrealizedTrades = shadowTrades.filter((t: ShadowTrade) => {
    return !t.exitTimestamp;
  });

  const closedTradeData = closedTrades.map(toDataPoint);
  const unrealizedTradeData = unrealizedTrades.map(toDataPoint);
  console.log(closedTradeData);
  console.log(unrealizedTradeData);
  const maxDate = Math.max(...shadowTrades.map((t) => t.entryTimestamp));
  const minDate = Math.min(...shadowTrades.map((t) => t.entryTimestamp));

  const ticks = getTicks(new Date(minDate), new Date(maxDate), 10);
  console.log(ticks);

  return (
    <>
      <Heading as={"h1"}>🚧🚧🚧 User Page is under construction</Heading>
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
        <Scatter name="Realized Trades" data={closedTradeData} fill="#8884d8" />
        <Scatter
          name="Unrealized Trades"
          data={unrealizedTradeData}
          fill="#FFFFFF"
          stroke="#000000"
        />
      </ScatterChart>
      <Link href={"/"}>
        <Button>Go Back</Button>
      </Link>
    </>
  );
};

export default User;
