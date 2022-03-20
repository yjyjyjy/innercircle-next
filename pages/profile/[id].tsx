import { useRouter } from "next/router";
import { Heading, Text, Button, Stack } from "@chakra-ui/react";
import Link from "next/link";
import prisma from "../../lib/prisma";
import moment from "moment";
import {
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import { add, differenceInCalendarDays, format, sub } from "date-fns";
import { useEffect, useRef, useState } from "react";

type ShadowTrade = {
  //   entryPrice: number;
  profit_or_loss: number;
  entry_timestamp: number;
  exit_timestamp?: number;
  collection_name: string;
};

// server side data fetch
export async function getServerSideProps(context) {
  const { id } = context.query;
  const insider = await prisma.insider.findUnique({
    where: { id: id as string },
    include: { insider_past_90_days_trading_roi: true },
  });
  console.log('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨')
  console.log(insider.insider_past_90_days_trading_roi[0].buy_date)
  console.log(new Date(insider.insider_past_90_days_trading_roi[0].buy_date).getTime())
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
    setGraphWidth(1024);
  }, []);

  return (
    <Stack direction={'column'}>
      <Text fontSize={20} fontWeight={'bold'} py={10}>
        Smart Money Wallet recent trading ROI: <br />{id}
      </Text>
      <div ref={ref}>
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
    </Stack >
  );
};

export default User;
