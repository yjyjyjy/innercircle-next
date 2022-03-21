import { Heading, Text, Button, Stack, Box } from "@chakra-ui/react";
import Link from "next/link";
import prisma from "../../lib/prisma";
import {
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  Label
} from "recharts";
import { add, differenceInCalendarDays, format, sub } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { GiConsoleController } from "react-icons/gi";


// server side data fetch
export async function getServerSideProps(context) {
  const { id } = context.query;
  const insider = await prisma.insider.findUnique({
    where: { id: id as string },
    include: { insider_past_90_days_trading_roi: true },
  });

  return {
    props: {
      insider: JSON.parse(JSON.stringify(insider)),
    },
  };
}

// const getTicks = (startDate, endDate, num) => {
//   const diffDays = differenceInCalendarDays(endDate, startDate);

//   let current = startDate,
//     velocity = Math.round(diffDays / (num - 1));

//   const ticks = [startDate.getTime()];

//   for (let i = 1; i < num - 1; i++) {
//     ticks.push(add(current, { days: i * velocity }).getTime());
//   }

//   ticks.push(endDate.getTime());
//   return ticks;
// };

const dateFormatter = (timestamp: number) => {
  const dateStr = format(new Date(timestamp), "MMM/dd");
  return dateStr;
};

const User = ({ insider }) => {

  const { id, insider_past_90_days_trading_roi } = insider
  // const ref = useRef();

  const trades = insider_past_90_days_trading_roi.map(roi => ({
    "timestamp": new Date(roi.buy_date).getTime(),
    "roi": roi.roi_pct * 100,
    'investment': roi.buy_eth_amount,
    'total_gain': Math.round(roi.total_gain)
  }))

  const maxDate = Math.max(...trades.map(t => t.timestamp)) + 86400000 * 8;
  const minDate = Math.min(...trades.map(t => t.timestamp)) - 86400000 * 8;


  return (
    <Stack direction={'column'}>
      <Text fontSize={18} fontWeight={'bold'} pt={10}>
        Wallet Address:
      </Text>
      <Text fontSize={15}>{id}</Text>
      <Text fontSize={18} fontWeight={'bold'} pt={2}>Last 90 days Trading Gain: {trades[0].total_gain} ETH</Text>
      <Box>
        <ScatterChart width={730} height={250}
          margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            name="time"
            type="number"
            domain={[() => minDate, () => maxDate]}
            tickFormatter={dateFormatter}
          />
          <YAxis
            dataKey="roi"
            unit="%"
            domain={['auto', 'auto']}
          >
            <Label value="Trade Return" angle={-90} offset={5} position="left" />
          </YAxis>
          <ZAxis dataKey="investment" range={[10, 20]} name="score" unit="km" />
          {/*<Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend /> */}
          <ReferenceLine y="0" stroke="green" label="Break Even" strokeDasharray="3 3" alwaysShow={true} />
          <ReferenceLine y="-100" stroke="red" label="Complete Loss" strokeDasharray="3 3" />
          <Scatter name="A school" data={trades} fill="#8884d8" />
        </ScatterChart>
        <Link href={"/"}>
          <Button>Go Back</Button>
        </Link>
      </Box>
    </Stack >
  );
};

export default User;
