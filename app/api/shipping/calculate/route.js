import { NextResponse } from "next/server";

const BASE_RATES = {
  domestic: 5,
  international: 12,
};

const CARRIER_MULTIPLIERS = {
  DHL: 1.5,
  FedEx: 1.4,
  Aramex: 1.3,
  Economy: 1,
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const weight = parseFloat(searchParams.get("weight"));

  if (!from || !to || !weight) {
    return NextResponse.json(
      { error: "Missing parameters" },
      { status: 400 }
    );
  }

  const isDomestic = from === to;

  const baseRate = isDomestic
    ? BASE_RATES.domestic
    : BASE_RATES.international;

  const carriers = Object.keys(CARRIER_MULTIPLIERS);

  const rates = carriers.map((carrier) => {
    const cost =
      baseRate *
      weight *
      CARRIER_MULTIPLIERS[carrier];

    return {
      carrier,
      cost: cost.toFixed(2),
      estimatedDays:
        carrier === "Economy"
          ? 10
          : carrier === "Aramex"
          ? 7
          : 4,
    };
  });

  return NextResponse.json({ rates });
}