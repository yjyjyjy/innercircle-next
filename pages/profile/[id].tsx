import { Flex, Image, Text, Button, Stack, Box, Heading, Link } from "@chakra-ui/react";
// import Link from "next/link";
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
import { format } from "date-fns";
// import { useEffect, useState } from "react";
// import { GiConsoleController } from "react-icons/gi";
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useMediaQuery } from '@chakra-ui/react'



// server side data fetch
export async function getServerSideProps(context) {
  const { id } = context.query;
  const insider = await prisma.insider.findUnique({
    where: { id: id as string },
    include: {
      // opensea_display_name: true,
      // opensea_image_url: true,
      // id: true,
      insider_past_90_days_trading_roi: {
        include: {
          collection: true
        }
      },
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
  const { id, insider_past_90_days_trading_roi, opensea_display_name, opensea_image_url } = insider
  // const ref = useRef();
  console.log(insider)
  const [isBigScreen] = useMediaQuery('(min-width: 500px)')



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
            src={opensea_image_url || '/default_gray.png'} // under public folder
            objectFit={'cover'}
            width={100}
            height={100}
          />
        </Box>
        <Flex ml={3} direction='column'>
          <Heading as={'h2'}>
            {opensea_display_name || 'Unnamed Address'}
          </Heading>
          <Text fontSize={15} pt={2}>
            Address:
            <a href={`https://opensea.io/${id}`} target="_blank">
              <Button variant={'link'}>
                {isBigScreen ? id
                  : `${id.substring(0, 4)}...${id.substring(id.length - 3, id.length)}`
                }
                <ExternalLinkIcon mx={[0, 2]} />
              </Button>
            </a>
          </Text>
        </Flex>
      </Flex>

      <Flex direction={'column'} >
        <Heading as={'h2'} fontSize={20} py={3}>
          Last 90 Days Trading Record
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
            height={300}
            margin={{ top: 30, right: 20, bottom: 10, left: 10 }}

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
            <Tooltip content={<CustomTooltip payload={trades} />} />
            <ReferenceLine y="0" stroke="green" label="Break Even" strokeDasharray="3 3" alwaysShow={true} />
            <ReferenceLine y="-100" stroke="red" label="Complete Loss" strokeDasharray="3 3" />
            <Scatter name="A school" data={trades} fill="#8884d8" />
          </ScatterChart>
        </Box>
      </Flex>

      <Link href={"/"}>
        <Button>
          Go Back
        </Button>
      </Link>

    </Stack >
  );
};
//  <ExternalLinkIcon mx={[0, 2]} />
export default User;
