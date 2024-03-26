import { useState } from "react";

const useNotification = (): [string | null, (notification: string) => void] => {
  const [value, setValue] = useState<string | null>(null);

  const setNotification = (notification: string) => {
    setValue(notification);
    setTimeout(() => {
      setValue(null);
    }, 5000);
  };

  return [value, setNotification];
};

export default useNotification;
