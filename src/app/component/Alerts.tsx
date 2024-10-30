import React from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

interface AlertProps {
  alertMessage: string;
  statusCode: any;
  isAlertVissble: boolean;
}

const SimpleAlert: React.FC<AlertProps> = ({ alertMessage, statusCode, isAlertVissble }) => {
  if (!isAlertVissble) return null;

  const isSuccess = statusCode === '200';

  return (
    <Alert className={`bg-black text-white border border-slate-700 w-4/12 absolute top-3 right-2 border-b-4 ${isSuccess ? 'border-green-600' : 'border-red-600'}`}>
      <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.7" d="m10.051 8.102-3.778.322-1.994 1.994a.94.94 0 0 0 .533 1.6l2.698.316m8.39 1.617-.322 3.78-1.994 1.994a.94.94 0 0 1-1.595-.533l-.4-2.652m8.166-11.174a1.366 1.366 0 0 0-1.12-1.12c-1.616-.279-4.906-.623-6.38.853-1.671 1.672-5.211 8.015-6.31 10.023a.932.932 0 0 0 .162 1.111l.828.835.833.832a.932.932 0 0 0 1.111.163c2.008-1.102 8.35-4.642 10.021-6.312 1.475-1.478 1.133-4.77.855-6.385Zm-2.961 3.722a1.88 1.88 0 1 1-3.76 0 1.88 1.88 0 0 1 3.76 0Z" />
      </svg>
      <div className="flex justify-between">
        <AlertTitle>{isSuccess ? 'Success' : 'Error'} {statusCode}</AlertTitle>
        <CountdownCircleTimer
          isPlaying
          duration={4}
          colors={['#fff', '#fff', '#fff', '#fff']}
          colorsTime={[7, 5, 2, 0]}
          size={18}
          strokeWidth={1}
          trailColor={'#000'}
          // onComplete={()=>{}}
        />
      </div>
      <AlertDescription>
        {alertMessage}
      </AlertDescription>
    </Alert>
  );
};


export { SimpleAlert };
