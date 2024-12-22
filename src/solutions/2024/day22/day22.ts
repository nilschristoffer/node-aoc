const bitwiseXor = (a: number, b: number) => {
  let bitsA = a.toString(2);
  let bitsB = b.toString(2);

  bitsA = bitsA.padStart(bitsB.length, "0");
  bitsB = bitsB.padStart(bitsA.length, "0");

  let result = "";
  for (let i = 0; i < bitsA.length; i++) {
    result += bitsA[i] === bitsB[i] ? "0" : "1";
  }
  return parseInt(result, 2);
};

export const mix = bitwiseXor;
export const prune = (val: number) => val % 16777216;

export const processSecret = (initialSecret: number) => {
  let secret = initialSecret;
  let result = secret * 64;
  secret = mix(result, secret);
  secret = prune(secret);

  result = Math.floor(secret / 32);
  secret = mix(result, secret);
  secret = prune(secret);

  result = secret * 2048;
  secret = mix(result, secret);
  secret = prune(secret);

  return secret;
};

const price = (secret: number) => {
  return secret % 10;
};

const processTimes = (secret: number, times: number) => {
  let result = secret;
  for (let i = 0; i < times; i++) {
    result = processSecret(result);
  }
  return result;
};

export const getAllSequences = (
  secret: number,
  times: number
): { [seqKey: string]: number } => {
  let sequences: { [seqKey: string]: number } = {};
  const fourSecrets = Array.from({ length: 3 }).reduce<number[]>(
    (acc) => {
      const newSecret = processSecret(acc[acc.length - 1]);
      acc.push(newSecret);
      return acc;
    },
    [secret]
  );

  for (let i = 4; i < times; i++) {
    const nextSecret = processSecret(fourSecrets[fourSecrets.length - 1]);

    const nextPrice = price(nextSecret);

    const prices = [...fourSecrets.map(price), nextPrice];
    const diffs = prices.slice(1).map((p, i) => p - prices[i]);
    const seqKey = diffs.join(",");

    if (!sequences[seqKey]) {
      sequences[seqKey] = nextPrice;
    }
    fourSecrets.shift();
    fourSecrets.push(nextSecret);
  }
  return sequences;
};

export const solveStar1 = (input: string[], n = 2000) => {
  return input.reduce((acc, curr) => {
    return acc + processTimes(Number(curr), n);
  }, 0);
};

export const solveStar2 = (input: string[]) => {
  const sumBySequence = input.reduce<{ [seqKey: string]: number }>(
    (acc, secret) => {
      const sequences = getAllSequences(Number(secret), 2005);

      Object.entries(sequences).forEach(([seqKey, price]) => {
        acc[seqKey] = (acc[seqKey] || 0) + price;
      });
      return acc;
    },
    {}
  );

  const bestSequence = Math.max(...Object.values(sumBySequence));

  return bestSequence;
};
