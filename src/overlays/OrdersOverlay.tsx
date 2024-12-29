import { Socket } from 'socket.io-client';
import { useCallback, useEffect, useState } from 'react';
import { Order } from '../api';
import OrderList from '../components/OrderList';

interface Props {
  socket: Socket;
}

export default function OrdersOverlay({ socket }: Props) {
  const [orders, setOrders] = useState<Order[]>([
    {
      number: -420,
      startTime: new Date().toISOString(),
      timeoutSeconds: 3600,
    },
    {
      number: -69,
      startTime: new Date().toISOString(),
      timeoutSeconds: 3600,
    },
  ]);

  useEffect(() => {
    socket.on('orders', (newOrderSet) => {
      setOrders(newOrderSet[0].orders);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [socket]);

  const pruneAndGetShortestTime = useCallback(() => {
    let shortestTimeTillEnd = 360 * 1000;

    for (let i = 0; i < orders.length; i++) {
      const timeTillOrderEnd = new Date(orders[i].startTime).getTime() + orders[i].timeoutSeconds * 1000 - Date.now();

      if (timeTillOrderEnd < 0) {
        setOrders(orders.toSpliced(i, 1));
        i--;
        return -1;
      }

      if (timeTillOrderEnd < shortestTimeTillEnd) {
        shortestTimeTillEnd = timeTillOrderEnd;
      }
    }

    return shortestTimeTillEnd;
  }, [orders]);

  useEffect(() => {
    const shortestTimeTillEnd = pruneAndGetShortestTime();

    if (shortestTimeTillEnd == -1) {
      return;
    }

    setTimeout(pruneAndGetShortestTime, shortestTimeTillEnd + 10);
  }, [orders, pruneAndGetShortestTime]);

  return <OrderList orders={orders} />;
}
