import { Link, Flex, Image, Text, Button, Stack, Box, Heading, AccordionButton } from "@chakra-ui/react";
import prisma from "../../lib/prisma";
import {
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  Label,
  Tooltip
} from "recharts";
import { add, differenceInCalendarDays, format, sub } from "date-fns";
// import { useEffect, useRef, useState } from "react";
// import { GiConsoleController } from "react-icons/gi";
import { ExternalLinkIcon } from '@chakra-ui/icons'


// server side data fetch
export async function getServerSideProps(context) {
  const { id } = context.query;
  const insider = await prisma.insider.findUnique({
    where: { id: id as string },
    include: {
      insider_past_90_days_trading_roi: {
        include: {
          collection: true
        }
      },
      insider_metadata: true
    },
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box bg={'white'}>
        <Text>{payload[0].payload.collection_name}</Text>
        <Text>Investment: {Math.round(payload[0].payload.investment * 10) / 10} ETH</Text>
        <Text>Return: {Math.round(payload[0].payload.roi * 10) / 10} %</Text>
        <Text>Gain: {Math.round((payload[0].payload.investment * payload[0].payload.roi / 10) / 10)} ETH</Text>
      </Box>
    );
  }

  return null;
};


const User = ({ insider }) => {
  const { id, insider_past_90_days_trading_roi, insider_metadata } = insider
  // const ref = useRef();
  console.log(insider_past_90_days_trading_roi)


  const trades = insider_past_90_days_trading_roi.map(roi => ({
    "timestamp": new Date(roi.buy_date).getTime(),
    "roi": roi.roi_pct * 100,
    'investment': roi.buy_eth_amount,
    'total_gain': Math.round(roi.total_gain),
    'collection_name': roi.collection.name
  }))

  const maxDate = Math.max(...trades.map(t => t.timestamp)) + 86400000 * 8;
  const minDate = Math.min(...trades.map(t => t.timestamp)) - 86400000 * 8;

  return (
    <Stack direction={'column'} maxW={'100%'}>
      <Flex h='120px' w='100%' direction={'row'} p={5}>
        <Box
          borderRadius={"50%"}
          overflow="hidden"
          border="2px"
          borderColor={"white"}
          width={100}
          height={100}
        >
          <Image
            src={insider_metadata.opensea_image_url}
            objectFit={'cover'}
            width={100}
            height={100}
          />
        </Box>
        <Flex ml={3} direction='column'>
          <Heading as={'h2'}>
            {insider_metadata.opensea_display_name}
          </Heading>
          <Text fontSize={15} pt={2}>
            Address: <Link
              href={`https://opensea.io/${id}`}
              isExternal
            >{`${id.substring(0, 3)}...${id.substring(id.length - 3, id.length)}`} <ExternalLinkIcon mx={[0, 2]} /></Link>
          </Text>
        </Flex>
      </Flex>

      <Flex direction={'column'} >
        <Heading as={'h2'} fontSize={20} py={2}>
          Last 90 Days Trading Perf.
        </Heading>
        <Text fontSize={16} fontWeight={'bold'}>
          Total Gain: {trades[0].total_gain} ETH
        </Text>
        <Text fontSize={16} fontWeight={'bold'} pb={4}>
          {trades.filter(t => t.roi > 0).length} out of {trades.length} trades profitable ({Math.round(trades.filter(t => t.roi > 0).length / trades.length * 1000) / 10}%)
        </Text>
        <Box overflow='scroll'>
          <ScatterChart
            width={600}
            height={250}
            margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
          >
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
            <ZAxis dataKey="investment" range={[10, 20]} name="investment" unit={'ETH'} />
            {/* <Tooltip payload={[{ name: '05-01', value: 12, unit: 'kg' }]} /> */}
            {/* <Tooltip content={<CustomTooltip payload={payload} />} /> */}
            <Tooltip content={<CustomTooltip payload={trades} />} />
            {/*<Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend /> */}
            <ReferenceLine y="0" stroke="green" label="Break Even" strokeDasharray="3 3" alwaysShow={true} />
            <ReferenceLine y="-100" stroke="red" label="Complete Loss" strokeDasharray="3 3" />
            <Scatter name="A school" data={trades} fill="#8884d8" />
          </ScatterChart>
        </Box>
      </Flex>
      <Link href={"/"}>
        <Button>Go Back</Button>
      </Link>
    </Stack >
  );
};

export default User;
