"use client";

import { useEffect, useState } from "react";

export default function ClientOnlyDate({ date }: { date: string }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(new Date(date).toLocaleString());
  }, [date]);

  return <>{formattedDate}</>;
}
